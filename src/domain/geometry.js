// All lengths in metres, areas in m², volumes in m³. No biological model.
export const presets = {
  clear500: {
    shape: "clear",
    targetLitres: 0.5,
    radius: 0.035,
    bodyHeight: 0.115,
    shoulderHeight: 0.04,
    neckRadius: 0.01,
    neckHeight: 0.025,
    wallThickness: 0.0015,
    liquidHeight: 0.095,
    anodeCount: 6,
    rodRadius: 0.002,
    rodHeight: 0.047,
    rodBottom: 0.01,
    rodGap: 0.002,
    electrodeGap: 0.025,
    cathodeWidth: 0.044,
    cathodeHeight: 0.06,
    cathodeBottom: 0.015,
    cathodeCount: 8,
    exposedFraction: 1,
    endsExposed: false,
    separator: "boundary",
    dimensionStatus: "provisional",
  },
  clear1000: {
    shape: "clear",
    targetLitres: 1,
    radius: 0.044,
    bodyHeight: 0.14,
    shoulderHeight: 0.05,
    neckRadius: 0.012,
    neckHeight: 0.025,
    wallThickness: 0.0015,
    liquidHeight: 0.12,
    anodeCount: 8,
    rodRadius: 0.002,
    rodHeight: 0.047,
    rodBottom: 0.01,
    rodGap: 0.002,
    electrodeGap: 0.035,
    cathodeWidth: 0.05,
    cathodeHeight: 0.07,
    cathodeBottom: 0.015,
    cathodeCount: 10,
    exposedFraction: 1,
    endsExposed: false,
    separator: "boundary",
    dimensionStatus: "provisional",
  },
  white500: {
    shape: "white",
    targetLitres: 0.5,
    radius: 0.0375,
    bodyHeight: 0.11,
    shoulderHeight: 0.008,
    neckRadius: 0.012,
    neckHeight: 0.014,
    wallThickness: 0.0015,
    liquidHeight: 0.09,
    anodeCount: 6,
    rodRadius: 0.002,
    rodHeight: 0.047,
    rodBottom: 0.01,
    rodGap: 0.002,
    electrodeGap: 0.025,
    cathodeWidth: 0.044,
    cathodeHeight: 0.06,
    cathodeBottom: 0.015,
    cathodeCount: 8,
    exposedFraction: 1,
    endsExposed: false,
    separator: "boundary",
    dimensionStatus: "provisional",
  },
};
export const totalHeight = (c) =>
  c.bodyHeight + c.shoulderHeight + c.neckHeight;
export const isWallArc = (c) => c.electrodeArrangement === "wall-arc";
export function wallArcConfig(c) {
  return {
    ...c,
    electrodeArrangement: "wall-arc",
    cathodeFraction: 0.45,
    anodeWallInset: 0.001,
    filterThickness: 0.004,
    spacerRadius: 0.0025,
    cathodeMount: "boundary",
    rodGap: 0.005,
    separator: "boundary",
    basis: {
      ...c.basis,
      cathodeFraction: "provisional",
      anodeWallInset: "provisional",
      filterThickness: "provisional",
      spacerRadius: "provisional",
      rodGap: "reported",
    },
  };
}
export const wallArcPresets = Object.fromEntries(
  Object.entries(presets).map(([key, config]) => [key, wallArcConfig(config)]),
);
export const windowWidth = (c) => isWallArc(c)
  ? 2 * Math.PI * c.radius * c.cathodeFraction
  : c.cathodeWidth;
export const cathodeAngle = (c) => isWallArc(c)
  ? 2 * Math.PI * c.cathodeFraction
  : 2 * Math.asin(c.cathodeWidth / (2 * c.radius));
export const cathodeInsideFraction = (c) => !isWallArc(c) || c.cathodeMount === "boundary"
  ? 0.5 : c.cathodeMount === "inside" ? 1 : 0;
// A changed value is a proposal until its evidence is explicitly reassigned.
export function editDimension(c, key, valueSI) {
  if (c[key] === valueSI) return c;
  return {
    ...c,
    [key]: valueSI,
    basis: { ...c.basis, [key]: "provisional" },
  };
}
export function cylinderVolume(r, h) {
  return Math.PI * r * r * h;
}
export function frustumVolume(r0, r1, h) {
  return ((Math.PI * h) / 3) * (r0 * r0 + r0 * r1 + r1 * r1);
}
export function volumeAtHeight(c, height) {
  const h = Math.max(0, Math.min(height, totalHeight(c)));
  let v = cylinderVolume(c.radius, Math.min(h, c.bodyHeight));
  const shoulderFill = Math.min(
    c.shoulderHeight,
    Math.max(0, h - c.bodyHeight),
  );
  if (shoulderFill > 0) {
    const topR =
      c.radius + ((c.neckRadius - c.radius) * shoulderFill) / c.shoulderHeight;
    v += frustumVolume(c.radius, topR, shoulderFill);
  }
  v += cylinderVolume(
    c.neckRadius,
    Math.max(0, h - c.bodyHeight - c.shoulderHeight),
  );
  return v;
}
export function electrodeLayout(c) {
  if (isWallArc(c)) {
    const halfAngle = cathodeAngle(c) / 2;
    const anodeRadius = c.radius - c.anodeWallInset - c.rodRadius;
    const cathodeRadius = c.cathodeMount === "outside"
      ? c.radius + c.wallThickness + c.rodRadius
      : c.cathodeMount === "inside" ? c.radius - c.rodRadius - 0.001 : c.radius;
    const spacerRadius = c.radius - c.spacerRadius;
    // Chord pitch: rodGap is the clear surface gap, not centre spacing.
    const pitchAngle = 2 * Math.asin((2 * c.rodRadius + c.rodGap) / (2 * anodeRadius));
    const edgeClearance = Math.asin((c.spacerRadius + c.rodRadius + 0.001) / Math.min(anodeRadius, cathodeRadius));
    const point = (radius, angle) => ({x: radius * Math.cos(angle), z: radius * Math.sin(angle), angle});
    return {
      anodeX: -anodeRadius,
      cathodeX: cathodeRadius,
      anodeRadius,
      cathodeRadius,
      halfAngle,
      edgeClearance,
      anodeStart: halfAngle + edgeClearance,
      anodeSpan: 2 * Math.PI - 2 * (halfAngle + edgeClearance),
      positions: Array.from({length: c.anodeCount}, (_, i) => point(anodeRadius, Math.PI + (i - (c.anodeCount - 1) / 2) * pitchAngle)),
      cathodePositions: Array.from({length: c.cathodeCount}, (_, i) => point(cathodeRadius, c.cathodeCount === 1 ? 0 : (2 * i / (c.cathodeCount - 1) - 1) * (halfAngle - edgeClearance))),
      spacerPositions: [-1, 1].map(sign => point(spacerRadius, sign * halfAngle)),
    };
  }
  const cathodeX = Math.sqrt(
    Math.max(0, c.radius * c.radius - (c.cathodeWidth / 2) ** 2),
  );
  const anodeX = cathodeX - c.electrodeGap - c.rodRadius;
  const pitch = 2 * c.rodRadius + c.rodGap;
  return {
    cathodeX,
    anodeX,
    positions: Array.from({ length: c.anodeCount }, (_, i) => ({
      x: anodeX,
      z: (i - (c.anodeCount - 1) / 2) * pitch,
    })),
  };
}
export function validateConfig(c) {
  const problems = [];
  if (!["clear", "white"].includes(c.shape))
    problems.push("Unknown bottle shape.");
  if (typeof c.endsExposed !== "boolean")
    problems.push("Rod-end exposure must be a boolean.");
  if (c.electrodeArrangement !== undefined && !["flat", "wall-arc"].includes(c.electrodeArrangement))
    problems.push("Unknown electrode layout.");
  for (const key of [
    "radius",
    "bodyHeight",
    "shoulderHeight",
    "neckRadius",
    "neckHeight",
    "wallThickness",
    "rodRadius",
    "rodHeight",
    "cathodeHeight",
  ])
    if (!Number.isFinite(c[key]) || c[key] <= 0)
      problems.push(`${key} must be positive.`);
  for (const key of ["liquidHeight", "rodBottom", "rodGap", "cathodeBottom"])
    if (!Number.isFinite(c[key]) || c[key] < 0)
      problems.push(`${key} cannot be negative.`);
  for (const key of ["anodeCount", "cathodeCount"])
    if (!Number.isInteger(c[key]) || c[key] < 1 || c[key] > 24)
      problems.push(`${key} must be an integer from 1 to 24.`);
  if (c.neckRadius > c.radius)
    problems.push("Neck radius cannot exceed body radius.");
  if (c.wallThickness >= c.radius / 3)
    problems.push("Wall thickness is too large for this schematic.");
  if (c.liquidHeight > totalHeight(c))
    problems.push("Liquid level exceeds the internal height.");
  if (c.rodBottom + c.rodHeight > c.bodyHeight)
    problems.push("Anodes extend beyond the straight body.");
  if (!isWallArc(c)) {
    if (!Number.isFinite(c.electrodeGap) || c.electrodeGap <= 0)
      problems.push("Electrode gap must be positive.");
    if (!Number.isFinite(c.cathodeWidth) || c.cathodeWidth <= 0 || c.cathodeWidth >= 2 * c.radius)
      problems.push("Cathode window must be positive and narrower than the body diameter.");
  } else {
    if (!Number.isFinite(c.cathodeFraction) || c.cathodeFraction <= 0 || c.cathodeFraction > 0.5)
      problems.push("Cathode coverage must be greater than 0 and at most 50% of the circumference.");
    for (const key of ["anodeWallInset", "filterThickness", "spacerRadius"])
      if (!Number.isFinite(c[key]) || c[key] <= 0 || c[key] >= c.radius / 3)
        problems.push(`${key} must be positive and less than one third of the bottle radius.`);
    if (c.filterThickness < 2 * c.rodRadius)
      problems.push("Anode filter thickness must accommodate the rod diameter in this reconstruction.");
    if (!["boundary", "inside", "outside"].includes(c.cathodeMount))
      problems.push("Unknown cathode mounting position.");
    if (c.separator === "sheet")
      problems.push("The wall-arc design uses edge spacers, not a transverse sheet.");
  }
  if (c.cathodeBottom + c.cathodeHeight > c.bodyHeight)
    problems.push("Cathode window extends beyond the straight body.");
  if (
    c.cathodeHeight < c.rodHeight ||
    windowWidth(c) < 2 * c.rodRadius * c.cathodeCount
  )
    problems.push("Cathode rods do not fit within the selected window.");
  if (isWallArc(c) && problems.length === 0) {
    const layout = electrodeLayout(c);
    const within = layout.positions.every(p => Number.isFinite(p.x) && p.angle >= layout.anodeStart && p.angle <= layout.anodeStart + layout.anodeSpan);
    const rods = [...layout.positions, ...layout.cathodePositions];
    const overlaps = rods.some((p, i) => rods.slice(i + 1).some(q => Math.hypot(p.x - q.x, p.z - q.z) < 2 * c.rodRadius - 1e-12));
    const spacerOverlap = rods.some(p => layout.spacerPositions.some(q => Math.hypot(p.x - q.x, p.z - q.z) < c.rodRadius + c.spacerRadius));
    if (!within || overlaps || spacerOverlap || !Number.isFinite(layout.edgeClearance) || layout.halfAngle <= layout.edgeClearance)
      problems.push("Rods and edge spacers do not fit: reduce count, diameter or spacing, or enlarge the window/bottle.");
  }
  if (!isWallArc(c) &&
    !Number.isFinite(c.exposedFraction) ||
    c.exposedFraction < 0 ||
    c.exposedFraction > 1
  )
    problems.push("Air exposure must be between 0 and 100%.");
  if (!["boundary", "sheet", "none"].includes(c.separator))
    problems.push("Unknown separator arrangement.");
  if (
    problems.length === 0 &&
    electrodeLayout(c).positions.some(
      (p) => Math.hypot(p.x, p.z) + c.rodRadius > c.radius,
    )
  )
    problems.push(
      "Anode array does not fit: reduce count, spacing or separation.",
    );
  return problems;
}
export function geometry(c) {
  const errors = validateConfig(c);
  if (errors.length) throw new Error(errors.join(" "));
  const capacity = volumeAtHeight(c, totalHeight(c));
  const immersed = Math.max(
    0,
    Math.min(c.rodHeight, c.liquidHeight - c.rodBottom),
  );
  const cathodeImmersed = Math.max(
    0,
    Math.min(c.rodHeight, c.liquidHeight - c.cathodeBottom),
  );
  const displacement =
    cylinderVolume(c.rodRadius, immersed) * c.anodeCount +
    cylinderVolume(c.rodRadius, cathodeImmersed) * c.cathodeCount * cathodeInsideFraction(c);
  const liquid = Math.max(0, volumeAtHeight(c, c.liquidHeight) - displacement);
  const ends =
    c.endsExposed && immersed > 0
      ? Math.PI *
        c.rodRadius ** 2 *
        (1 + (c.liquidHeight >= c.rodBottom + c.rodHeight ? 1 : 0))
      : 0;
  const anodeArea =
    (2 * Math.PI * c.rodRadius * immersed + ends) * c.anodeCount;
  const cathodeProjectedArea =
    windowWidth(c) * c.cathodeHeight * c.exposedFraction;
  const wettedWindowHeight = Math.max(
    0,
    Math.min(c.cathodeHeight, c.liquidHeight - c.cathodeBottom),
  );
  return {
    capacity,
    liquid,
    headspace: capacity - volumeAtHeight(c, c.liquidHeight),
    displacement,
    anodeArea,
    cathodeProjectedArea,
    cathodeArea: cathodeProjectedArea,
    cathodeAreaBasis: isWallArc(c) ? "Curved inner-wall window" : "Flat projected window",
    windowArcLength: windowWidth(c),
    wettedWindowArea: windowWidth(c) * wettedWindowHeight,
    immersed,
    layout: electrodeLayout(c),
  };
}
