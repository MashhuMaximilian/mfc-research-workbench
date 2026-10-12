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
  for (const key of [
    "radius",
    "bodyHeight",
    "shoulderHeight",
    "neckRadius",
    "neckHeight",
    "wallThickness",
    "rodRadius",
    "rodHeight",
    "electrodeGap",
    "cathodeWidth",
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
  if (c.cathodeWidth >= 2 * c.radius)
    problems.push("Cathode window must be narrower than the body diameter.");
  if (c.cathodeBottom + c.cathodeHeight > c.bodyHeight)
    problems.push("Cathode window extends beyond the straight body.");
  if (
    c.cathodeHeight < c.rodHeight ||
    c.cathodeWidth < 2 * c.rodRadius * c.cathodeCount
  )
    problems.push("Cathode rods do not fit within the selected window.");
  if (
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
    (cylinderVolume(c.rodRadius, cathodeImmersed) * c.cathodeCount) / 2;
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
    c.cathodeWidth * c.cathodeHeight * c.exposedFraction;
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
    wettedWindowArea: c.cathodeWidth * wettedWindowHeight,
    immersed,
    layout: electrodeLayout(c),
  };
}
