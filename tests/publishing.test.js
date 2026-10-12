import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { assetUrl } from "../src/domain/assets.js";
import { publishedAssets, publishSources } from "../scripts/public-assets.mjs";

test("source links work at the local root and at the GitHub Pages subpath", () => {
  assert.equal(assetUrl("/sources/photo.jpg"), "/sources/photo.jpg");
  assert.equal(assetUrl("/sources/photo.jpg", "/mfc-research-workbench/"), "/mfc-research-workbench/sources/photo.jpg");
  assert.equal(assetUrl("https://example.org/paper", "/mfc-research-workbench/"), "https://example.org/paper");
});

test("publication excludes private exports and preserves original image bytes", async () => {
  const directory = await mkdtemp(join(tmpdir(), "mfc-publication-"));
  try {
    const source = join(directory, "source"), destination = join(directory, "published");
    await mkdir(source);
    for (const name of publishedAssets) await writeFile(join(source, name), `original bytes: ${name}`);
    for (const name of ["notion-mfc.json", "inventory.json", "new-private-note.md"]) {
      await writeFile(join(source, name), "private content must stay local");
    }
    await publishSources(source, destination);
    assert.deepEqual((await readdir(destination)).sort(), [...publishedAssets, "public-inventory.json"].sort());
    assert.deepEqual(await readFile(join(destination, "S02-clear-bottle.jpg")), await readFile(join(source, "S02-clear-bottle.jpg")));
    const inventory = JSON.parse(await readFile(join(destination, "public-inventory.json"), "utf8"));
    assert.equal(inventory.files.length, 9);
    assert.ok(inventory.files.every(file => !file.file.includes("/") && /^[a-f0-9]{64}$/.test(file.sha256)));
    assert.ok(!JSON.stringify(inventory).includes(directory));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
