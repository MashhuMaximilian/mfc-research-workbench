import test from "node:test";
import assert from "node:assert/strict";
import {
  presets,
  cylinderVolume,
  frustumVolume,
  volumeAtHeight,
  totalHeight,
  geometry,
  validateConfig,
  editDimension,
} from "../src/domain/geometry.js";
import {
  electrical,
  density,
  integrateReadings,
} from "../src/domain/electrical.js";
import { nullableNumber, toCsv, validateBackup, editWorkingVolume } from "../src/domain/data.js";
import { historicalRuns } from "../src/data.js";
const near = (a, b, tol = 1e-12) =>
  assert.ok(Math.abs(a - b) < tol, `${a} != ${b}`);
test("volume integrates cylinder, partial frustum and neck in SI", () => {
  const c = presets.clear500;
  near(volumeAtHeight(c, 0), 0);
  near(volumeAtHeight(c, 0.05), Math.PI * c.radius ** 2 * 0.05);
  const part = 0.015,
    topR = c.radius + ((c.neckRadius - c.radius) * part) / c.shoulderHeight;
  near(
    volumeAtHeight(c, c.bodyHeight + part),
    cylinderVolume(c.radius, c.bodyHeight) +
      frustumVolume(c.radius, topR, part),
  );
  near(
    volumeAtHeight(c, totalHeight(c)),
    cylinderVolume(c.radius, c.bodyHeight) +
      frustumVolume(c.radius, c.neckRadius, c.shoulderHeight) +
      cylinderVolume(c.neckRadius, c.neckHeight),
  );
  near(volumeAtHeight(c, 9), volumeAtHeight(c, totalHeight(c)));
  near(volumeAtHeight(c, -1), 0);
});
test("equal-radius frustum reduces to a cylinder", () =>
  near(frustumVolume(0.03, 0.03, 0.04), cylinderVolume(0.03, 0.04)));
test("liquid displacement and area use partial immersed length", () => {
  const c = { ...presets.clear500, liquidHeight: 0.03 },
    g = geometry(c);
  const anodeImmersed = 0.02,
    cathodeImmersed = 0.015;
  near(
    g.displacement,
    Math.PI *
      c.rodRadius ** 2 *
      (c.anodeCount * anodeImmersed + (c.cathodeCount * cathodeImmersed) / 2),
  );
  near(g.anodeArea, c.anodeCount * 2 * Math.PI * c.rodRadius * anodeImmersed);
  near(g.liquid, volumeAtHeight(c, 0.03) - g.displacement);
  near(geometry({ ...c, liquidHeight: 0 }).anodeArea, 0);
  near(geometry({ ...c, liquidHeight: 0 }).liquid, 0);
});
test("rod ends are included only when immersed, cathode area uses exposure", () => {
  const c = { ...presets.clear500, endsExposed: true, exposedFraction: 0.5 },
    g = geometry(c);
  near(
    g.anodeArea,
    6 * (2 * Math.PI * 0.002 * 0.047 + 2 * Math.PI * 0.002 ** 2),
  );
  near(g.cathodeProjectedArea, c.cathodeWidth * c.cathodeHeight * 0.5);
  const partial = { ...c, liquidHeight: 0.02 };
  near(
    geometry(partial).anodeArea,
    6 * (2 * Math.PI * 0.002 * 0.01 + Math.PI * 0.002 ** 2),
  );
});
test("all provisional presets are physically contained and invalid arrays are rejected", () => {
  for (const c of Object.values(presets)) {
    assert.deepEqual(validateConfig(c), []);
    assert.ok(geometry(c).capacity > 0);
  }
  assert.ok(validateConfig({ ...presets.clear500, anodeCount: 24 }).length);
  assert.throws(() => geometry({ ...presets.clear500, liquidHeight: 1 }));
  assert.ok(validateConfig({ ...presets.clear500, rodRadius: NaN }).length);
});
test("known loaded resistor converts 150 mV to 150 µA and 22.5 µW", () => {
  const e = electrical({
    mode: "loaded-resistor",
    voltageV: 0.15,
    resistanceOhm: 1000,
  });
  near(e.currentA, 150e-6);
  near(e.powerW, 22.5e-6);
  near(density(e.powerW, 0.002), 0.01125);
  near(density(e.powerW, 0.0005), 0.045);
});
test("OCV, unknown circuit and invalid loads never produce power", () => {
  for (const mode of ["ocv", "unknown"])
    assert.equal(
      electrical({ mode, voltageV: 0.5, currentA: 0.001, resistanceOhm: 1000 })
        .powerW,
      null,
    );
  for (const resistanceOhm of [0, -1, null, NaN])
    assert.equal(
      electrical({ mode: "loaded-resistor", voltageV: 0.5, resistanceOhm })
        .powerW,
      null,
    );
  assert.equal(
    electrical({ mode: "loaded-paired", voltageV: 0.2, currentA: null }).powerW,
    null,
  );
  near(
    electrical({ mode: "loaded-paired", voltageV: 0.2, currentA: 10e-6 })
      .powerW,
    2e-6,
  );
  assert.equal(density(1, 0), null);
});
test("integration uses trapezoids, sorts timestamps and breaks at unknown readings or load changes", () => {
  const r = (s, v, mode = "loaded-resistor", load = 1000) => ({
    timestamp: `2026-10-11T12:00:${s}.000Z`,
    voltageV: v,
    mode,
    resistanceOhm: load,
    condition: "baseline · unit A",
  });
  const rows = [r("10", 0.2), r("00", 0.1)];
  near(integrateReadings(rows).energyJ, ((0.00001 + 0.00004) / 2) * 10);
  assert.equal(
    integrateReadings([r("00", 0.1), r("05", 0.2, "unknown"), r("10", 0.2)])
      .energyJ,
    null,
  );
  assert.equal(
    integrateReadings([r("00", 0.1), r("10", 0.2, "loaded-resistor", 2000)])
      .energyJ,
    null,
  );
  assert.equal(
    integrateReadings([{ timestamp: null, voltageV: 0.2, mode: "unknown" }])
      .energyJ,
    null,
  );
});
test("energy does not connect different samples or unidentified series", () => {
  const a = {
    timestamp: "2026-10-11T10:00:00Z",
    voltageV: 0.15,
    mode: "loaded-resistor",
    resistanceOhm: 1000,
    condition: "unit A",
  };
  const b = { ...a, timestamp: "2026-10-11T11:00:00Z", condition: "unit B" };
  assert.deepEqual(integrateReadings([a, b]), {
    energyJ: null, chargeC: null, coveredSeconds: 0, segments: 0,
  });
  near(integrateReadings([a, { ...b, condition: "unit A" }]).energyJ, 0.081);
  near(integrateReadings([a, { ...b, condition: " unit A " }]).energyJ, 0.081);
  assert.equal(integrateReadings([{ ...a, condition: null }, { ...b, condition: null }]).energyJ, null);
  assert.equal(integrateReadings([a, b, { ...a, timestamp: "2026-10-11T12:00:00Z" }]).energyJ, null);
});
test("editing a value removes inherited evidence and preserves the source configuration", () => {
  const c = { ...presets.clear500, basis: { radius: "measured", rodHeight: "reported" } };
  const changedRod = editDimension(c, "rodHeight", 0.048);
  assert.equal(changedRod.basis.rodHeight, "provisional");
  assert.equal(changedRod.basis.radius, "measured");
  assert.equal(c.rodHeight, 0.047);
  assert.equal(c.basis.rodHeight, "reported");
  assert.equal(editDimension(c, "radius", 0.036).basis.radius, "provisional");
  assert.equal(editDimension(c, "rodHeight", 0.047).basis.rodHeight, "reported");
  const run = { workingVolumeM3: geometry(c).liquid, volumeBasis: "calculated" };
  const edited = { ...run, ...editWorkingVolume(run, 300e-6) };
  assert.equal(edited.volumeBasis, "provisional");
  near(edited.workingVolumeM3, 300e-6);
  assert.equal(JSON.parse(JSON.stringify(edited)).volumeBasis, "provisional");
  assert.match(toCsv([edited], ["workingVolumeM3", "volumeBasis"]), /provisional/);
  assert.deepEqual(editWorkingVolume(run, run.workingVolumeM3), {});
});
test("missing data is null, not zero; unit conversions are explicit", () => {
  for (const v of ["", " ", null, undefined, "bad"])
    assert.equal(nullableNumber(v), null);
  near(nullableNumber("150", 0.001), 0.15);
  near(nullableNumber("20", 1e-6), 0.00002);
  assert.equal(nullableNumber("0"), 0);
});
test("historical import preserves 15 conditions and never fabricates power or timestamps", () => {
  const readings = historicalRuns.flatMap((r) => r.readings);
  assert.equal(readings.length, 15);
  for (const r of readings) {
    assert.equal(r.timestamp, null);
    assert.equal(electrical(r).powerW, null);
    assert.equal(r.currentA, null);
  }
  assert.match(readings[3].rawVoltage, /pressed/);
  assert.equal(readings[10].voltageV, null);
  near(readings[10].voltageMinV, 0.16);
  assert.equal(readings[10].rawCurrent, "0.3");
});
test("CSV preserves delimiters, newlines, missing values and guards textual formulas", () => {
  const csv = toCsv(
    [{ raw: 'a,"b"\nc', current: null, n: 0, notes: "=1+1" }],
    ["raw", "current", "n", "notes"],
  );
  assert.equal(csv, 'raw,current,n,notes\r\n"a,""b""\nc",,0,\'=1+1');
});
test("backup validation supports historical nulls and rejects invalid units, IDs and geometry", () => {
  const good = {
    schemaVersion: 1,
    config: presets.clear500,
    runs: structuredClone(historicalRuns),
  };
  assert.equal(validateBackup(good), good);
  assert.throws(() => validateBackup({ ...good, schemaVersion: 2 }));
  assert.throws(() =>
    validateBackup({ ...good, runs: [good.runs[0], good.runs[0]] }),
  );
  const bad = structuredClone(good);
  bad.runs[0].readings[0].voltageV = "150";
  assert.throws(() => validateBackup(bad));
});
