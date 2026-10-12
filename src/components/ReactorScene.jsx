import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
import { geometry, totalHeight, isWallArc, cathodeAngle } from "../domain/geometry.js";

const colors = {
  housing: 0xb6cdcc,
  anode: 0x354348,
  cathode: 0x287d79,
  separator: 0xc9a15d,
  liquid: 0x73aebc,
  wiring: 0xb67546,
};
function label(text, x, y, z) {
  const el = document.createElement("span");
  el.className = "model-label";
  el.textContent = text;
  const o = new CSS2DObject(el);
  o.position.set(x, y, z);
  return o;
}
function tube(points, r, color) {
  const curve = new THREE.CatmullRomCurve3(
    points.map((p) => new THREE.Vector3(...p)),
  );
  return new THREE.Mesh(
    new THREE.TubeGeometry(curve, 32, r, 8, false),
    new THREE.MeshStandardMaterial({ color, roughness: 0.6 }),
  );
}
function wallGeometry(c, cutaway) {
  const vertices = [],
    indices = [];
  const steps = 112,
    levels = [
      0,
      c.cathodeBottom,
      c.cathodeBottom + c.cathodeHeight,
      c.bodyHeight,
    ];
  const angle = cathodeAngle(c) / 2;
  for (let j = 0; j < levels.length - 1; j++)
    for (let i = 0; i < steps; i++) {
      const a = (i / steps) * Math.PI * 2,
        b = ((i + 1) / steps) * Math.PI * 2,
        mid = (a + b) / 2;
      const signed = Math.atan2(Math.sin(mid), Math.cos(mid));
      if (j === 1 && Math.abs(signed) < angle) continue;
      if (cutaway && mid > Math.PI * 0.15 && mid < Math.PI * 0.84) continue;
      const offset = vertices.length / 3;
      for (const [t, y] of [
        [a, levels[j]],
        [b, levels[j]],
        [a, levels[j + 1]],
        [b, levels[j + 1]],
      ])
        vertices.push(
          Math.cos(t) * (c.radius + c.wallThickness),
          y,
          Math.sin(t) * (c.radius + c.wallThickness),
        );
      indices.push(
        offset,
        offset + 1,
        offset + 2,
        offset + 1,
        offset + 3,
        offset + 2,
      );
    }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}
// Finite-thickness curved backing. Its rendered surface is not added to the
// electrode-area calculation: filter conductivity and microstructure are unknown.
function arcBand(radius, thickness, height, start, span) {
  const vertices = [], indices = [];
  const point = (r, y, angle) => [r * Math.cos(angle), y, r * Math.sin(angle)];
  const quad = (...points) => {
    const offset = vertices.length / 3;
    points.forEach(p => vertices.push(...p));
    indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
  };
  const inner = radius - thickness / 2, outer = radius + thickness / 2;
  const steps = Math.max(12, Math.ceil(span / (2 * Math.PI) * 112));
  for (let i = 0; i < steps; i++) {
    const a = start + span * i / steps, b = start + span * (i + 1) / steps;
    quad(point(outer, 0, a), point(outer, height, a), point(outer, height, b), point(outer, 0, b));
    quad(point(inner, 0, b), point(inner, height, b), point(inner, height, a), point(inner, 0, a));
    quad(point(inner, height, a), point(inner, height, b), point(outer, height, b), point(outer, height, a));
    quad(point(inner, 0, b), point(inner, 0, a), point(outer, 0, a), point(outer, 0, b));
  }
  for (const a of [start, start + span])
    quad(point(inner, 0, a), point(inner, height, a), point(outer, height, a), point(outer, 0, a));
  const result = new THREE.BufferGeometry();
  result.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  result.setIndex(indices);
  result.computeVertexNormals();
  result.computeBoundingBox();
  result.computeBoundingSphere();
  return result;
}
function disposeObject(o) {
  o.traverse((x) => {
    x.geometry?.dispose();
    if (x.material) {
      const ms = Array.isArray(x.material) ? x.material : [x.material];
      ms.forEach((m) => m.dispose());
    }
    if (x instanceof CSS2DObject) x.element.remove();
  });
}
export default function ReactorScene({
  config,
  view,
  layers,
  dimensions,
  onSelect,
  resetKey,
}) {
  const container = useRef(null),
    engine = useRef(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const el = container.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setError(
        "3D is unavailable in this browser. Dimensions and calculations remain available. Try a browser with WebGL enabled.",
      );
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.domElement.setAttribute(
      "aria-label",
      "Interactive bottle reactor. Drag to rotate, scroll to zoom, right drag to pan. Use view and layer controls for accessible component information.",
    );
    renderer.domElement.setAttribute("role", "img");
    el.appendChild(renderer.domElement);
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.domElement.className = "labels";
    el.appendChild(labelRenderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.001, 4);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 0.09;
    controls.maxDistance = 1.2;
    scene.add(new THREE.HemisphereLight(0xe5f1f0, 0xb5bbb9, 2.8));
    const light = new THREE.DirectionalLight(0xffffff, 3.5);
    light.position.set(0.2, 0.3, 0.3);
    scene.add(light);
    const fill = new THREE.DirectionalLight(0xffffff, 1.6);
    fill.position.set(-0.3, 0.1, -0.2);
    scene.add(fill);
    const grid = new THREE.GridHelper(0.45, 18, 0xb6c9c8, 0xd9e2de);
    grid.position.y = -0.006;
    grid.material.transparent = true;
    grid.material.opacity = 0.5;
    scene.add(grid);
    const root = new THREE.Group();
    scene.add(root);
    const reset = (height) => {
      const bounds = new THREE.Box3().setFromObject(root);
      const center = bounds.isEmpty()
        ? new THREE.Vector3(0, height / 2, 0)
        : bounds.getCenter(new THREE.Vector3());
      const size = bounds.isEmpty()
        ? new THREE.Vector3(0.17, height + 0.04, 0.09)
        : bounds.getSize(new THREE.Vector3());
      const radius = size.length() / 2;
      const halfFov = Math.atan(
        Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) *
          Math.min(1, camera.aspect),
      );
      const distance = (radius / Math.sin(halfFov)) * 1.08;
      camera.position
        .copy(center)
        .add(
          new THREE.Vector3(0.65, 0.42, 0.75)
            .normalize()
            .multiplyScalar(distance),
        );
      controls.target.copy(center);
      controls.update();
    };
    const resize = () => {
      const w = el.clientWidth,
        h = el.clientHeight;
      renderer.setSize(w, h);
      labelRenderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    resize();
    const raycaster = new THREE.Raycaster();
    let start;
    const down = (e) => {
      start = [e.clientX, e.clientY];
    };
    const up = (e) => {
      if (!start || Math.hypot(e.clientX - start[0], e.clientY - start[1]) > 5)
        return;
      const rect = el.getBoundingClientRect();
      raycaster.setFromCamera(
        new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          (-(e.clientY - rect.top) / rect.height) * 2 + 1,
        ),
        camera,
      );
      const hit = raycaster
        .intersectObjects(root.children, true)
        .find((x) => x.object.userData.part);
      if (hit) engine.current.onSelect(hit.object.userData.part);
    };
    renderer.domElement.addEventListener("pointerdown", down);
    renderer.domElement.addEventListener("pointerup", up);
    renderer.setAnimationLoop(() => {
      controls.update();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    });
    engine.current = { scene, root, camera, controls, reset, onSelect };
    return () => {
      observer.disconnect();
      renderer.setAnimationLoop(null);
      controls.dispose();
      disposeObject(root);
      grid.geometry.dispose();
      grid.material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      labelRenderer.domElement.remove();
      engine.current = null;
    };
  }, []);
  useEffect(() => {
    if (engine.current) engine.current.onSelect = onSelect;
  }, [onSelect]);
  useEffect(() => {
    engine.current?.reset(totalHeight(config));
  }, [resetKey]);
  useEffect(() => {
    const e = engine.current;
    if (!e) return;
    const c = config,
      g = geometry(c),
      h = totalHeight(c),
      exploded = view === "exploded",
      cutaway = view === "cutaway";
    disposeObject(e.root);
    e.root.clear();
    const groups = {};
    for (const key of Object.keys(colors)) {
      const group = new THREE.Group();
      group.visible = layers[key] !== false;
      groups[key] = group;
      e.root.add(group);
    }
    const mat = (key, transparent = false, opacity = 1) =>
      new THREE.MeshStandardMaterial({
        color: colors[key],
        roughness: key === "anode" ? 0.95 : 0.55,
        metalness: key === "wiring" ? 0.5 : 0.05,
        side: THREE.DoubleSide,
        transparent,
        opacity,
        depthWrite: !transparent,
      });
    const add = (group, geo, material, position, part) => {
      const mesh = new THREE.Mesh(geo, material);
      mesh.position.set(...position);
      mesh.userData.part = part;
      group.add(mesh);
      return mesh;
    };
    const ring = (
      radius,
      y,
      key = "housing",
      part = "Housing & conceptual seals",
    ) => {
      const r = add(
        groups[key],
        new THREE.TorusGeometry(radius, 0.0014, 8, 80),
        mat(key),
        [0, y, 0],
        part,
      );
      r.rotation.x = Math.PI / 2;
    };
    add(
      groups.housing,
      wallGeometry(c, cutaway),
      mat("housing", true, c.shape === "white" ? 0.48 : 0.3),
      [0, 0, 0],
      "Housing & conceptual seals",
    );
    add(
      groups.housing,
      new THREE.CylinderGeometry(
        c.radius + c.wallThickness,
        c.radius + c.wallThickness,
        c.wallThickness,
        80,
      ),
      mat("housing"),
      [0, -c.wallThickness / 2 - (exploded ? 0.035 : 0), 0],
      "Housing & conceptual seals",
    );
    const shoulderShift = exploded ? 0.04 : 0;
    const profile = [
      new THREE.Vector2(c.radius + c.wallThickness, c.bodyHeight),
      new THREE.Vector2(
        c.neckRadius + c.wallThickness,
        c.bodyHeight + c.shoulderHeight,
      ),
      new THREE.Vector2(c.neckRadius + c.wallThickness, h),
    ];
    add(
      groups.housing,
      new THREE.LatheGeometry(
        profile,
        80,
        cutaway ? Math.PI * 0.84 : 0,
        cutaway ? Math.PI * 1.3 : Math.PI * 2,
      ),
      mat("housing", true, 0.34),
      [0, shoulderShift, 0],
      "Housing & conceptual seals",
    );
    ring(c.radius + c.wallThickness, 0.004);
    ring(c.radius + c.wallThickness, c.bodyHeight + shoulderShift);
    ring(c.neckRadius + c.wallThickness, h + shoulderShift);
    for (let i = 0; i < 3; i++)
      ring(
        c.neckRadius + c.wallThickness + 0.001,
        h - 0.006 + i * 0.002 + shoulderShift,
      );
    const capShift = exploded ? 0.068 : 0;
    add(
      groups.housing,
      new THREE.CylinderGeometry(
        c.neckRadius + 0.003,
        c.neckRadius + 0.003,
        0.006,
        40,
      ),
      mat("housing"),
      [0, h + 0.003 + capShift, 0],
      "Vented outlet · schematic",
    );
    const vent = tube(
      [
        [0, h + 0.006 + capShift, 0],
        [0, h + 0.022 + capShift, 0],
        [0.014, h + 0.03 + capShift, 0],
      ],
      0.002,
      0x91acaa,
    );
    vent.userData.part = "Vented outlet · schematic";
    groups.housing.add(vent);
    const water = mat("liquid", true, 0.2);
    const bodyFill = Math.min(c.bodyHeight, c.liquidHeight);
    if (bodyFill > 0)
      add(
        groups.liquid,
        new THREE.CylinderGeometry(c.radius, c.radius, bodyFill, 80),
        water,
        [0, bodyFill / 2, 0],
        "Liquid · geometric working volume",
      );
    const sh = Math.min(
      c.shoulderHeight,
      Math.max(0, c.liquidHeight - c.bodyHeight),
    );
    if (sh > 0) {
      const r = c.radius + ((c.neckRadius - c.radius) * sh) / c.shoulderHeight;
      add(
        groups.liquid,
        new THREE.CylinderGeometry(r, c.radius, sh, 80),
        water,
        [0, c.bodyHeight + sh / 2, 0],
        "Liquid · geometric working volume",
      );
    }
    const nh = Math.max(0, c.liquidHeight - c.bodyHeight - c.shoulderHeight);
    if (nh > 0)
      add(
        groups.liquid,
        new THREE.CylinderGeometry(c.neckRadius, c.neckRadius, nh, 40),
        water,
        [0, h - c.neckHeight + nh / 2, 0],
        "Liquid · geometric working volume",
      );
    const liquidR =
      c.liquidHeight <= c.bodyHeight
        ? c.radius
        : c.liquidHeight <= c.bodyHeight + c.shoulderHeight
          ? c.radius +
            ((c.neckRadius - c.radius) * (c.liquidHeight - c.bodyHeight)) /
              c.shoulderHeight
          : c.neckRadius;
    if (c.liquidHeight > 0)
      ring(
        liquidR,
        c.liquidHeight,
        "liquid",
        "Liquid · geometric working volume",
      );
    if (isWallArc(c)) {
      const layout = g.layout;
      const anodeShift = exploded ? -0.055 : 0;
      const cathodeShift = exploded ? 0.055 : 0;
      add(groups.anode,
        arcBand(c.radius - c.anodeWallInset - c.filterThickness / 2, c.filterThickness, c.rodHeight, layout.anodeStart, layout.anodeSpan),
        new THREE.MeshStandardMaterial({color: 0x65736b, roughness: 1, side: THREE.DoubleSide, transparent: true, opacity: 0.65, depthWrite: false}),
        [anodeShift, c.rodBottom, 0], "Anode · graphite cores");
      for (const pos of layout.positions)
        add(groups.anode, new THREE.CylinderGeometry(c.rodRadius, c.rodRadius, c.rodHeight, 20), mat("anode"),
          [pos.x + anodeShift, c.rodBottom + c.rodHeight / 2, pos.z], "Anode · graphite cores");
      // Wet-side hood-filter backing is a declared reconstruction assumption.
      add(groups.cathode,
        arcBand(c.radius - c.filterThickness / 2, c.filterThickness, c.cathodeHeight, -layout.halfAngle, 2 * layout.halfAngle),
        mat("cathode", true, 0.38), [cathodeShift, c.cathodeBottom, 0], "Cathode · projected air window");
      for (const pos of layout.cathodePositions)
        add(groups.cathode, new THREE.CylinderGeometry(c.rodRadius, c.rodRadius, c.rodHeight, 20), mat("anode"),
          [pos.x + cathodeShift, c.cathodeBottom + c.rodHeight / 2, pos.z], "Cathode · projected air window");
      const outline = arcBand(c.radius + c.wallThickness, 0.001, c.cathodeHeight, -layout.halfAngle, 2 * layout.halfAngle);
      const perimeter = new THREE.EdgesGeometry(outline);
      outline.dispose();
      const frame = new THREE.LineSegments(perimeter, new THREE.LineBasicMaterial({color: 0x4d8580}));
      frame.position.set(cathodeShift, c.cathodeBottom, 0);
      groups.cathode.add(frame);
      const blocked = c.cathodeHeight * (1 - c.exposedFraction);
      if (blocked > 0)
        add(groups.cathode, arcBand(c.radius + c.wallThickness + 0.003, 0.001, blocked, -layout.halfAngle, 2 * layout.halfAngle),
          new THREE.MeshStandardMaterial({color: 0xb4bbba, roughness: 0.8, side: THREE.DoubleSide}),
          [cathodeShift, c.cathodeBottom + c.cathodeHeight - blocked, 0], "Cathode · projected air window");
      if (c.separator === "boundary")
        for (const pos of layout.spacerPositions) {
          add(groups.separator, new THREE.CylinderGeometry(c.spacerRadius, c.spacerRadius, c.cathodeHeight, 20), mat("separator"),
            [pos.x + (exploded ? 0.024 : 0), c.cathodeBottom + c.cathodeHeight / 2, pos.z], "Separator · unvalidated material");
          add(groups.separator, new THREE.CylinderGeometry(c.spacerRadius + 0.00025, c.spacerRadius + 0.00025, c.cathodeHeight, 20, 1, true),
            new THREE.MeshStandardMaterial({color: 0xe2d7b6, roughness: 1, side: THREE.DoubleSide, wireframe: true}),
            [pos.x + (exploded ? 0.024 : 0), c.cathodeBottom + c.cathodeHeight / 2, pos.z], "Separator · unvalidated material");
        }
    } else {
    for (const pos of g.layout.positions) {
      add(
        groups.anode,
        new THREE.CylinderGeometry(c.rodRadius, c.rodRadius, c.rodHeight, 20),
        mat("anode"),
        [pos.x - (exploded ? 0.055 : 0), c.rodBottom + c.rodHeight / 2, pos.z],
        "Anode · graphite cores",
      );
      // Cloth jacket is visual only; its rough/microscopic area is not added.
      add(
        groups.anode,
        new THREE.CylinderGeometry(
          c.rodRadius + 0.0003,
          c.rodRadius + 0.0003,
          c.rodHeight * 0.92,
          16,
          1,
          true,
        ),
        new THREE.MeshStandardMaterial({
          color: 0x556463,
          roughness: 1,
          wireframe: true,
        }),
        [pos.x - (exploded ? 0.055 : 0), c.rodBottom + c.rodHeight / 2, pos.z],
        "Anode · graphite cores",
      );
    }
    const cx = g.layout.cathodeX + (exploded ? 0.05 : 0);
    add(
      groups.cathode,
      new THREE.BoxGeometry(0.001, c.cathodeHeight, c.cathodeWidth),
      mat("cathode"),
      [cx, c.cathodeBottom + c.cathodeHeight / 2, 0],
      "Cathode · projected air window",
    );
    for (let i = 0; i < c.cathodeCount; i++)
      add(
        groups.cathode,
        new THREE.CylinderGeometry(c.rodRadius, c.rodRadius, c.rodHeight, 16),
        mat("anode"),
        [
          cx + 0.0008,
          c.cathodeBottom + c.rodHeight / 2,
          (i - (c.cathodeCount - 1) / 2) * 2 * c.rodRadius,
        ],
        "Cathode · projected air window",
      );
    const blockedHeight = c.cathodeHeight * (1 - c.exposedFraction);
    if (blockedHeight > 0)
      add(
        groups.cathode,
        new THREE.BoxGeometry(0.002, blockedHeight, c.cathodeWidth),
        new THREE.MeshStandardMaterial({ color: 0xb4bbba, roughness: 0.8 }),
        [cx + 0.004, c.cathodeBottom + c.cathodeHeight - blockedHeight / 2, 0],
        "Cathode · projected air window",
      );
    const frame = new THREE.EdgesGeometry(
      new THREE.BoxGeometry(
        0.004,
        c.cathodeHeight + 0.006,
        c.cathodeWidth + 0.006,
      ),
    );
    const frameLine = new THREE.LineSegments(
      frame,
      new THREE.LineBasicMaterial({ color: 0x4d8580 }),
    );
    frameLine.position.set(cx, c.cathodeBottom + c.cathodeHeight / 2, 0);
    groups.cathode.add(frameLine);
    if (c.separator === "sheet")
      add(
        groups.separator,
        new THREE.BoxGeometry(0.001, c.cathodeHeight, c.cathodeWidth),
        mat("separator", true, 0.7),
        [
          cx - 0.004 - (exploded ? 0.023 : 0),
          c.cathodeBottom + c.cathodeHeight / 2,
          0,
        ],
        "Separator · unvalidated material",
      );
    if (c.separator === "boundary")
      for (const sign of [-1, 1])
        add(
          groups.separator,
          new THREE.CylinderGeometry(0.0023, 0.0023, c.cathodeHeight, 16),
          mat("separator"),
          [
            cx - 0.004 - (exploded ? 0.022 : 0),
            c.cathodeBottom + c.cathodeHeight / 2,
            (sign * c.cathodeWidth) / 2,
          ],
          "Separator · unvalidated material",
        );
    }
    const cx = g.layout.cathodeX + (exploded ? 0.055 : 0);
    const az = Math.max(...g.layout.positions.map(p => Math.abs(p.z))),
      ax = g.layout.anodeX - (exploded ? 0.055 : 0);
    const collectorY = Math.max(
      c.liquidHeight + 0.012,
      c.rodBottom + c.rodHeight + 0.008,
    );
    if (isWallArc(c)) {
      for (const [positions, shift, bottom, color] of [
        [g.layout.positions, exploded ? -0.055 : 0, c.rodBottom, 0xc17a48],
        [g.layout.cathodePositions, exploded ? 0.055 : 0, c.cathodeBottom, 0x357b79],
      ]) {
        const busPoints = positions.length > 1 ? positions : [
          {x: positions[0].x, z: positions[0].z - 0.003},
          {x: positions[0].x, z: positions[0].z + 0.003},
        ];
        const collector = tube(busPoints.map(p => [p.x + shift, collectorY, p.z]), 0.0012, color);
        collector.userData.part = "Wiring · dry collector concept";
        groups.wiring.add(collector);
        for (const pos of positions) {
          const lead = tube([[pos.x + shift, bottom + c.rodHeight, pos.z], [pos.x + shift, collectorY, pos.z]], 0.0006, 0x58716f);
          lead.userData.part = "Wiring · dry collector concept";
          groups.wiring.add(lead);
        }
      }
    } else {
    const bus = add(
      groups.wiring,
      new THREE.BoxGeometry(0.003, 0.002, az * 2 + 0.006),
      mat("wiring"),
      [ax, collectorY, 0],
      "Wiring · dry collector concept",
    );
    bus.userData.part = "Wiring · dry collector concept";
    for (const pos of g.layout.positions) {
      const lead = tube(
        [
          [ax, c.rodBottom + c.rodHeight, pos.z],
          [ax, collectorY, pos.z],
        ],
        0.0007,
        0x58716f,
      );
      lead.userData.part = "Wiring · dry collector concept";
      groups.wiring.add(lead);
    }
    }
    const top = Math.max(c.bodyHeight + 0.025, collectorY + 0.012);
    const w1 = tube(
      [
        [ax, collectorY, az],
        [ax, top, az],
        [-0.08, top + 0.01, 0.025],
      ],
      0.0012,
      0xc17a48,
    );
    w1.userData.part = "Wiring · dry collector concept";
    groups.wiring.add(w1);
    const w2 = tube(
      [
          [cx, isWallArc(c) ? collectorY : c.cathodeBottom + c.rodHeight, 0],
        [cx + 0.018, top + 0.004, 0],
        [0.085, top + 0.013, -0.02],
      ],
      0.0012,
      0x357b79,
    );
    w2.userData.part = "Wiring · dry collector concept";
    groups.wiring.add(w2);
    if (dimensions) {
      const labels = new THREE.Group();
      e.root.add(labels);
      labels.add(
        label(
          `${(2 * c.radius * 1000).toFixed(0)} mm internal Ø`,
          0,
          -0.017,
          0.055,
        ),
      );
      labels.add(
        label(
          `${(h * 1000).toFixed(0)} mm internal height`,
          -c.radius - 0.042,
          h * 0.64,
          0,
        ),
      );
      labels.add(
        label("Anode · graphite", ax, c.rodBottom + c.rodHeight + 0.015, az),
      );
      labels.add(
        label(
          isWallArc(c) ? `Air cathode · ${(c.cathodeFraction * 100).toFixed(0)}% arc` : "Air cathode",
          cx + 0.028,
          c.cathodeBottom + c.cathodeHeight / 2,
          0,
        ),
      );
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-c.radius, 0, 0.055),
        new THREE.Vector3(c.radius, 0, 0.055),
      ]);
      labels.add(
        new THREE.Line(
          lineGeo,
          new THREE.LineBasicMaterial({ color: 0x718e89 }),
        ),
      );
    }
    // Fit actual component extents on view switches; keep the camera stable while editing.
    if (!e.initialized || e.lastView !== view) {
      e.reset(h);
      e.initialized = true;
      e.lastView = view;
    }
  }, [config, view, layers, dimensions]);
  return (
    <div className="scene" ref={container}>
      {error && (
        <div className="scene-error" role="status">
          {error}
        </div>
      )}
    </div>
  );
}
