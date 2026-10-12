import React from "react";
import { electrical, sameReadingSeries } from "../domain/electrical.js";
export default function ReadingPlot({
  readings,
  metric = "voltage",
  timed = false,
}) {
  const factor = metric === "voltage" ? 1000 : 1e6,
    unit = metric === "voltage" ? "mV" : metric === "current" ? "µA" : "µW";
  const value = (r) =>
    metric === "voltage"
      ? r.voltageV
      : metric === "current"
        ? electrical(r).currentA
        : electrical(r).powerW;
  const data = readings.filter(
    (r) => !timed || (r.timestamp && Number.isFinite(Date.parse(r.timestamp))),
  );
  const points = data
    .map((r, i) => ({
      r,
      x: timed ? Date.parse(r.timestamp) : i,
      y: value(r),
      lo: metric === "voltage" ? r.voltageMinV : null,
      hi: metric === "voltage" ? r.voltageMaxV : null,
    }))
    .sort((a, b) => a.x - b.x);
  const valid = points.filter(
    (p) => Number.isFinite(p.y) || Number.isFinite(p.lo),
  );
  if (!valid.length)
    return (
      <div className="chart-empty">
        {timed
          ? "No dated, numeric readings for this metric yet."
          : "This metric needs a known load or paired current."}
        <span>Missing values stay blank; they are never treated as zero.</span>
      </div>
    );
  const minX = Math.min(...points.map((p) => p.x)),
    maxX = Math.max(...points.map((p) => p.x));
  const vals = valid.flatMap((p) => [p.y, p.lo, p.hi].filter(Number.isFinite));
  const low = Math.min(0, ...vals),
    high = Math.max(...vals, low + 1e-6),
    span = high - low;
  const sx = (x) => 70 + ((x - minX) / (maxX - minX || 1)) * 650,
    sy = (y) => 220 - ((y - low) / (span * 1.12)) * 175;
  const segments = [];
  let segment = [];
  for (const p of points) {
    if (!Number.isFinite(p.y)) {
      if (segment.length) segments.push(segment);
      segment = [];
      continue;
    }
    if (
      segment.length &&
      !sameReadingSeries(segment.at(-1).r, p.r)
    ) {
      segments.push(segment);
      segment = [];
    }
    segment.push(p);
  }
  if (segment.length) segments.push(segment);
  return (
    <div className="plot">
      <svg
        viewBox="0 0 800 270"
        role="img"
        aria-label={`${timed ? "Time series" : "Condition comparison"} of ${metric} in ${unit}. Exact readings and qualifiers are listed in the table.`}
      >
        <text x="14" y="20" className="axis-text">
          {unit}
        </text>
        {[0, 0.25, 0.5, 0.75, 1].map((f) => {
          const v = low + span * 1.12 * f;
          return (
            <g key={f}>
              <line x1="70" x2="740" y1={sy(v)} y2={sy(v)} stroke="#dce4e0" />
              <text x="57" y={sy(v) + 4} textAnchor="end" className="axis-text">
                {(v * factor).toFixed(metric === "voltage" ? 0 : 2)}
              </text>
            </g>
          );
        })}
        {timed &&
          segments.map((s, i) => (
            <polyline
              key={i}
              points={s.map((p) => `${sx(p.x)},${sy(p.y)}`).join(" ")}
              fill="none"
              stroke="#276f6b"
              strokeWidth="2"
            />
          ))}
        {valid.map((p, i) => (
          <g key={i}>
            <title>
              {p.r.condition || p.r.timestamp}:{" "}
              {p.r.rawVoltage ||
                ((p.y ?? p.lo) * factor).toFixed(2) + " " + unit}{" "}
              {p.r.notes}
            </title>
            {Number.isFinite(p.y) ? (
              <circle cx={sx(p.x)} cy={sy(p.y)} r="4.5" fill="#276f6b" />
            ) : (
              <>
                <line
                  x1={sx(p.x)}
                  x2={sx(p.x)}
                  y1={sy(p.lo)}
                  y2={sy(p.hi)}
                  stroke="#b3792c"
                  strokeWidth="3"
                />
                {[p.lo, p.hi].map((v) => (
                  <line
                    key={v}
                    x1={sx(p.x) - 5}
                    x2={sx(p.x) + 5}
                    y1={sy(v)}
                    y2={sy(v)}
                    stroke="#b3792c"
                  />
                ))}
              </>
            )}
          </g>
        ))}
        {timed ? (
          <>
            <text x="70" y="247" className="axis-text">
              {new Date(minX).toLocaleString()}
            </text>
            <text x="740" y="247" textAnchor="end" className="axis-text">
              {maxX === minX
                ? "Single reading"
                : new Date(maxX).toLocaleString()}
            </text>
          </>
        ) : (
          points.map((p, i) => (
            <text
              key={i}
              x={sx(p.x)}
              y="247"
              textAnchor="middle"
              className="axis-text"
            >
              {i + 1}
            </text>
          ))
        )}
      </svg>
      <p>
        {timed
          ? "Lines connect adjacent dated readings with the same explicit condition / sample ID and circuit. Missing values, blank IDs and sample or load changes break the line."
          : "Numbers match table rows; each point is a different condition. Range bars retain source ranges. No time sequence or replicates are implied."}
      </p>
    </div>
  );
}
