# First bottle prototype: test the owner's wall-arc design

Prepared 12 October 2026. This is a proposed engineering and measurement protocol. No reactor has been fabricated or measured by the workbench. The purpose is to discover whether the accessible-material assembly can be made stable and produce interpretable loaded readings; improved biological performance is not assumed.

## Proposed assembly

One 0.5–1 L bottle candidate, graphite leads in a shared hood-filter backing on the inner anode wall, a curved air-cathode cutout on the opposite wall, and two wrapped edge spacers. The owner's cathode target is 40–50% of the circumference and tentative clear anode-lead gap is 5 mm. The model starts at 45%, a provisional midpoint, and retains the source-reported 4 mm × 47 mm rod option until the actual leads are measured. Filter thickness, wall clearance, spacer diameter, cathode mounting and all bottle dimensions remain provisional. Kitchen plastic film, a glue/silicone stick and lemon-soaked then dried coffee paper are the proposed spacer materials, not a verified proton-exchange membrane.

The model shows the cathode filter on the liquid side, with leads mounted at the opening by default. Inside and outside lead positions can also be selected. This cross-section is an explicit reconstruction assumption; a physical seal and liquid/air contact arrangement still need validation. Filter surface area is not added to the conducting electrode area. A large geometric window is not evidence of a proportionately large active cathode.

## 1. Measure and identify before cutting

Record bottle material if labelled, nominal capacity, internal diameter, straight-body height, usable window height, actual graphite diameter/length, filter product/material label, filter thickness, adhesive and stick composition. Photograph the intended layout with a scale for your own notebook. Verify actual working volume with a measured water fill at the intended level; the geometric estimate excludes filter, spacer and collector displacement.

In Reactor choose **Your wall-arc design** and the bottle preset. Edit dimensions and evidence labels. Keep unspecified dimensions provisional. Existing notebook snapshots keep their original flat or curved configuration; switching this draft does not rewrite previous records.

## 2. Dry conductivity and contact check

Materials: the actual leads, filter offcut, planned collector, multimeter and fixed contacts. Keep the assembly dry for the first resistance checks.

Check the meter leads shorted together and disconnected. Record the selected resistance range and both displays. Measure end-to-end resistance of each graphite lead and a fixed-length filter strip at fixed contact spacing. Repeat the contact attachment and record unstable readings rather than averaging them away. Then measure from the planned terminal to each individual graphite lead.

A nonconductive filter can remain a mechanical support if every graphite lead has a reliable connection. Do not count it as an electronically conducting electrode. Wet resistance readings can include ionic conduction through the liquid and do not establish filter electronic conductivity or proton selectivity. Before wetting, check that anode and cathode collectors have no direct electrical short. Keep exposed copper/aluminium collector parts out of the liquid and document any exceptions as potential electrochemical confounds.

## 3. Cathode and spacer water checks

First make a small representative patch/coupon using the intended graphite, backing, adhesive and perimeter seal. Its size is an engineering screening choice, not an optimization result. Test it against water at the planned fill height before cutting a 40–50% window into the bottle.

Leave the headspace vented. Record patch dimensions, liquid height, assembly time, immediate leakage, wetting and photographs. Observe for about 24 hours as a provisional screening duration. If using mass loss, compare with an evaporation reference of similar fill, cover and exposed area; do not attribute every mass change to leakage. Record loosening, delamination, flooding of the air side and loss of mechanical support. A successful water test does not establish oxygen-reduction activity.

For the lemon-treated paper, rewet a small sample separately and compare with untreated paper and a water blank. Record treatment details, durability and pH if a suitable meter is available. Acid release, transport and long-term stability are unknown. This screening does not demonstrate a PEM. If pH cannot be measured, leave it unknown and retain the treatment as a possible confound.

If the patch leaks or floods, change the interface and repeat the same water test. Once it works, test the complete bottle assembly at its intended working level. The first milestone is a stable, leak-tested reactor.

## 4. Initial electrical/biological baseline

After the physical and contact checks, create a new notebook record with the actual configuration. Record the exact inoculum source, feedstock recipe and quantities, volume, preparation, load, meter/range, polarity, pH and temperature where measured. Use your documented starting materials; this protocol does not invent a new feed recipe or strain identity.

Use one verified external resistor; **1,000 Ω is a proposed starting load, not a demonstrated optimum**. Connect it between the terminals and measure DC voltage across that same resistor. Record resistance and voltage in the workbench's Ω and mV fields. If measuring OCV separately, choose OCV and do not use it to calculate power. Do not combine OCV with a separately measured short-circuit current. For resistor-loaded DC readings, I = V/R and P = V²/R, using V in volts internally.

Declare a repeatable measurement schedule and equilibration procedure before starting. Record timestamps and the same nonblank sample/condition ID for repeat readings of the same unit, configuration and load. A change in load or sample gets a new ID. Record pressing, handling, wetting, mould and connection changes as deviations.

For an initial biological comparison, use the same medium and materials in a **no-added-inoculum comparator**, keeping the treated spacers, load, volume, age and handling matched. This comparator is not automatically sterile or truly abiotic. Three independent reactors per condition would be a useful initial replication target if feasible; repeated readings from one bottle are not independent replicates. With only one bottle, start a baseline/pilot record and make no comparative or mechanistic claim.

The milestone is repeatable loaded output and documented uncertainty. Voltage, growth, gas and sugar consumption alone do not establish extracellular electron transfer. After a stable baseline, change one variable per comparison: e.g. anode spacing or filter backing, with the same load and measurement window. Test lemon-paper treatment as its own controlled variable rather than changing it together with feedstock and geometry.

## Source basis

- Owner's [design clarification](design-clarification-2026-10-12.md): proposed geometry and household materials.
- [Penn State / Logan lab construction guidance](https://sites.psu.edu/microbialfuelcells/make-one/): air-cathode configurations and water-retaining diffusion layers. This does not validate a hood filter or this particular stack.
- [Christgen et al. (2015)](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0136108): experimental membrane/separator trade-offs; no full membrane is required in every single-chamber design.
- [Logan et al. (2006)](https://doi.org/10.1021/es0605016): measurement and reporting framework. The load, duration and replication targets above are proposed choices, not universal recommendations or reported results.
