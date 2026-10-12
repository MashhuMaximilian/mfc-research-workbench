import { validateConfig } from "./geometry.js";
export function editWorkingVolume(run, valueM3) {
  return run.workingVolumeM3 === valueM3
    ? {}
    : { workingVolumeM3: valueM3, volumeBasis: "provisional" };
}
export function nullableNumber(value, factor = 1) {
  if (value === null || value === undefined || String(value).trim() === "")
    return null;
  const n = Number(value);
  return Number.isFinite(n) ? n * factor : null;
}
export function csvCell(value) {
  let text = value === null || value === undefined ? "" : String(value);
  // Avoid spreadsheet formula execution on textual notebook entries.
  if (typeof value === "string" && /^[=+\-@\t\r]/.test(text)) text = "'" + text;
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
export function toCsv(rows, headers) {
  return [
    headers.map(csvCell).join(","),
    ...rows.map((r) => headers.map((h) => csvCell(r[h])).join(",")),
  ].join("\r\n");
}
const NUMERIC_READING_FIELDS = [
  "voltageV",
  "voltageMinV",
  "voltageMaxV",
  "currentA",
  "resistanceOhm",
  "temperatureK",
  "pH",
];
export function validateBackup(obj) {
  if (
    obj?.schemaVersion !== 1 ||
    !Array.isArray(obj.runs) ||
    !obj.config ||
    obj.runs.length > 500
  )
    throw new Error(
      "Choose a version 1 workbench JSON backup (up to 500 runs).",
    );
  const errors = validateConfig(obj.config);
  if (errors.length) throw new Error("Backup geometry: " + errors.join(" "));
  const ids = new Set();
  for (const run of obj.runs) {
    if (
      typeof run.id !== "string" ||
      ids.has(run.id) ||
      typeof run.title !== "string" ||
      !Array.isArray(run.readings) ||
      run.readings.length > 20000
    )
      throw new Error("Invalid or duplicate experiment record.");
    ids.add(run.id);
    if (!["archive", "new"].includes(run.kind))
      throw new Error("Unknown experiment record kind.");
    for (const key of [
      "date",
      "status",
      "inoculum",
      "feedstock",
      "electrodes",
      "environment",
      "instrument",
      "controls",
      "deviations",
      "observations",
      "interpretation",
      "annotation",
      "volumeBasis",
    ])
      if (
        run[key] !== null &&
        run[key] !== undefined &&
        typeof run[key] !== "string"
      )
        throw new Error("Experiment text fields must contain text.");
    if (run.config && validateConfig(run.config).length)
      throw new Error("Invalid saved reactor configuration.");
    if (
      run.workingVolumeM3 !== null &&
      (!Number.isFinite(run.workingVolumeM3) || run.workingVolumeM3 <= 0)
    )
      throw new Error("Invalid working volume.");
    for (const r of run.readings) {
      if (
        !r ||
        !["unknown", "ocv", "loaded-resistor", "loaded-paired"].includes(r.mode)
      )
        throw new Error("Invalid reading circuit.");
      for (const key of [
        "id",
        "condition",
        "notes",
        "sourceId",
        "rawVoltage",
        "rawCurrent",
      ])
        if (
          r[key] !== null &&
          r[key] !== undefined &&
          typeof r[key] !== "string"
        )
          throw new Error("Reading text fields must contain text.");
      for (const f of NUMERIC_READING_FIELDS)
        if (r[f] !== null && r[f] !== undefined && !Number.isFinite(r[f]))
          throw new Error("Reading numbers must be finite or null.");
      if (
        r.timestamp !== null &&
        r.timestamp !== undefined &&
        !Number.isFinite(Date.parse(r.timestamp))
      )
        throw new Error("Invalid reading timestamp.");
      if (r.mode === "loaded-resistor" && !(r.resistanceOhm > 0))
        throw new Error("Loaded readings require a positive resistor.");
    }
  }
  return obj;
}
