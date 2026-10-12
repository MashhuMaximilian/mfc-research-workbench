import React, { useState } from "react";
import {
  Plus,
  Download,
  ArrowLeft,
  GitCompareArrows,
  ClipboardList,
} from "lucide-react";
import {
  electrical,
  density,
  integrateReadings,
} from "../domain/electrical.js";
import { nullableNumber, toCsv, editWorkingVolume } from "../domain/data.js";
import { geometry } from "../domain/geometry.js";
import ReadingPlot from "./ReadingPlot.jsx";
export function downloadFile(name, contents, type = "application/json") {
  const blob = new Blob([contents], { type }),
    url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function fmt(v, factor = 1, digits = 2) {
  return Number.isFinite(v) ? (v * factor).toFixed(digits) : "—";
}
const metadata = [
  ["title", "Experiment title"],
  ["date", "Experiment date", "date"],
  ["inoculum", "Inoculum and source"],
  ["feedstock", "Feedstock and composition"],
  ["electrodes", "Materials, geometry and spacing"],
  ["environment", "Environmental conditions"],
  ["instrument", "Instrument, method and polarity"],
  ["controls", "Controls and independent replicates"],
  ["deviations", "Contamination, problems and deviations"],
  ["observations", "Cumulative observations"],
  ["interpretation", "Interpretation and uncertainty"],
];
function exportReadings(runs) {
  const rows = runs.flatMap((run) =>
    run.readings.map((r) => {
      const e = electrical(r);
      return {
        experimentId: run.id,
        experimentTitle: run.title,
        experimentDate: run.date,
        recordKind: run.kind,
        workingVolumeM3: run.workingVolumeM3,
        workingVolumeBasis: run.volumeBasis || "unknown",
        reactorConfig: run.config ? JSON.stringify(run.config) : null,
        electrodes: run.electrodes,
        inoculum: run.inoculum,
        feedstock: run.feedstock,
        environment: run.environment,
        instrument: run.instrument,
        controls: run.controls,
        deviations: run.deviations,
        interpretation: run.interpretation,
        condition: r.condition,
        timestamp: r.timestamp,
        circuit: r.mode,
        voltageV: r.voltageV,
        voltageMinV: r.voltageMinV,
        voltageMaxV: r.voltageMaxV,
        rawVoltage: r.rawVoltage,
        rawCurrent: r.rawCurrent,
        resistanceOhm: r.resistanceOhm,
        measuredCurrentA: r.currentA,
        calculatedCurrentA: r.mode === "loaded-resistor" ? e.currentA : null,
        powerW: e.powerW,
        powerBasis: e.method,
        temperatureK: r.temperatureK,
        pH: r.pH,
        notes: r.notes,
        sourceId: r.sourceId || "user-notebook",
      };
    }),
  );
  const headers = [
    "experimentId",
    "experimentTitle",
    "experimentDate",
    "recordKind",
    "workingVolumeM3",
    "workingVolumeBasis",
    "reactorConfig",
    "electrodes",
    "inoculum",
    "feedstock",
    "environment",
    "instrument",
    "controls",
    "deviations",
    "interpretation",
    "condition",
    "timestamp",
    "circuit",
    "voltageV",
    "voltageMinV",
    "voltageMaxV",
    "rawVoltage",
    "rawCurrent",
    "resistanceOhm",
    "measuredCurrentA",
    "calculatedCurrentA",
    "powerW",
    "powerBasis",
    "temperatureK",
    "pH",
    "notes",
    "sourceId",
  ];
  downloadFile(
    "mfc-readings.csv",
    toCsv(rows, headers),
    "text/csv;charset=utf-8",
  );
}
function ReadingsTable({ run }) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th># / condition</th>
            <th>Voltage</th>
            <th>Circuit / load</th>
            <th>Current</th>
            <th>Power</th>
            <th>Observation / provenance</th>
          </tr>
        </thead>
        <tbody>
          {run.readings.map((r, i) => {
            const e = electrical(r);
            return (
              <tr key={r.id || i}>
                <td>
                  <small>{i + 1}</small>
                  <strong>{r.condition || "Reading"}</strong>
                  {r.timestamp && (
                    <span>{new Date(r.timestamp).toLocaleString()}</span>
                  )}
                </td>
                <td>
                  {r.rawVoltage || `${fmt(r.voltageV, 1000)} mV`}
                  {Number.isFinite(r.voltageMinV) && (
                    <small>Range retained</small>
                  )}
                </td>
                <td>
                  {r.mode === "unknown"
                    ? "Unknown"
                    : r.mode === "ocv"
                      ? "Open circuit"
                      : r.mode === "loaded-resistor"
                        ? `${r.resistanceOhm} Ω resistor`
                        : "Paired loaded V / I"}
                </td>
                <td>
                  {e.currentA !== null ? (
                    <>
                      {fmt(e.currentA, 1e6)} µA
                      <small>
                        {r.mode === "loaded-resistor"
                          ? "Calculated I = V/R"
                          : "Measured · paired"}
                      </small>
                    </>
                  ) : (
                    <>
                      —
                      {r.rawCurrent && (
                        <small>Raw: {r.rawCurrent} · “200u”</small>
                      )}
                    </>
                  )}
                </td>
                <td>{e.powerW === null ? "—" : `${fmt(e.powerW, 1e6)} µW`}</td>
                <td>
                  {r.notes || "No observation recorded"}
                  <small>
                    {r.sourceId || "Your notebook"}
                    {r.pH !== null && r.pH !== undefined ? ` · pH ${r.pH}` : ""}
                    {r.temperatureK !== null && r.temperatureK !== undefined
                      ? ` · ${(r.temperatureK - 273.15).toFixed(1)} °C`
                      : ""}
                  </small>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {run.readings.length === 0 && (
        <div className="empty-note">
          Add the first reading with its time and circuit. Unknown values may
          stay blank.
        </div>
      )}
    </div>
  );
}
function ReadingForm({ onSave, onClose }) {
  const [mode, setMode] = useState("loaded-resistor"),
    [error, setError] = useState("");
  const save = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget),
      v = nullableNumber(f.get("voltage"), 0.001),
      r = nullableNumber(f.get("resistance")),
      a = nullableNumber(f.get("current"), 1e-6),
      timestamp = f.get("timestamp");
    if (v === null) {
      setError("Enter a numeric voltage in mV.");
      return;
    }
    if (mode === "loaded-resistor" && !(r > 0)) {
      setError("Enter the measured external resistor value in ohms.");
      return;
    }
    if (mode === "loaded-paired" && a === null) {
      setError("Enter current from the same loaded circuit.");
      return;
    }
    onSave({
      id: crypto.randomUUID(),
      condition: f.get("condition").trim() || null,
      timestamp: timestamp ? new Date(timestamp).toISOString() : null,
      mode,
      voltageV: v,
      voltageMinV: null,
      voltageMaxV: null,
      currentA: mode === "loaded-paired" ? a : null,
      resistanceOhm: mode === "loaded-resistor" ? r : null,
      rawVoltage: `${f.get("voltage")} mV`,
      rawCurrent: mode === "loaded-paired" ? `${f.get("current")} µA` : null,
      pH: nullableNumber(f.get("pH")),
      temperatureK: f.get("temperature")?.trim()
        ? nullableNumber(f.get("temperature")) + 273.15
        : null,
      notes: f.get("notes"),
      sourceId: "user-notebook",
    });
  };
  return (
    <form className="reading-form" onSubmit={save}>
      <div className="section-heading">
        <h3>Add a reading</h3>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
      <div className="form-grid">
        <label>
          Condition / sample ID
          <input
            name="condition"
            placeholder="e.g. baseline · unit A"
            maxLength={160}
          />
          <small>Reuse the same ID for a continuous series. Blank IDs exclude connecting lines and energy integration.</small>
        </label>
        <label>
          Local date and time
          <input name="timestamp" type="datetime-local" />
          <small>Optional. Blank excludes this reading from time plots.</small>
        </label>
        <label>
          Measurement circuit
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="loaded-resistor">
              Voltage across a known resistor
            </option>
            <option value="ocv">Open-circuit voltage (OCV)</option>
            <option value="loaded-paired">
              Paired V and I · same loaded circuit
            </option>
            <option value="unknown">Circuit / load unknown</option>
          </select>
        </label>
        <label>
          Voltage (mV)
          <input name="voltage" type="number" step="any" required />
        </label>
        {mode === "loaded-resistor" && (
          <label>
            Measured resistor (Ω)
            <input
              name="resistance"
              type="number"
              step="any"
              min="0.000001"
              required
            />
          </label>
        )}
        {mode === "loaded-paired" && (
          <label>
            Paired current (µA)
            <input name="current" type="number" step="any" required />
          </label>
        )}
        <label>
          Temperature (°C)
          <input
            name="temperature"
            type="number"
            step="any"
            min="-50"
            max="150"
          />
        </label>
        <label>
          pH (if measured)
          <input name="pH" type="number" step="any" min="0" max="14" />
        </label>
        <label className="form-wide">
          Observation / deviations
          <textarea
            name="notes"
            rows="2"
            placeholder="Describe settling, contact changes, bubbles, leakage or deviations."
            maxLength={5000}
          />
        </label>
      </div>
      <p className="method-note">
        {mode === "loaded-resistor"
          ? "Record DC voltage across the external resistor. Current and power will be calculated using I = V/R and P = V²/R."
          : mode === "loaded-paired"
            ? "Confirm that V and I describe the same loaded circuit. Separately measured OCV and short-circuit current cannot be paired."
            : "This circuit does not support a power calculation. Power stays blank."}
      </p>
      {error && (
        <p role="alert" className="error-text">
          {error}
        </p>
      )}
      <button type="submit" className="primary">
        Save reading
      </button>
    </form>
  );
}
export default function Notebook({
  runs,
  setRuns,
  selectedId,
  setSelectedId,
  onNewRun,
}) {
  const [adding, setAdding] = useState(false),
    [metric, setMetric] = useState("voltage"),
    [comparing, setComparing] = useState(false),
    [left, setLeft] = useState("ARCH-01"),
    [right, setRight] = useState("ARCH-02");
  const run = runs.find((r) => r.id === selectedId);
  const update = (patch) =>
    setRuns(runs.map((r) => (r.id === selectedId ? { ...r, ...patch } : r)));
  const addReading = (r) => {
    update({ readings: [...run.readings, r], status: "recording" });
    setAdding(false);
  };
  if (comparing) {
    const pair = [
      runs.find((r) => r.id === left),
      runs.find((r) => r.id === right),
    ];
    return (
      <>
        <div className="page-title">
          <div>
            <h1>Compare records</h1>
            <p>
              Review conditions and circuit evidence before interpreting
              differences.
            </p>
          </div>
          <button onClick={() => setComparing(false)}>
            <ArrowLeft size={16} /> Notebook
          </button>
        </div>
        <div className="comparison-grid">
          {pair.map((r, i) => (
            <section key={i} className="comparison-panel">
              <label>
                {i === 0 ? "First record" : "Second record"}
                <select
                  value={i === 0 ? left : right}
                  onChange={(e) =>
                    i === 0 ? setLeft(e.target.value) : setRight(e.target.value)
                  }
                >
                  {runs.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.id} · {x.title}
                    </option>
                  ))}
                </select>
              </label>
              {r && (
                <>
                  <h2>{r.title}</h2>
                  <p>
                    {r.kind === "archive"
                      ? "Historical grouping · dates and replicates unknown"
                      : r.date || "Date not recorded"}{" "}
                    ·{" "}
                    {r.workingVolumeM3
                      ? `${fmt(r.workingVolumeM3, 1e6, 1)} mL`
                      : "Volume unknown"}
                  </p>
                  <ReadingPlot
                    readings={r.readings}
                    timed={r.kind !== "archive"}
                  />
                  <ReadingsTable run={r} />
                </>
              )}
            </section>
          ))}
        </div>
        <p className="method-note">
          Matching curves or larger voltages alone do not establish improved
          power. Normalize with the same declared area or measured working
          volume, and compare independent replicates under matched loads and
          conditions.
        </p>
      </>
    );
  }
  if (!run)
    return (
      <>
        <div className="page-title">
          <div>
            <h1>Experimental notebook</h1>
            <p>Your observations, with their original context intact.</p>
          </div>
          <div className="title-actions">
            <button onClick={() => exportReadings(runs)}>
              <Download size={16} /> Export CSV
            </button>
            <button className="primary" onClick={onNewRun}>
              <Plus size={17} /> New experiment
            </button>
          </div>
        </div>
        <div className="notebook-intro">
          <ClipboardList size={24} />
          <div>
            <strong>15 historical conditions · 2 source collections</strong>
            <p>
              These are archival groupings, not invented independent runs.
              Dates, load resistances and replicate counts remain unknown.
            </p>
          </div>
          <button onClick={() => setComparing(true)}>
            <GitCompareArrows size={16} /> Compare
          </button>
        </div>
        <div className="run-list">
          {[...runs].reverse().map((r) => (
            <button
              className="run-row"
              key={r.id}
              onClick={() => {
                setSelectedId(r.id);
                setAdding(false);
              }}
            >
              <span className="run-id">{r.id}</span>
              <div>
                <h2>{r.title}</h2>
                <p>
                  {r.kind === "archive"
                    ? "Source-reported · N01 · undated"
                    : r.date || "Date not recorded"}
                </p>
              </div>
              <span>{r.readings.length} readings</span>
              <span className={`tag ${r.kind === "archive" ? "amber" : ""}`}>
                {r.kind === "archive"
                  ? "Historical"
                  : r.status === "recording"
                    ? "Recording"
                    : "Planned"}
              </span>
            </button>
          ))}
        </div>
        <p className="storage-note">
          Working records save in this browser on this local address. Export a
          JSON backup before clearing browser data or changing browsers.
        </p>
      </>
    );
  const g = run.config ? geometry(run.config) : null,
    integral = integrateReadings(run.readings),
    latest = [...run.readings]
      .reverse()
      .find((r) => electrical(r).powerW !== null),
    power = latest ? electrical(latest).powerW : null;
  return (
    <>
      <button
        className="back-link"
        onClick={() => {
          setSelectedId(null);
          setAdding(false);
        }}
      >
        <ArrowLeft size={15} /> All records
      </button>
      <div className="page-title">
        <div>
          <h1>{run.title}</h1>
          <p>
            {run.id} ·{" "}
            {run.kind === "archive"
              ? "Historical source collection · N01"
              : "Configuration captured when this record was created"}
          </p>
        </div>
        <button onClick={() => exportReadings([run])}>
          <Download size={16} /> Export readings
        </button>
      </div>
      {run.kind === "archive" ? (
        <div className="notice">
          <strong>Original exploratory observations</strong>
          <p>
            Raw values and qualifiers are preserved. Circuit and “200u” units
            are unresolved; current and power stay blank. Photographs S06 / S07
            are not assigned to table conditions.
          </p>
        </div>
      ) : (
        <details className="metadata" open={run.readings.length === 0}>
          <summary>Experiment setup and conditions</summary>
          <div className="form-grid">
            {metadata.map(([key, label, type]) => (
              <label key={key}>
                {label}
                {type === "date" ? (
                  <input
                    type="date"
                    value={run[key] || ""}
                    onChange={(e) => update({ [key]: e.target.value || null })}
                  />
                ) : key === "title" ? (
                  <input
                    value={run[key] || ""}
                    onChange={(e) => update({ [key]: e.target.value })}
                    maxLength={160}
                  />
                ) : (
                  <textarea
                    rows={2}
                    value={run[key] || ""}
                    onChange={(e) => update({ [key]: e.target.value })}
                    maxLength={10000}
                  />
                )}
              </label>
            ))}
            <label>
              Working volume (mL)
              <input
                type="number"
                min="0.1"
                step="any"
                value={
                  run.workingVolumeM3 === null
                    ? ""
                    : Math.round(run.workingVolumeM3 * 1e6 * 100) / 100
                }
                onChange={(e) => {
                  const v = nullableNumber(e.target.value, 1e-6);
                  if (v === null || v > 0) update(editWorkingVolume(run, v));
                }}
              />
              <select
                aria-label="Working volume evidence status"
                value={run.volumeBasis || "calculated"}
                onChange={(e) => update(e.target.value === "calculated" && g
                  ? { volumeBasis: "calculated", workingVolumeM3: g.liquid }
                  : { volumeBasis: e.target.value })}
              >
                <option value="provisional">Manual entry · unconfirmed</option>
                <option value="calculated">
                  Calculated from provisional geometry
                </option>
                <option value="measured">Measured fill volume</option>
                <option value="reported">Source-reported volume</option>
              </select>
            </label>
          </div>
          {g && (
            <p className="method-note">
              Saved configuration: {run.config.shape} bottle · Ø{" "}
              {(run.config.radius * 2000).toFixed(1)} mm ·{" "}
              {run.config.anodeCount} anode rods ·{" "}
              {(g.anodeArea * 1e4).toFixed(2)} cm² geometric immersed core area.{" "}
              <a
                href={`data:application/json,${encodeURIComponent(JSON.stringify(run.config, null, 2))}`}
                download={`${run.id}-configuration.json`}
              >
                Download configuration
              </a>
            </p>
          )}
        </details>
      )}
      <section className="readings-section">
        <div className="section-heading">
          <h2>Readings</h2>
          <div className="title-actions">
            <div className="segmented">
              {["voltage", "current", "power"].map((m) => (
                <button
                  aria-pressed={metric === m}
                  className={metric === m ? "active" : ""}
                  key={m}
                  onClick={() => setMetric(m)}
                >
                  {m[0].toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
            {run.kind !== "archive" && (
              <button className="primary" onClick={() => setAdding(true)}>
                <Plus size={16} /> Add reading
              </button>
            )}
          </div>
        </div>
        {adding && (
          <ReadingForm onSave={addReading} onClose={() => setAdding(false)} />
        )}
        <ReadingPlot
          readings={run.readings}
          metric={metric}
          timed={run.kind !== "archive"}
        />
        <ReadingsTable run={run} />
      </section>
      {run.kind === "archive" ? (
        <div className="archive-context">
          <h2>Context and uncertainty</h2>
          <p>{run.deviations}</p>
          <p>{run.interpretation}</p>
          <label>
            Your annotation (kept separately from raw readings)
            <textarea
              rows={3}
              value={run.annotation || ""}
              onChange={(e) => update({ annotation: e.target.value })}
            />
          </label>
          <a
            href="https://app.notion.com/p/10bed8479ccd806fb98ae2aaac0ad190"
            target="_blank"
            rel="noreferrer"
          >
            Open original Notion table
          </a>
        </div>
      ) : (
        <div className="calculated-electrical">
          <h2>Electrical calculations</h2>
          <div className="electrical-values">
            <div>
              <span>Latest loaded power</span>
              <strong>{fmt(power, 1e6)} µW</strong>
            </div>
            <div>
              <span>Per geometric anode core area</span>
              <strong>{fmt(density(power, g?.anodeArea), 1000)} mW/m²</strong>
            </div>
            <div>
              <span>Per recorded working volume</span>
              <strong>{fmt(density(power, run.workingVolumeM3))} W/m³</strong>
            </div>
            <div>
              <span>Integrated sampled energy</span>
              <strong>{fmt(integral.energyJ, 1 / 3.6, 4)} mWh</strong>
            </div>
          </div>
          <p>
            Power uses the latest valid loaded reading. Denominators use this
            record’s saved configuration and volume. Trapezoidal integration
            covers {integral.coveredSeconds.toFixed(0)} seconds between eligible
            readings with the same explicit condition / sample ID and circuit;
            it assumes linear change, excludes missing power or blank IDs and
            breaks at sample or load changes. It is an estimate over sampled intervals, not a
            whole-run energy claim.
          </p>
        </div>
      )}
    </>
  );
}
