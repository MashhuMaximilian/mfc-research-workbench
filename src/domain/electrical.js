// Input V, A, Ω. Returns null for power when circuit evidence is insufficient.
export function electrical(reading) {
  const v = reading.voltageV;
  if (!Number.isFinite(v))
    return { currentA: null, powerW: null, method: "No numeric voltage" };
  if (
    reading.mode === "loaded-resistor" &&
    Number.isFinite(reading.resistanceOhm) &&
    reading.resistanceOhm > 0
  ) {
    return {
      currentA: v / reading.resistanceOhm,
      powerW: (v * v) / reading.resistanceOhm,
      method: "I = V/R; P = V²/R (voltage across external resistor)",
    };
  }
  if (reading.mode === "loaded-paired" && Number.isFinite(reading.currentA))
    return {
      currentA: reading.currentA,
      powerW: v * reading.currentA,
      method: "P = VI (paired, same loaded circuit)",
    };
  return {
    currentA: null,
    powerW: null,
    method:
      reading.mode === "ocv"
        ? "Open circuit: power unavailable"
        : "Load or paired circuit unknown",
  };
}
export function density(powerW, denominator) {
  return Number.isFinite(powerW) &&
    Number.isFinite(denominator) &&
    denominator > 0
    ? powerW / denominator
    : null;
}
export function sameReadingSeries(a, b) {
  const identity = (r) => (r.condition || "").trim();
  return Boolean(identity(a)) &&
    identity(a) === identity(b) &&
    a.mode === b.mode &&
    a.resistanceOhm === b.resistanceOhm;
}
export function integrateReadings(readings) {
  const data = readings
    .filter((r) => r.timestamp && Number.isFinite(Date.parse(r.timestamp)))
    .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
  let energyJ = 0,
    chargeC = 0,
    coveredSeconds = 0,
    segments = 0;
  for (let i = 1; i < data.length; i++) {
    const dt =
      (Date.parse(data[i].timestamp) - Date.parse(data[i - 1].timestamp)) /
      1000;
    const a = electrical(data[i - 1]),
      b = electrical(data[i]);
    // Never bridge unknown power, an unidentified sample, or a series change.
    if (
      dt <= 0 ||
      a.powerW === null ||
      b.powerW === null ||
      !sameReadingSeries(data[i - 1], data[i])
    )
      continue;
    energyJ += ((a.powerW + b.powerW) / 2) * dt;
    chargeC += ((a.currentA + b.currentA) / 2) * dt;
    coveredSeconds += dt;
    segments++;
  }
  return {
    energyJ: segments ? energyJ : null,
    chargeC: segments ? chargeC : null,
    coveredSeconds,
    segments,
  };
}
