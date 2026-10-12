import React, { useState } from "react";
import {
  RotateCcw,
  Maximize2,
  Layers3,
  Ruler,
  Plus,
  Info,
  Check,
} from "lucide-react";
import ReactorScene from "./ReactorScene.jsx";
import { sourceAsset } from "../assets.js";
import {
  geometry,
  presets,
  totalHeight,
  validateConfig,
  editDimension,
  isWallArc,
  wallArcConfig,
  wallArcPresets,
  cathodeInsideFraction,
} from "../domain/geometry.js";
import { evidenceLabels } from "../data.js";
const fields = [
  ["radius", "Internal diameter", 1000 * 2, 30, 200, 1],
  ["bodyHeight", "Straight body height", 1000, 30, 350, 1],
  ["shoulderHeight", "Shoulder height", 1000, 1, 150, 1],
  ["neckRadius", "Neck internal diameter", 2000, 4, 80, 1],
  ["neckHeight", "Neck height", 1000, 1, 150, 1],
  ["wallThickness", "Wall thickness", 1000, 0.3, 10, 0.1],
  ["liquidHeight", "Liquid height from base", 1000, 0, 500, 1],
];
const electrodeFields = [
  ["anodeCount", "Anode rod count", 1, 1, 24, 1, "rods"],
  ["cathodeCount", "Cathode rod count", 1, 1, 24, 1, "rods"],
  ["rodRadius", "Graphite rod diameter", 2000, 1, 12, 0.1],
  ["rodHeight", "Rod length", 1000, 5, 250, 1],
  ["rodBottom", "Anode bottom clearance", 1000, 0, 50, 1],
  ["rodGap", "Gap between anode rods", 1000, 0, 20, 1],
  ["electrodeGap", "Anode–cathode surface gap", 1000, 1, 150, 1],
  ["cathodeWidth", "Cathode window width", 1000, 5, 150, 1],
  ["cathodeHeight", "Cathode window height", 1000, 5, 250, 1],
  ["cathodeBottom", "Cathode bottom clearance", 1000, 0, 100, 1],
  ["exposedFraction", "Air-exposed window", 100, 0, 100, 5, "%"],
];
const arcFields = [
  ...electrodeFields.filter(field => !["electrodeGap", "cathodeWidth"].includes(field[0])),
  ["cathodeFraction", "Cathode circumference coverage", 100, 1, 50, 1, "%"],
  ["anodeWallInset", "Anode clearance from wall", 1000, 0.1, 15, 0.1],
  ["filterThickness", "Filter backing thickness", 1000, 0.5, 15, 0.5],
  ["spacerRadius", "Edge spacer diameter", 2000, 1, 15, 0.5],
];
const partInfo = {
  "Housing & conceptual seals": [
    "Cylinder, tapered shoulder and neck. Ring joints and cap threads are schematic; no thread pitch or pressure rating is modelled.",
    "S02 · S03 · S04 · S05",
  ],
  "Anode · graphite cores": [
    "Geometric immersed graphite-core area only. Carbon-cloth wrapping is shown, but its fibre-scale and electrochemically active areas are unknown.",
    "N01 · S05",
  ],
  "Cathode · projected air window": [
    "Projected window area is a declared normalization denominator. Rod bundle, cloth, gasket and air/liquid interface need a physical coupon test.",
    "S05 · N01 · L01",
  ],
  "Separator · unvalidated material": [
    "Boundary spacers reconstruct the sketch. A full sheet is an alternative proposal. Neither is a verified proton-exchange membrane.",
    "S05 · N01 · U03 · U04",
  ],
  "Liquid · geometric working volume": [
    "Calculated from the internal profile minus immersed graphite cores (cathode cores assumed half inside). Cloth, collectors and irregular-base displacement are excluded.",
    "Model assumption · U01",
  ],
  "Wiring · dry collector concept": [
    "Dry bus with schematic insulated leads to the cores. Submerged connections and wall feedthroughs require sealing validation. Collector material and electrical contact are not specified; wet metal remains a potential confound.",
    "S05 · U09",
  ],
  "Vented outlet · schematic": [
    "Conceptual vented interface only. Gas identity, collection, leak sealing and pressure capability are not established.",
    "S05 · N01 · U10",
  ],
};
function DimensionField({ field, c, onChange, onBasis }) {
  const [key, label, factor, min, max, step, unit = "mm"] = field;
  const basis =
    c.basis?.[key] ||
    (["rodRadius", "rodHeight"].includes(key) ? "reported" : "provisional");
  return (
    <div className="dimension-field">
      <label htmlFor={`dim-${key}`}>{label}</label>
      <div className="number-with-unit">
        <input
          id={`dim-${key}`}
          type="number"
          min={min}
          max={max}
          step={step}
          value={Math.round(c[key] * factor * 1000) / 1000}
          onChange={(e) => onChange(key, e.target.value, factor)}
        />
        <span>{unit}</span>
      </div>
      <select
        aria-label={`${label} evidence status`}
        className={`basis ${basis}`}
        value={basis}
        onChange={(e) => onBasis(key, e.target.value)}
      >
        <option value="provisional">Provisional</option>
        <option value="reported">Source-reported</option>
        <option value="measured">Measured by you</option>
      </select>
    </div>
  );
}
export default function Reactor({ config, setConfig, onNewRun }) {
  const [view, setView] = useState("cutaway"),
    [dimensions, setDimensions] = useState(true),
    [resetKey, setResetKey] = useState(0),
    [tab, setTab] = useState("housing"),
    [layers, setLayers] = useState({
      housing: true,
      anode: true,
      cathode: true,
      separator: true,
      liquid: true,
      wiring: true,
    }),
    [selected, setSelected] = useState("Cathode · projected air window"),
    [error, setError] = useState("");
  const g = geometry(config),
    height = totalHeight(config),
    arc = isWallArc(config);
  const info = arc ? {
    ...partInfo,
    "Anode · graphite cores": ["Graphite leads follow the opposite bottle wall in one shared hood-filter backing. Filter conductivity and blocked graphite surface are unknown; only the geometric graphite-core envelope is counted.", "Your clarification · C01 · N01"],
    "Cathode · projected air window": ["Curved cutout follows the bottle circumference. Hood-filter backing is shown on the liquid side as a provisional stack choice. Conductivity, water retention, oxygen access and perimeter sealing need a physical test; window area is not active electrode area.", "Your clarification · C01 · S05 · L01"],
    "Separator · unvalidated material": ["Two wrapped sticks sit at the lateral edges. Plastic film and lemon-treated coffee paper are schematic spacers; no sheet spans the chamber, and the liquid remains an ionic path. Their transport, leaching and durability are unmeasured.", "Your clarification · C01 · L05"],
    "Liquid · geometric working volume": [`Internal profile minus immersed graphite cores. Cathode mounting assumes ${(cathodeInsideFraction(config) * 100).toFixed(0)}% of each core is inside the liquid boundary. Filter, spacers, collectors and irregular-base displacement are excluded; verify working volume with a water fill.`, "Model assumptions · C01 · U01"],
  } : partInfo;
  const partTitle = part => arc && part === "Cathode · projected air window" ? "Cathode · curved air window"
    : arc && part === "Separator · unvalidated material" ? "Edge spacers · unvalidated wrapping" : part;
  const change = (key, value, factor) => {
    if (value.trim() === "") {
      setError("Enter a value. The last valid model is retained.");
      return;
    }
    const next = editDimension(config, key, Number(value) / factor);
    const errors = validateConfig(next);
    if (errors.length) {
      setError(errors[0]);
      return;
    }
    setError("");
    setConfig(next);
  };
  const basis = (key, value) =>
    setConfig({ ...config, basis: { ...config.basis, [key]: value } });
  const setPreset = (name) => {
    setConfig(structuredClone(arc ? wallArcPresets[name] : presets[name]));
    setError("");
    setResetKey((x) => x + 1);
  };
  const measured = Object.values(config.basis || {}).filter(
    (x) => x === "measured",
  ).length;
  const setLayout = (value) => {
    const next = value === "wall-arc" ? wallArcConfig(config) : {...config, electrodeArrangement: "flat"};
    const errors = validateConfig(next);
    if (errors.length) { setError(errors[0]); return; }
    setConfig(next);
    setError("");
    setResetKey(x => x + 1);
  };
  const setMount = (value) => {
    const next = {...config, cathodeMount: value};
    const errors = validateConfig(next);
    if (errors.length) { setError(errors[0]); return; }
    setConfig(next);
    setError("");
  };
  return (
    <>
      <div className="page-title">
        <div>
          <h1>Bottle reactor</h1>
          <p>A small, editable starting point for your next experiment.</p>
        </div>
        <button className="primary" onClick={onNewRun}>
          <Plus size={17} /> Start an experiment
        </button>
      </div>
      <div className="reactor-layout">
        <section
          className="model-workspace"
          aria-label="Reactor configuration viewer"
        >
          <div className="viewer-top">
            <div className="segmented" aria-label="Reactor view">
              {["assembly", "cutaway", "exploded"].map((v) => (
                <button
                  key={v}
                  aria-pressed={view === v}
                  className={view === v ? "active" : ""}
                  onClick={() => {
                    setView(v);
                    setResetKey((x) => x + 1);
                  }}
                >
                  {v === "assembly"
                    ? "Assembly"
                    : v === "cutaway"
                      ? "Cutaway"
                      : "Exploded"}
                </button>
              ))}
            </div>
            <div className="viewer-actions">
              <button
                className={dimensions ? "icon-button selected" : "icon-button"}
                title="Dimension labels"
                aria-label="Toggle dimension labels"
                aria-pressed={dimensions}
                onClick={() => setDimensions((x) => !x)}
              >
                <Ruler size={18} />
              </button>
              <button
                className="icon-button"
                title="Reset camera"
                aria-label="Reset camera"
                onClick={() => setResetKey((x) => x + 1)}
              >
                <RotateCcw size={17} />
              </button>
              <button
                className="icon-button"
                title="Full screen model"
                aria-label="Full screen model"
                onClick={() =>
                  document
                    .querySelector(".model-workspace")
                    .requestFullscreen?.()
                }
              >
                <Maximize2 size={17} />
              </button>
            </div>
          </div>
          <div className="viewer-stage">
            <div className="model-caption">
              <strong>
                {config.shape === "clear" ? "Clear bottle" : "White bottle"} ·
                B01
              </strong>
              <span>{arc ? "Your wall-arc concept · dimensions provisional" : "Earlier flat reconstruction · dimensions provisional"}</span>
            </div>
            <ReactorScene
              config={config}
              view={view}
              layers={layers}
              dimensions={dimensions}
              resetKey={resetKey}
              onSelect={setSelected}
            />
            <div className="scale-note">
              {measured
                ? `${measured} input(s) marked measured`
                : "Dimensions provisional"}
              <span>Geometry model · no output simulation</span>
            </div>
            <div className="axis-key">
              <span className="axis-x">X</span>
              <span className="axis-y">Y</span>
              <span className="axis-z">Z</span>
            </div>
          </div>
          <div className="viewer-bottom">
            <span>Drag to orbit · scroll to zoom · right-drag to pan</span>
            <span>Click a component to inspect</span>
          </div>
          <div className="component-info">
            <Info size={18} />
            <div>
              <strong>{partTitle(selected)}</strong>
              <p>{info[selected]?.[0]}</p>
              <small>{info[selected]?.[1]}</small>
            </div>
          </div>
        </section>
        <aside className="inspector" aria-label="Dimension editor">
          <div className="inspector-heading">
            <h2>Configuration</h2>
            <span className="tag amber">Draft</span>
          </div>
          <div className="presets">
            <label htmlFor="preset">Bottle starting point</label>
            <select
              id="preset"
              value=""
              onChange={(e) => setPreset(e.target.value)}
            >
              <option value="" disabled>
                Choose a provisional preset
              </option>
              <option value="clear500">Clear bottle · 0.5 L target</option>
              <option value="clear1000">Clear bottle · 1 L target</option>
              <option value="white500">White bottle · 0.5 L target</option>
            </select>
            <small>
              Targets describe intended size. Calculated capacity may differ.
            </small>
            <label htmlFor="electrode-layout">Electrode layout</label>
            <select id="electrode-layout" value={arc ? "wall-arc" : "flat"} onChange={e => setLayout(e.target.value)}>
              <option value="wall-arc">Your wall-arc design</option>
              <option value="flat">Earlier flat reconstruction</option>
            </select>
            <small><a href={sourceAsset("/sources/first-bottle-protocol.md")} target="_blank" rel="noreferrer">First bottle test plan</a></small>
          </div>
          <div
            className="inspector-tabs"
            role="tablist"
            aria-label="Configuration sections"
          >
            {[
              ["housing", "Housing"],
              ["electrodes", "Electrodes"],
              ["layers", "Layers"],
            ].map(([key, title]) => (
              <button
                key={key}
                role="tab"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
              >
                {title}
              </button>
            ))}
          </div>
          <div className="inspector-body">
            {tab === "housing" && (
              <>
                <p className="field-guide">
                  Use internal dimensions. Mark a value measured only after
                  checking the actual bottle.
                </p>
                {fields.map((f) => (
                  <DimensionField
                    key={f[0]}
                    field={f}
                    c={config}
                    onChange={change}
                    onBasis={basis}
                  />
                ))}
                <div className="reference-thumb">
                  <img
                    src={
                      config.shape === "clear"
                        ? sourceAsset("/sources/S02-clear-bottle.jpg")
                        : sourceAsset("/sources/S03-white-bottle.jpg")
                    }
                    alt="Your candidate bottle photograph"
                  />
                  <div>
                    <strong>Your bottle reference</strong>
                    <span>
                      {config.shape === "clear" ? "S02 · S04" : "S03"} · no
                      scale supplied
                    </span>
                    <a
                      href={
                        config.shape === "clear"
                          ? sourceAsset("/sources/S02-clear-bottle.jpg")
                          : sourceAsset("/sources/S03-white-bottle.jpg")
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open photograph
                    </a>
                  </div>
                </div>
              </>
            )}
            {tab === "electrodes" && (
              <>
                <p className="field-guide">
                  Default rod: N01 rod 2, 47 mm long and 4 mm diameter. Confirm
                  your actual material; the later frame used 2 mm diameter
                  leads. {arc && "Coverage starts at 45%, a provisional midpoint of your 40–50% proposal. The 5 mm anode gap is your tentative setting, not a measured optimum."}
                </p>
                {(arc ? arcFields : electrodeFields).map((f) => (
                  <DimensionField
                    key={f[0]}
                    field={f}
                    c={config}
                    onChange={change}
                    onBasis={basis}
                  />
                ))}
                {arc && <label className="stacked">
                  Cathode lead mounting
                  <select aria-label="Cathode lead mounting" value={config.cathodeMount} onChange={e => setMount(e.target.value)}>
                    <option value="boundary">At the opening · half inside assumed</option>
                    <option value="outside">Outside the bottle wall</option>
                    <option value="inside">Inside the bottle wall</option>
                  </select>
                </label>}
                <label className="stacked">
                  Separator arrangement
                  <select
                    value={config.separator}
                    onChange={(e) =>
                      setConfig({ ...config, separator: e.target.value })
                    }
                  >
                    <option value="boundary">
                      {arc ? "Two edge spacers · your concept" : "Boundary spacers · earlier sketch"}
                    </option>
                    {!arc && <option value="sheet">
                      Full sheet · alternate proposal
                    </option>}
                    <option value="none">
                      No separator · alternate proposal
                    </option>
                  </select>
                </label>
                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={config.endsExposed}
                    onChange={(e) =>
                      setConfig({ ...config, endsExposed: e.target.checked })
                    }
                  />{" "}
                  Count immersed rod ends in anode area
                </label>
                <p className="field-guide">
                  Spacing and cathode height must fit the body. Separator
                  transport and cathode sealing remain unvalidated.
                </p>
              </>
            )}
            {tab === "layers" && (
              <>
                <h3>
                  <Layers3 size={16} /> Visible components
                </h3>
                {Object.keys(layers).map((key) => (
                  <label key={key} className="layer-row">
                    <span className={`layer-dot ${key}`} />
                    <span>{key[0].toUpperCase() + key.slice(1)}</span>
                    <input
                      type="checkbox"
                      checked={layers[key]}
                      onChange={(e) =>
                        setLayers({ ...layers, [key]: e.target.checked })
                      }
                    />
                  </label>
                ))}
                <h3>Component guide</h3>
                {Object.keys(partInfo).map((part) => (
                  <button
                    className="component-select"
                    key={part}
                    onClick={() => setSelected(part)}
                  >
                    {partTitle(part)}
                    {selected === part && <Check size={14} />}
                  </button>
                ))}
              </>
            )}
          </div>
          {error && (
            <div className="input-error" role="alert">
              {error} The last valid model is retained.
            </div>
          )}
        </aside>
      </div>
      <section className="geometry-results" aria-label="Calculated geometry">
        <div className="result-heading">
          <h2>Geometry calculations</h2>
          <span className="tag">Calculated from current inputs</span>
        </div>
        <div className="result-values">
          <div>
            <span>Internal capacity</span>
            <strong>
              {(g.capacity * 1e6).toFixed(1)} <small>mL</small>
            </strong>
            <p>Cylinder + shoulder + neck</p>
          </div>
          <div>
            <span>Working liquid estimate</span>
            <strong>
              {(g.liquid * 1e6).toFixed(1)} <small>mL</small>
            </strong>
            <p>{(g.displacement * 1e6).toFixed(2)} mL core displacement</p>
          </div>
          <div>
            <span>Immersed anode core area</span>
            <strong>
              {(g.anodeArea * 1e4).toFixed(2)} <small>cm²</small>
            </strong>
            <p>{arc ? "Filter and masked surfaces uncharacterized" : "Cloth microstructure excluded"}</p>
          </div>
          <div>
            <span>{arc ? "Curved air window" : "Projected air window"}</span>
            <strong>
              {(g.cathodeArea * 1e4).toFixed(2)} <small>cm²</small>
            </strong>
            <p>
              {(config.exposedFraction * 100).toFixed(0)}% of window exposed to
              air
            </p>
          </div>
        </div>
        <details className="equations">
          <summary>Equations, assumptions and missing geometry</summary>
          <div className="equation-grid">
            <div>
              <h3>Volume</h3>
              <code>
                V cylinder = π r² h<br />V frustum = π h (r₀² + r₀r₁ + r₁²) / 3
              </code>
              <p>
                Fill height is integrated through the internal profile. Immersed
                graphite cores are subtracted; cathode rods are assumed {cathodeInsideFraction(config) * 100}%
                inside. Remaining filter/cloth, spacers, collectors and irregular-base
                displacement are not known. Geometric headspace:{" "}
                {(g.headspace * 1e6).toFixed(1)} mL.
              </p>
            </div>
            <div>
              <h3>Area</h3>
              <code>
                A anode = N (2π r h immersed + exposed ends)
                <br />{arc ? "A curved air window = 2π r × circumference fraction × height × air exposure" : "A air window = width × height × exposed fraction"}
              </code>
              <p>
                Anode area uses {(g.immersed * 1000).toFixed(1)} mm immersed
                core length. Wet-side window area:{" "}
                {(g.wettedWindowArea * 1e4).toFixed(2)} cm². These are geometric
                denominators, not electrochemically active areas. SI internally:
                m, m², m³. Total internal height: {(height * 1000).toFixed(1)}{" "}
                mm.
                {arc && ` The curved width is ${(g.windowArcLength * 1000).toFixed(1)} mm along the inner-wall arc. Cathode rods are evenly distributed across that arc, leaving spacer clearance. Filter conductivity, glue masking and effective wet/air contact are unmeasured.`}
              </p>
            </div>
          </div>
        </details>
      </section>
    </>
  );
}
