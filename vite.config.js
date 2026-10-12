import { defineConfig } from "vite";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

export default defineConfig(({ command }) => ({
  base: process.env.PAGES_BASE_PATH || "/",
  define: {
    __MFC_HAS_LOCAL_ARCHIVE__: command === "serve" && [
      "inventory.json", "notion-mfc.json", "notion-phd.json",
      "feasibility-study.md", "research-path.md", "grok-audit.md",
    ].every(name => existsSync(fileURLToPath(new URL(`./public/sources/${name}`, import.meta.url)))),
  },
  // Local development can read the preserved archives. Published builds copy
  // only the explicit allowlist, even when private files exist in this checkout.
  publicDir: command === "serve" ? "public" : false,
}));
