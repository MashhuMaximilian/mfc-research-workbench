import { fileURLToPath } from "node:url";
import { publishSources } from "./public-assets.mjs";

await publishSources(
  fileURLToPath(new URL("../public/sources/", import.meta.url)),
  fileURLToPath(new URL("../dist/sources/", import.meta.url)),
);
console.log("Published 8 reference images, the curated assessment and a public hash inventory.");
