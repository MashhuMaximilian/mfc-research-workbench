import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";

export const publishedAssets = Object.freeze([
  "S01-frame-perspective.jpg",
  "S02-clear-bottle.jpg",
  "S03-white-bottle.jpg",
  "S04-removable-base.jpg",
  "S05-reactor-drawing.jpg",
  "S06-meter-negative.jpg",
  "S07-meter-positive.jpg",
  "S08-frame-side.jpg",
  "phase-0.md",
  "design-clarification-2026-10-12.md",
  "first-bottle-protocol.md",
]);

export async function publishSources(sourceDirectory, destinationDirectory) {
  await mkdir(destinationDirectory, { recursive: true });
  const files = [];
  for (const name of publishedAssets) {
    const bytes = await readFile(join(sourceDirectory, name));
    await copyFile(join(sourceDirectory, name), join(destinationDirectory, name));
    files.push({
      file: name,
      bytes: bytes.length,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    });
  }
  await writeFile(
    join(destinationDirectory, "public-inventory.json"),
    JSON.stringify({
      description: "Published source copies. Raw document exports and private origin paths are kept in the local archive.",
      files,
    }, null, 2) + "\n",
  );
}
