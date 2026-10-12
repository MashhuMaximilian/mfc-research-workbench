import test from "node:test";
import assert from "node:assert/strict";
import {presets, wallArcPresets, wallArcConfig, geometry, validateConfig, electrodeLayout} from "../src/domain/geometry.js";
import {validateBackup} from "../src/domain/data.js";
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-12, `${a} != ${b}`);

test("curved window area uses circumference rather than a flat chord", () => {
  const c = {...wallArcPresets.clear500, cathodeFraction: 0.5, cathodeHeight: 0.06, exposedFraction: 0.5};
  const g = geometry(c);
  near(g.cathodeArea, Math.PI * c.radius * c.cathodeHeight * 0.5);
  near(g.windowArcLength, Math.PI * c.radius);
  near(geometry({...c, liquidHeight: c.cathodeBottom + 0.02}).wettedWindowArea, Math.PI * c.radius * 0.02);
  assert.equal(g.cathodeAreaBasis, "Curved inner-wall window");
});

test("opposing wall arcs preserve the requested clear gap and two edge positions", () => {
  for (const c of Object.values(wallArcPresets)) {
    assert.deepEqual(validateConfig(c), []);
    const layout = electrodeLayout(c);
    assert.equal(layout.spacerPositions.length, 2);
    assert.ok(layout.positions.every(p => p.x < 0 && Math.hypot(p.x, p.z) + c.rodRadius <= c.radius));
    assert.ok(layout.cathodePositions.every(p => Math.abs(p.angle) < layout.halfAngle));
    for (let i = 1; i < layout.positions.length; i++) {
      const a = layout.positions[i - 1], b = layout.positions[i];
      near(Math.hypot(a.x - b.x, a.z - b.z) - 2 * c.rodRadius, 0.005);
    }
  }
});

test("cathode mounting changes core displacement without claiming filter volume", () => {
  const c = wallArcPresets.clear500;
  const inside = geometry({...c, cathodeMount: "inside"});
  const boundary = geometry(c);
  const outside = geometry({...c, cathodeMount: "outside"});
  near(boundary.displacement, (inside.displacement + outside.displacement) / 2);
  assert.ok(inside.liquid < boundary.liquid && boundary.liquid < outside.liquid);
  near(geometry({...c, filterThickness: 0.008}).displacement, boundary.displacement);
});

test("invalid coverage, crowded rods and transverse sheets are rejected", () => {
  const c = wallArcPresets.clear500;
  for (const change of [
    {cathodeFraction: 0.6}, {cathodeFraction: NaN}, {anodeCount: 24},
    {rodGap: 0.1}, {filterThickness: 0.001}, {separator: "sheet"},
    {cathodeMount: "unknown"}, {cathodeFraction: 0.01},
  ]) assert.ok(validateConfig({...c, ...change}).length, JSON.stringify(change));
});

test("new design does not reinterpret old saved experiment configurations", () => {
  const old = {...presets.clear500, basis: {radius: "measured", rodGap: "measured"}};
  const before = structuredClone(old);
  const current = wallArcConfig(old);
  assert.deepEqual(old, before);
  assert.equal(current.basis.radius, "measured");
  assert.equal(current.basis.rodGap, "reported");
  assert.equal(current.basis.cathodeFraction, "provisional");
  const archiveRun = {id: "OLD-1", title: "Old bottle record", kind: "new", config: old, workingVolumeM3: 0.0003, readings: []};
  const backup = {schemaVersion: 1, config: current, runs: [archiveRun]};
  assert.equal(validateBackup(backup), backup);
  assert.equal(geometry(archiveRun.config).cathodeAreaBasis, "Flat projected window");
  near(geometry(archiveRun.config).cathodeArea, old.cathodeWidth * old.cathodeHeight);
});
