# MFC Research Workbench

A local browser research notebook and parametric geometry workbench for the proposed 0.5–1 L bottle reactor. The historical micro-scale prototype is a separate design. Start with [research/phase-0.md](research/phase-0.md) for the source inventory, research summary, uncertainty register, missing dimensions and architecture.

[Open the published workbench](https://mashhumaximilian.github.io/mfc-research-workbench/) · [GitHub repository](https://github.com/MashhuMaximilian/mfc-research-workbench)

This is a React/Vite project with Three.js and independent calculation modules. The static Pages app needs no server or account. New experiment records stay in the visitor's browser; GitHub hosts the application and curated source material, not the working notebook.

## First session

1. Open the hosted app, or launch the local app below. In **Reactor**, choose a bottle preset and enter its measured internal dimensions. Defaults are provisional. Use the evidence selector only after measuring; editing a value resets its status.
2. Rotate, zoom, inspect cutaway/exploded views and component layers. The current flat cathode panel does not yet match the owner's clarified wall-arc design; see [the clarification and outstanding questions](research/design-clarification-2026-10-12.md).
3. Select **Start an experiment** to snapshot the current configuration. In **Notebook**, record the actual working volume, materials, inoculum, feedstock, measurement setup and controls. Later reactor edits do not change that snapshot.
4. Add readings with voltage in **mV**. For a known external resistor, record **Ω** and measure voltage across it. OCV and unknown-circuit readings leave power blank. Use timestamps and a consistent condition/sample ID for repeated readings of the same setup; give a changed sample or load a new ID.
5. Use **Evidence** to inspect original observations, source links and missing information. **Next experiments** ranks test plans using your weights; it does not predict biological output.
6. Download a **JSON backup** after each session. CSV exports readings; JSON preserves the full working notebook. To move from local to hosted use, back up locally, open the hosted app and restore the JSON there. Different browsers and addresses have separate storage and do not synchronize automatically.

## Run locally

Double-click **Start Workbench.command** in Finder to start the local server and open the app. Keep its terminal window open; Ctrl+C stops it.

Requires Node.js 20.19+ or 22.12+; developed with Node 24.15. Dependencies are installed in this workspace. Alternatively, from this folder:

```sh
npm ci                     # only needed after removing node_modules or moving the project
npm run dev -- --port 5173
```

Open http://127.0.0.1:5173 in your browser. Keep the terminal open; Ctrl+C stops the server. The same browser and address retain your records. A different port or browser has different storage.

For a production build:

```sh
npm test
npm run build
npm run preview -- --port 5173
```

Serve the app over HTTP; opening dist/index.html directly is unsupported. No cloud account, paid simulation service, remote font or analytics is required. Original-source links need network access, while preserved copies and calculations work locally. A WebGL-capable browser renders the 3D model; the editor and calculations remain usable without it.

## What is implemented

- Three.js bottle reconstruction, alternative white/clear provisional presets, orbit/zoom/pan, assembly/cutaway/exploded views, dimension labels, six component layers and component explanations.
- Editable internal dimensions, rod counts/dimensions/spacing, liquid height, projected cathode window, air exposure and separator arrangement. Values carry provisional, source-reported or measured evidence labels. Changing a numeric value resets its evidence to provisional; original source dimensions remain in the notes.
- Pure SI calculations for cylinder/frustum/neck volume, partially immersed core displacement and exposed geometric area. Visible equations and excluded geometry.
- Two historical source collections containing 15 reported conditions. Original strings, ranges, pressing qualifiers, mold observation and unresolved current units are preserved. No dates, current, power or independent replicates were invented.
- New experiment records snapshot the current configuration. Record materials, inoculum, feedstock, conditions, method, controls, deviations, readings and interpretation.
- Explicit OCV, unknown, resistor-loaded or same-circuit paired V/I readings; voltage/current/power plots, declared density denominators and sampled trapezoidal energy estimates. Timed lines and energy estimates connect only adjacent readings with the same nonblank condition/sample ID and circuit/load; blank IDs, missing values and series changes break continuity.
- CSV readings export, record comparison, automatic browser saves and versioned JSON backup/restore. Restore downloads a copy of the previous working data first.
- Evidence section with 19 sources, extracted facts, 12 unresolved questions and a primary-literature starting bibliography. Five small experimental proposals with mechanisms, limits, controls, support/refutation criteria and editable priority weights.

## Scientific limits

The dimensions are **provisional**, except selected rod dimensions copied from the notes and labelled source-reported. Measure the actual bottle before fabrication. The profile approximates an internal cylinder, conical frustum and neck; original CAD is unavailable. Threads, seals, cloth texture, wiring, insulated leads and vent are schematic. This is not a pressure-rated or manufacturing-ready assembly.

Anode area describes immersed graphite cores, not fibre-scale or electrochemically active area. Projected cathode window area is a separate denominator. Volume excludes unknown cloth, collector and irregular-base displacement; cathode cores are assumed half inside the liquid boundary.

The proposed PE/filter separator is not established as a proton-exchange membrane. Growth, gas, voltage changes and substrate consumption do not by themselves prove extracellular electron transfer. No biological power forecast or evolutionary improvement is simulated. P = VI is used only for appropriately paired loaded readings; P = V²/R assumes DC voltage across the recorded external resistor. OCV and separately measured short-circuit current are never paired.

Polarization fitting, internal-resistance estimation, mass balances, substrate consumption, automated literature retrieval, culture selection and uncertainty propagation are future phases requiring suitable measurements.

## Data and provenance

Published source copies are the eight supplied images, the curated assessment and a hash inventory without private origin paths. Raw Notion/Google/Grok exports and the original full inventory remain in this workspace under research/originals and research/inventory.json; they are ignored by Git. Local development can read them, but production builds copy only an explicit allowlist and hide raw-export download links. These raw files are not present in a fresh clone. The Grok file is a selected excerpt and audit, not a complete transcript. External Notion and Google documents were read only.

Working experiments are stored under mfc-workbench-v1 in browser localStorage; they are not written back to Notion or to source files. Export a JSON backup regularly. CSV exports readings and associated setup metadata; JSON also preserves planned records, annotations and the entire configuration. Clearing browser storage removes working records. Unreadable saved data is preserved and automatic overwriting is blocked until a valid restore.

## Code structure

- src/domain/geometry.js: physical geometry, validation and SI formulas
- src/domain/electrical.js: circuit calculations, densities and integration
- src/domain/data.js: nullable conversion, CSV and backup validation
- src/domain/assets.js and src/assets.js: root/subpath asset URLs
- src/data.js: immutable historical data, source register, uncertainties, experiment proposals
- src/components/ReactorScene.jsx: rendering only; no biological calculations
- src/components/Reactor.jsx: configuration and geometry outputs
- src/components/Notebook.jsx and ReadingPlot.jsx: experiment records, export and plots
- src/components/Research.jsx: evidence and experiment priorities
- src/App.jsx: local persistence, restore and navigation
- scripts/public-assets.mjs: explicit published source allowlist and public hash inventory
- tests: calculation, circuit, conversion, provenance, backup and publication-isolation checks

## GitHub Pages deployment

Pushes to main run the tests, build with the repository subpath, and deploy through .github/workflows/pages.yml. Pages serves static files. A private source repository would not by itself make a Pages website private; this repository and website are intentionally public.

To check the same subpath locally:

```sh
PAGES_BASE_PATH=/mfc-research-workbench/ npm run build
PAGES_BASE_PATH=/mfc-research-workbench/ npm run preview -- --port 5173
```

Then open http://127.0.0.1:5173/mfc-research-workbench/. The build excludes local raw exports even when they exist in the checkout.

## Validation

16 automated tests passed, including public-build isolation and Pages asset-path checks. Production build passed (Vite reports a large bundle because Three.js is included). Browser checks verified dimension edits, presets, views/layers, historical null-power behavior, new readings, configuration snapshots, CSV/JSON downloads, restore, reload persistence, comparison and research navigation. Regression tests verify evidence resets and sample boundaries. Synthetic software QA data used a separate local origin and is absent from the main notebook. Desktop and mobile captures are recorded under .impeccable/review.
