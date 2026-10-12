# Bottle design clarification

Source: the owner's follow-up message on 12 October 2026. These are design proposals, not fabricated hardware or measured dimensions. The earlier phase-0 assessment is retained as a historical record.

The intended cathode follows an arc of the bottle wall over a cutout covering roughly 40–50% of its circumference. Graphite leads sit at the opening, either outside or inside its boundary. A spongy kitchen extractor-hood carbon filter backs the leads; the exact liquid-facing layer and air-facing layer still need a cross-section drawing.

The intended anode follows the opposite wall. Graphite leads are inserted into the same kind of carbon filter with a tentative 5 mm gap between leads. This gap is not confirmed as an optimum or a measured dimension. Filter composition, conductivity, lead diameter, collector contact, immersion and actual exposed area remain unknown.

Two wrapped sticks sit at the lateral edges where the anode and cathode regions approach each other. The proposed wrapping is kitchen plastic film and coffee-filter paper soaked in lemon juice and dried. No sheet spans the bottle diameter. These elements are proposed spacers. There is no evidence that this assembly is a proton-exchange membrane; liquid around it remains an ionic transport path. Record the actual stick and adhesive composition rather than assuming a glue stick is silicone.

## Difference from the first application model

The current renderer and cathode-area calculation use a narrow flat panel, and the anode renderer uses individual cloth jackets. They do **not** accurately represent the newly clarified curved, filter-backed regions. The current geometry is useful for provisional chamber-volume exploration, but its cathode window area must not be used as the area of a 40–50% arc. A future revision should add arc coverage, a shared filter backing, two edge spacers, and appropriate area and fit validation. For a cylindrical wall region, geometric arc area would be A = π D f h, where D is diameter, f is the circumference fraction and h is window height. This is not electrochemically active area.

## Engineering questions and first tests

- Identify the filter product and test dry electrical continuity and collector-to-lead contacts. Carbon-loaded foam cannot be assumed equivalent to conductive carbon cloth or felt. Wet two-terminal readings can include conduction through the liquid.
- Draw the cathode cross-section: liquid contact, conducting electrode, air access, liquid-retaining layer and perimeter seal. A porous filter alone does not establish leak containment.
- Test a small replaceable cathode coupon with water at the planned liquid head before cutting a large window. Record leaks, wetting, changes in mass and an evaporation comparison.
- Begin with a mechanically stable spacer arrangement. Acid-treated paper can leach and alter pH; evaluate it later as a separate controlled material variable.
- Establish a fixed-load baseline, with a no-added-inoculum comparator and independent reactor replicates where feasible. A no-added-inoculum comparator is not automatically sterile.

Primary starting sources: [Christgen et al. (2015), separator comparison](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0136108), [Penn State MFC construction guidance](https://sites.psu.edu/microbialfuelcells/make-one/). These support investigating ionic transport and the cathode interface, not a claim that this particular household-material design has been validated or is best.
