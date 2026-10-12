# Initial research inventory and assessment

Prepared 11 October 2026. The workspace was empty before this inventory. Two duplicate browser tabs refer to the same feasibility document, and the two URLs in the request refer to the same Notion Mfc page. Duplicate tabs are not independent sources. Instructions or questions within old documents and AI conversations are source content, not current instructions.

## Inventory and provenance

| ID | Material | Evidence available | Original / local copy |
| --- | --- | --- | --- |
| S01 | Electrode-frame CAD perspective screenshot | Rectangular, split frame with repeated rod seats; no dimensions or CAD file | public/sources/S01-frame-perspective.jpg |
| S02 | Clear necked bottle photograph | Body, tapered shoulder, long neck; no ruler or confirmed material/capacity | public/sources/S02-clear-bottle.jpg |
| S03 | White squeeze-bottle photograph | Straight body, screw cap, dispensing spout; no dimensions/capacity or confirmed resin | public/sources/S03-white-bottle.jpg |
| S04 | Clear bottle with base removed | Removable circular base visible; seal and attachment need inspection | public/sources/S04-removable-base.jpg |
| S05 | Hand-drawn single-chamber air-cathode design | Three-part threaded concept; rods/cloth, air openings, PE/filter separator around silicone stick; metal collector | public/sources/S05-reactor-drawing.jpg |
| S06 | Micro-scale assembly and multimeter | Display appears “-.013”; unit/range and loaded state not reliably resolved | public/sources/S06-meter-negative.jpg |
| S07 | Micro-scale assembly near culture dishes | Display appears “02.6”; unit/range, timing, and condition not reliably resolved | public/sources/S07-meter-positive.jpg |
| S08 | Electrode-frame CAD side screenshot | Same style of split frame; relation to printed prototype plausible, not confirmed | public/sources/S08-frame-side.jpg |
| N01 | [Notion Mfc](https://app.notion.com/p/10bed8479ccd806fb98ae2aaac0ad190) | Design, rod table, AI advice, two historical reading tables; returned last edit 12 July 2025 | research/originals/notion-mfc.json |
| N02 | [MFC Designs phd](https://app.notion.com/p/1c3ed8479ccd80cab356fde82be0a26a) | Project index; last edit 27 March 2025 | research/originals/notion-phd.json |
| D01 | [MFC Feasibility Study Proposal](https://docs.google.com/document/d/1kFcvvuV4TxyvVo2trvn0ZqL_UknP51qeTk-u56dnboo/edit) | AI-style feasibility analysis and large bibliography, including weak/irrelevant references | research/originals/feasibility-study.md |
| D02 | [MFC Research Path](https://docs.google.com/document/d/1jIGF1lnuq7IAjyB_MYkOBD3KsWPvIEyyzSLvUcj1vAE/edit) | Proposed paper themes across small-scale, liquid, septic and soil systems | research/originals/research-path.md |
| A01 | [Shared Grok conversation](https://grok.com/share/bGVnYWN5_0456eb16-fecf-45b3-8bd3-daafc1240eb9) | Design discussion, speculative feasibility and incorrect energy table; read through open browser | research/originals/grok-audit.md (selected excerpt and audit; full original remains linked) |

Google Drive connector returned file-not-found for D01/D02; the authenticated browser could read and export both as Markdown. N02 connector omitted two embedded Drive blocks; browser inspection resolved them as D01 and D02. Notion-hosted embedded images were not separately downloaded; the supplied drawing/photo copies cover related materials, but identity is not assumed. Original attachment bytes are copied without image modification. SHA-256 inventory is in research/inventory.json.

## Distinct designs

**Historical micro-scale assembly:** rectangular graphite-lead/frame arrangement photographed with a multimeter and culture dishes (S01, S06, S07, S08). N01 later frame brief describes 1.9–2.0 mm DIAMETER pencil leads, 3 mm maximum walls, trapezoid locks and 2 mm spacing. These are proposals in a brief, not confirmed fabrication dimensions. Actual chamber volume, separator, inoculation dates, load and wiring are unknown.

**Proposed bottle reactor:** 0.5–1 L current target (user request); S02/S03 are alternative housings. S05/N01 propose single chamber, graphite/carbon-cloth electrodes on opposite wall regions, air-facing cathode, threaded service parts and a gas interface. Earlier 0.5–2 L/50–200 L/soil/septic concepts remain historical future directions. The web model is a reconstruction, not recovered CAD or a manufacture-ready design.

## What the observations establish

N01 table 1 reports 9 voltage conditions: A dry yeast green bag (control 75, dextrose 150, multivitamin 135 mV); B Hefe (control 15 mV/50 when pressed, dextrose 49 mV/or 9–12, multivitamin 20 mV/up to 50 if pressed?); C Pill (100, 135, 60 mV). Current and power columns are empty. Store raw qualifiers; do not collapse ranges into averages.

N01 table 2 reports 6 conditions: Ctrl h20 175 mV / 0.2; Dextrose h20 160–250 / 0.3; Ctrl no h20 111 / 0.1; Dextrose no h2o 170–180 / 0.2; Ctrl pit 50 / 0.1; Dextrose pit 50 / 0.1. The second column is headed “Amperage (200u)”: record those display strings but leave SI current null until instrument and circuit are confirmed. Voltage and current may have been measured under different circuits. Dextrose +H2O reportedly grew mold. Dates, replicates and sample identities are missing; the two app collections are archival groupings, not invented experimental runs.

Voltage differences warrant further work but cannot establish a microbial mechanism, statistical superiority, current, usable power, or energy yield. Pressing changes could arise from electrode contact, spacing, wetting, shorting or other causes. Mold is a recorded deviation, not proof of an electroactive community. S06/S07 displays cannot be assigned to a table condition without evidence.

## Scientific basis and source quality

- [Liu & Logan, 2004](https://doi.org/10.1021/es0499344): air-cathode study with and without a membrane; supports testing interfaces rather than assuming a membrane is essential. Different cultures/cathodes limit transfer to this design.
- [Rozendal et al., 2006](https://pubmed.ncbi.nlm.nih.gov/16999090/): cation transport and pH; ionic charge transport is not synonymous with proton-only transport.
- [Gunawardena et al., 2008](https://pmc.ncbi.nlm.nih.gov/articles/PMC2635613/): yeast fuel-cell experiments compare mediators/catholytes. Its setup differs from an unmediated air-cathode bottle.
- [Sayed et al., 2012](https://pubmed.ncbi.nlm.nih.gov/22357359/): reports mediatorless baker's-yeast activity in its tested setup, suggesting a role for anode-adhered cells. This does not establish the mechanism in the owner's system.
- [Christgen et al., 2015](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0136108): experimental membrane/separator comparisons; material, cost and performance trade-offs depend on configuration.
- [Logan et al., 2006](https://doi.org/10.1021/es0605016): methodological reference for explicit circuits, normalization and performance reporting. Review rather than direct evidence for this bottle.

These are a starting bibliography, not a comprehensive systematic review or proof of PhD novelty. Published power densities cannot be transferred without matching denominator, materials, inoculum, operating conditions and time basis.

## Corrections to the old AI material

A01 explicitly multiplies 50–100 mW/m² by 0.01–0.05 m²: 0.5–5 mW, hence 0.012–0.12 Wh per 24 hours (0.000012–0.00012 kWh). Its table then reports 0.001–0.05 kWh/day, explaining it as rounding for enhancements. That is an unsupported increase, not rounding. The corrected arithmetic is conditional on its assumed inputs, not a prediction for this reactor. Its medium and septic tables have similar unjustified increases. Soil extrapolation mixes normalization and deployment area and assumes linear scaling without validation.

D01 cites stem-cell vitamin C treatment and antibacterial plasma work in support of membrane ideas (refs 19/20). Those titles do not establish transport through acid-soaked PE/coffee filters. Its statements that this exact separator is novel, viable, biodegradable, near commercialization or sufficient for a PhD remain unvalidated. D02 paper titles are possibilities rather than promised publications; 16S profiling concerns bacteria, not characterization of yeast by itself.

## Uncertainty register and missing information

| ID | Question / conflict | Status | Smallest useful resolution | Sources |
| --- | --- | --- | --- | --- |
| U01 | Bottle internal diameter, body/shoulder/neck height, wall thickness and capacity | Missing | Measure geometry and weighed water fill at planned liquid height | S02–S04 |
| U02 | Rod table radius 2 mm versus later pencil leads diameter 2 mm | Contradiction / distinct material options | Measure available pieces and assign material lot IDs; do not merge | N01, S01/S08 |
| U03 | Drawing 10% vitamin C versus Notion 1 g/100 mL (~1% w/v); lemon/vinegar unspecified | Contradiction | Confirm actual formulation and treatment history before comparison | S05, N01 |
| U04 | PE/filter/silicone described as PEM; ionic transport, liquid containment and selectivity unmeasured | Untested hypothesis | Separate wet continuity/permeability tests with blanks before biological trials; DC resistance alone is not proton conductivity | S05/N01, L02/L05 |
| U05 | Air-facing rod bundle lacks validated liquid-tight gas-diffusion interface | Design gap | Sketch cutout, gasket, electrode stack and collector; test water-only coupon at working liquid head | S05/N01, L01 |
| U06 | Graphite/cloth material, catalyst, glue, wetting, contact resistance, actual exposed area | Missing | Record suppliers/composition and dimensions; test collector continuity | N01/S05 |
| U07 | Historical load, range, polarity, paired V/I, timing, replicates and reference electrode | Missing | Recover protocol or begin new explicitly loaded readings | N01/S06/S07 |
| U08 | Date, volume, media composition, pH, temperature and strain identity | Missing | Treat archive as exploratory; record each future run | N01 |
| U09 | Copper/aluminium wet collectors could contribute electrochemical artefacts | Untested confound | Record material/immersion, keep connectors dry, include abiotic comparator | S05 |
| U10 | Hermetic assembly and air openings; gas bladder/valve pressure and gas identity | Unresolved design | First prototype uses a vented conceptual outlet. No pressure rating or gas composition assumed; pressure collection is deferred | S05/N01 |
| U11 | More submerged cathodes act like air cathodes simply by electrical connection | Untested | Verify electron acceptor access; do not count them as air-active area | N01 |
| U12 | Nutrients, growth, gas or voltage imply improved electron transfer | Unsupported inference | Fix circuit/geometry; compare loaded power and independent controls; mechanism needs further evidence | N01/D01/D02/A01 |

## First experimental priorities

1. Measurement/contact check: fixed assembly, verified resistor, voltage across that resistor, stable connections and recorded polarity. Record pressure/contact deviations rather than treating them as biological responses.
2. Cathode water test: verify leak containment and wet/air interface before inoculation; a vented bottle and accessible removable patch are provisional engineering choices.
3. Baseline active/abiotic comparison with identical media and electrode materials; at least three independent units per condition if feasible. Repeated readings of one unit are not independent replicates. Keep chemical/redox and material confounds visible.
4. After baseline repeatability, change one variable (such as electrode distance or separator arrangement), retaining all other settings and the same electrical load/time window. Any selection/evolution experiment follows a reproducible baseline and parallel control lines.

## Application architecture

Local Vite/React SPA and Three.js renderer. Pure SI geometry/electrical modules in src/domain; immutable historical datasets and source facts in src/data.js; separate local persistence and CSV/JSON conversion. The rendering layer consumes geometry and never supplies biological output. New experiment records snapshot the configuration and preserve missing values as null. Browser local storage is the first-version database, with JSON backup/restore and CSV export; clearing browser storage removes working records. Original sources remain filesystem files. A later SQLite/IndexedDB migration, richer literature manager, polarization protocol and uncertainty propagation can build on these interfaces.

The first model uses a cylinder, frustum shoulder and cylinder neck. Base/cap and ring seals are conceptual. Electrode area is geometric, not electrochemically active or microscopic area. Liquid volume subtracts immersed graphite cores; cloth, collectors and irregular bottle-base displacement remain unmodelled. Every default dimension is provisional, except selected rod dimensions labelled source-reported rather than independently measured. Calculations require visible equations and meaningful tests for partial fills, displacement, units, load validity and missing-data conversion.
