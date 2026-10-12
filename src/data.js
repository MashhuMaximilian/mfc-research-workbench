import { sourceAsset, localArchiveAvailable } from "./assets.js";
const notion = "https://app.notion.com/p/10bed8479ccd806fb98ae2aaac0ad190";
export const sources = [
  {
    id: "C01",
    title: "Owner's wall-arc design clarification · 12 Oct 2026",
    type: "Document",
    status: "Design proposal",
    url: "/sources/design-clarification-2026-10-12.md",
    summary: "Opposing curved electrode regions, hood-filter backing, 40–50% circumference cathode, tentative 5 mm clear anode-lead spacing and two wrapped edge spacers. No measured performance or validated PEM is implied.",
  },
  {
    id: "S01",
    title: "Electrode frame · perspective",
    type: "Image",
    status: "Observed geometry",
    url: "/sources/S01-frame-perspective.jpg",
    summary:
      "Split rectangular frame with rod seats. Screenshot only; no CAD file or scale supplied.",
  },
  {
    id: "S02",
    title: "Clear bottle · neck and shoulder",
    type: "Image",
    status: "Observed geometry",
    url: "/sources/S02-clear-bottle.jpg",
    summary:
      "Candidate bottle with tapered shoulder and narrow neck. Dimensions, capacity and polymer are unmeasured.",
  },
  {
    id: "S03",
    title: "White bottle · screw cap",
    type: "Image",
    status: "Observed geometry",
    url: "/sources/S03-white-bottle.jpg",
    summary:
      "Alternative straight-body housing with dispensing spout. Capacity and internal dimensions unknown.",
  },
  {
    id: "S04",
    title: "Clear bottle · removable base",
    type: "Image",
    status: "Observed geometry",
    url: "/sources/S04-removable-base.jpg",
    summary:
      "Base removed in photo. Attachment, gasket and leakage performance require inspection.",
  },
  {
    id: "S05",
    title: "Single-chamber reactor drawing",
    type: "Drawing",
    status: "Design proposal",
    url: "/sources/S05-reactor-drawing.jpg",
    summary:
      "Three-part housing, graphite/cloth electrodes, air openings, separator around silicone, and metal connection strip. No dimensioned drawing.",
  },
  {
    id: "S06",
    title: "Micro-scale test · negative display",
    type: "Image",
    status: "Unresolved reading",
    url: "/sources/S06-meter-negative.jpg",
    summary:
      "Display appears “-.013”. Unit, range, circuit and sample mapping are unresolved; no SI conversion.",
  },
  {
    id: "S07",
    title: "Micro-scale test · positive display",
    type: "Image",
    status: "Unresolved reading",
    url: "/sources/S07-meter-positive.jpg",
    summary:
      "Display appears “02.6”. Preserve the photograph; do not infer voltage, current or power.",
  },
  {
    id: "S08",
    title: "Electrode frame · side view",
    type: "Image",
    status: "Observed geometry",
    url: "/sources/S08-frame-side.jpg",
    summary:
      "Split assembly screenshot with repeated rod seats. Dimensions cannot be recovered from perspective alone.",
  },
  {
    id: "N01",
    title: "Mfc · design and test notes",
    type: "Notion",
    status: "Mixed evidence",
    url: notion,
    local: "/sources/notion-mfc.json",
    summary:
      "Design ideas, rod inventory, two exploratory result tables and AI advice. Original qualifiers preserved. Last edit returned: 12 July 2025.",
  },
  {
    id: "N02",
    title: "MFC Designs phd · project index",
    type: "Notion",
    status: "Research index",
    url: "https://app.notion.com/p/1c3ed8479ccd80cab356fde82be0a26a",
    local: "/sources/notion-phd.json",
    summary:
      "Links the design, feasibility proposal, research path and AI conversation. Omitted embedded blocks resolved through browser inspection.",
  },
  {
    id: "D01",
    title: "MFC Feasibility Study Proposal",
    type: "Document",
    status: "Unverified synthesis",
    url: "https://docs.google.com/document/d/1kFcvvuV4TxyvVo2trvn0ZqL_UknP51qeTk-u56dnboo/edit",
    local: "/sources/feasibility-study.md",
    summary:
      "Broad small-scale, soil and septic concepts. Claims of novelty and membrane viability are not established. Some vitamin-C references concern unrelated biology.",
  },
  {
    id: "D02",
    title: "MFC Research Path",
    type: "Document",
    status: "Future proposals",
    url: "https://docs.google.com/document/d/1jIGF1lnuq7IAjyB_MYkOBD3KsWPvIEyyzSLvUcj1vAE/edit",
    local: "/sources/research-path.md",
    summary:
      "Eight possible paper topics and cross-cutting analyses. These are proposed directions, not demonstrated results or guaranteed publications.",
  },
  {
    id: "A01",
    title: "Grok · versatility and scalability",
    type: "AI conversation",
    status: "Arithmetic corrected",
    url: "https://grok.com/share/bGVnYWN5_0456eb16-fecf-45b3-8bd3-daafc1240eb9",
    local: "/sources/grok-audit.md",
    summary:
      "Small-scale table inflates its own 0.012–0.12 Wh/day calculation to 1–50 Wh/day without evidence. Neither is a measured reactor output.",
  },
  {
    id: "L01",
    title: "Air-cathode MFC with and without a PEM",
    type: "Research article",
    status: "Published experiment",
    url: "https://doi.org/10.1021/es0499344",
    summary:
      "Liu & Logan (2004). Tests membrane presence in its particular air-cathode system. Different cultures and cathodes limit transfer to this bottle.",
  },
  {
    id: "L02",
    title: "Cation transport, pH and MFC performance",
    type: "Research article",
    status: "Published experiment",
    url: "https://doi.org/10.1021/es060387r",
    summary:
      "Rozendal et al. (2006). Ion transport and pH are coupled; charge transport need not be proton-only. Does not validate the proposed separator.",
  },
  {
    id: "L03",
    title: "Performance of a yeast-mediated biological fuel cell",
    type: "Research article",
    status: "Published experiment",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2635613/",
    summary:
      "Gunawardena et al. (2008). Tests mediators and catholytes. Its two-compartment arrangement differs from this air-cathode concept.",
  },
  {
    id: "L04",
    title: "Catalytic activity of baker’s yeast in a mediatorless MFC",
    type: "Research article",
    status: "Abstract reviewed",
    url: "https://pubmed.ncbi.nlm.nih.gov/22357359/",
    summary:
      "Sayed et al. (2012). Reports activity associated with anode-adhered yeast in that setup. It does not identify the mechanism in the historical prototype.",
  },
  {
    id: "L05",
    title: "Performance and economics of membranes and separators",
    type: "Research article",
    status: "Published experiment",
    url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0136108",
    summary:
      "Christgen et al. (2015). Compares separator properties and reactor performance. Specific materials and wastewater conditions matter; untreated bag PE is not equivalent to modified membranes.",
  },
  {
    id: "L06",
    title: "Microbial fuel cells: methodology and technology",
    type: "Review",
    status: "Methodology reference",
    url: "https://doi.org/10.1021/es0605016",
    summary:
      "Logan et al. (2006). Starting reference for measurement and explicit power-density denominators. No prediction for this bottle is imported.",
  },
].map((source) => ({
  ...source,
  url: sourceAsset(source.url),
  local: localArchiveAvailable && source.local ? sourceAsset(source.local) : undefined,
}));
export const facts = [
  {
    id: "F13",
    kind: "Design proposal",
    text: "The clarified bottle design places filter-backed graphite regions along opposite wall arcs, with two lateral wrapped spacers and no sheet across the diameter. The 40–50% cathode coverage and 5 mm anode-lead gap are proposed settings, not verified optima.",
    sources: ["C01"],
  },
  {
    id: "F01",
    kind: "Observation",
    text: "Two candidate bottles are shown: a clear necked housing with removable base, and a white dispensing bottle.",
    sources: ["S02", "S03", "S04"],
  },
  {
    id: "F02",
    kind: "Source-reported measurement",
    text: "Nine historical voltage conditions are listed; dates, load and replicate count are absent.",
    sources: ["N01"],
  },
  {
    id: "F03",
    kind: "Source-reported measurement",
    text: "Six further voltage conditions include raw “Amperage (200u)” display values and a mold observation.",
    sources: ["N01"],
  },
  {
    id: "F04",
    kind: "Design proposal",
    text: "Graphite rods wrapped in carbon cloth line the anode; graphite/cloth cathode elements face wall air openings.",
    sources: ["S05", "N01"],
  },
  {
    id: "F05",
    kind: "Untested hypothesis",
    text: "Acid-treated polyethylene / coffee filter / polyethylene is described as a PEM; ion transport and selectivity are unverified.",
    sources: ["S05", "N01", "L02", "L05"],
  },
  {
    id: "F06",
    kind: "Design proposal",
    text: "Silicone supports prevent electrode contact; a copper or aluminium strip joins rods electrically.",
    sources: ["S05", "N01"],
  },
  {
    id: "F07",
    kind: "Unresolved measurement",
    text: "Two photographed multimeter displays are retained as raw image evidence. Units and condition identity remain unknown.",
    sources: ["S06", "S07"],
  },
  {
    id: "F08",
    kind: "Assumption",
    text: "The model approximates the bottle with a cylinder, tapered shoulder and neck. Dimensions, gaskets, contacts and cutout geometry are provisional.",
    sources: ["S02", "S03", "S05"],
  },
  {
    id: "F09",
    kind: "Established principle",
    text: "Loaded power requires voltage and current in the same circuit, or voltage across a known resistor: P = VI; P = V²/R. OCV alone provides no power estimate.",
    sources: ["L06"],
  },
  {
    id: "F10",
    kind: "Research interpretation",
    text: "Pressed readings suggest a contact or mechanical confound to investigate. They do not establish improved electron transfer.",
    sources: ["N01"],
  },
  {
    id: "F11",
    kind: "Correction",
    text: "Old AI small-scale energy table contradicts its arithmetic: 0.5–5 mW for 24 h gives 0.012–0.12 Wh, not 1–50 Wh.",
    sources: ["A01"],
  },
  {
    id: "F12",
    kind: "Source-reported dimensions",
    text: "Notion rod 2: radius 2 mm, height 47 mm. Later frame brief: pencil leads diameter 1.9–2.0 mm. Separate options; availability unconfirmed.",
    sources: ["N01", "S01", "S08"],
  },
];
export const uncertainties = [
  [
    "U01",
    "Bottle geometry",
    "Internal dimensions, wall thickness and fill capacity are missing.",
    "Measure diameter and heights; weigh a water fill at the intended liquid level.",
    "S02, S03, S04",
  ],
  [
    "U02",
    "Radius or diameter?",
    "Rod-2 radius 2 mm conflicts with the later 2 mm diameter lead brief.",
    "Measure actual pieces and assign a material lot; preserve each option.",
    "N01, S01, S08",
  ],
  [
    "U03",
    "Treatment concentration",
    "Drawing says 10% vitamin C; Notion says 1 g / 100 mL (~1% w/v).",
    "Recover the actual formulation and treatment duration.",
    "S05, N01",
  ],
  [
    "U04",
    "Separator function",
    "Ionic transport, permeability, selectivity and durability are untested.",
    "Test continuity and leakage separately. DC resistance alone cannot establish proton conductivity.",
    "N01, L02, L05",
  ],
  [
    "U05",
    "Cathode interface",
    "An air-facing rod bundle does not define a liquid-tight gas-diffusion cathode.",
    "Test a cathode coupon and gasket with water at the planned liquid head.",
    "S05, N01, L01",
  ],
  [
    "U06",
    "Electrode properties",
    "Cloth composition, catalyst, adhesives and contact resistance are unknown.",
    "Record materials and supplier; separate geometric from active surface area.",
    "N01, S05",
  ],
  [
    "U07",
    "Historical circuit",
    "Load, range, paired V/I, polarity and sample mapping are missing.",
    "Recover instrument settings or begin new loaded measurements.",
    "N01, S06, S07",
  ],
  [
    "U08",
    "Historical conditions",
    "Dates, working volume, pH, temperature and independent replicates are absent.",
    "Keep archive exploratory; record full metadata for new runs.",
    "N01",
  ],
  [
    "U09",
    "Metal collector confound",
    "Wetted copper or aluminium could affect electrochemical readings.",
    "Record immersion and material; keep contacts dry and include an abiotic comparator.",
    "S05",
  ],
  [
    "U10",
    "Gas and seals",
    "Hermetic threads, air openings and a gas bladder are unresolved.",
    "Use a vented baseline; no gas identity or pressure rating is assumed.",
    "N01, S05",
  ],
  [
    "U11",
    "Submerged cathodes",
    "Electrical connection does not supply an electron acceptor.",
    "Verify oxygen access before counting an electrode as air-active.",
    "N01",
  ],
  [
    "U12",
    "Biological interpretation",
    "Growth, gas, sugar consumption and voltage are insufficient mechanism evidence.",
    "Compare loaded electrical output, controls and repeatability; defer selection studies.",
    "N01, D01, D02",
  ],
];
const reading = (
  condition,
  rawVoltage,
  voltageV,
  notes = "",
  rawCurrent = null,
  min = null,
  max = null,
) => ({
  id: condition,
  condition,
  rawVoltage,
  voltageV,
  voltageMinV: min,
  voltageMaxV: max,
  rawCurrent,
  currentA: null,
  resistanceOhm: null,
  mode: "unknown",
  timestamp: null,
  pH: null,
  temperatureK: null,
  notes,
  sourceId: "N01",
});
const historicalBase = {
  kind: "archive",
  date: null,
  config: null,
  workingVolumeM3: null,
  electrodes: "Micro-scale frame; geometry and material lot unresolved",
  inoculum: "See condition labels; strain identity unconfirmed",
  feedstock: "Composition and quantity unknown",
  environment: "Temperature and pH not recorded",
  instrument: "Multimeter; range, polarity and circuit unknown",
  controls:
    "Control labels retained; protocol and independent replicate count unknown",
  deviations: "Incomplete historical protocol",
  interpretation:
    "Exploratory source-reported observations; no validated power or biological mechanism.",
};
export const historicalRuns = [
  {
    ...historicalBase,
    id: "ARCH-01",
    title: "Yeast / supplement observations",
    readings: [
      reading("A · control", "75 mV", 0.075),
      reading("A · dextrose", "150 mV", 0.15),
      reading("A · multivitamin", "135 mV", 0.135),
      reading(
        "B Hefe · control",
        "15 mv (50 when pressed)",
        0.015,
        "50 mV when pressed; mechanical change.",
      ),
      reading(
        "B Hefe · dextrose",
        "49 mV (or 9-12)",
        0.049,
        "Alternative 9–12 mV retained; not averaged.",
      ),
      reading(
        "B Hefe · multivitamin",
        "20 mV (up to 50 if pressed?)",
        0.02,
        "Up to 50 mV if pressed? Original uncertainty retained.",
      ),
      reading("C Pill · control", "100 mV", 0.1),
      reading("C Pill · dextrose", "135 mV", 0.135),
      reading("C Pill · multivitamin", "60 mV", 0.06),
    ],
  },
  {
    ...historicalBase,
    id: "ARCH-02",
    title: "Water / dextrose observations",
    deviations: "Dextrose +H2O also grew mold (source observation).",
    readings: [
      reading("Ctrl h20", "175", 0.175, "Table header: Voltage (mV).", "0.2"),
      reading(
        "Dextrose h20",
        "160-250",
        null,
        "Dextrose +H2O reportedly grew mold.",
        "0.3",
        0.16,
        0.25,
      ),
      reading("Ctrl no h20", "111", 0.111, "", "0.1"),
      reading("Dextrose no h2o", "170-180", null, "", "0.2", 0.17, 0.18),
      reading("Ctrl pit", "50", 0.05, "Meaning of “pit” unknown.", "0.1"),
      reading("Dextrose pit", "50", 0.05, "Meaning of “pit” unknown.", "0.1"),
    ],
  },
];
export const proposals = [
  {
    id: "EXP-00",
    title: "Check the hood filter and graphite contacts",
    mechanism: "Stable electronic connections to the graphite are needed; carbon-loaded filter material is not assumed to be an electronic conductor.",
    sources: ["C01", "L06"],
    effect: "Identifies the filter's possible role and contact problems; no biological output is predicted.",
    controls: "Dry samples, fixed contact spacing and force, the same meter/range; record shorted-lead and disconnected-meter displays.",
    protocol: "Measure each graphite lead, a fixed-length filter strip, and terminal-to-each-lead continuity. Repeat contact attachment. If the filter does not conduct, keep it as support and connect every lead. Wet resistance is not proof of filter electronic or proton conductivity.",
    supports: "Repeatable terminal-to-lead connections and a clearly documented conducting or support-only role for the filter.",
    contradicts: "Open or unstable contacts, or inconsistent measurements dominated by probe contact.",
    cost: "Existing meter, leads and filter offcut; actual costs not recorded",
    time: "One bench session",
    scores: {cost: 5, time: 5, feasibility: 5, uncertainty: 5, information: 5},
  },
  {
    id: "EXP-01",
    title: "Establish a measurement baseline",
    mechanism:
      "Stable contacts and a known load separate circuit artefacts from changes in the cell.",
    sources: ["N01", "L06"],
    effect: "More interpretable output; no assumed power increase.",
    controls:
      "Same reactor, resistor, electrodes, sample, polarity and measurement timing.",
    protocol:
      "Verify a resistor value; measure DC voltage across it with fixed dry contacts. Log time, load and contact changes. Compare stable assembly with the observed pressing condition separately.",
    supports:
      "Loaded voltage settles reproducibly; pressure-dependent changes disappear when contact is fixed.",
    contradicts:
      "Large drift or pressure dependence persists, requiring inspection before biological comparisons.",
    cost: "Existing meter + resistor; price not yet recorded",
    time: "One bench session; then stability follow-up",
    scores: {
      cost: 5,
      time: 5,
      feasibility: 5,
      uncertainty: 4,
      information: 5,
    },
  },
  {
    id: "EXP-02",
    title: "Validate the cathode patch with water",
    mechanism:
      "Liquid retention and access to air must coexist at the cathode interface.",
    sources: ["S05", "L01"],
    effect:
      "Tests a necessary engineering condition; no oxygen-reduction performance is predicted.",
    controls: "Same window, stack, gasket, liquid head and duration.",
    protocol:
      "Test a removable patch coupon with water at the planned fill height. Record leakage, wetting and integrity before inoculation. Keep the outlet vented.",
    supports:
      "Patch holds liquid while retaining an identifiable wet side and air side.",
    contradicts: "Leakage, flooding or delamination; redesign the interface.",
    cost: "Bottle, electrode sample, gasket; prices unknown",
    time: "One session plus an overnight observation",
    scores: {
      cost: 4,
      time: 4,
      feasibility: 4,
      uncertainty: 5,
      information: 5,
    },
  },
  {
    id: "EXP-03",
    title: "Compare active and abiotic baselines",
    mechanism:
      "A comparator helps distinguish biological activity from materials and chemical redox effects.",
    sources: ["L03", "L04", "U09"],
    effect:
      "Evidence about a biological contribution, with remaining medium/oxygen confounds.",
    controls:
      "Matched medium, working volume, electrode materials, load, temperature, age and handling; record pH.",
    protocol:
      "After geometry and circuit work, run matched active-yeast and abiotic comparators with independent replicates if feasible. Record preparation and deviations; repeated samples from one reactor are not replicates.",
    supports:
      "A reproducible difference in sustained loaded output across independent units.",
    contradicts:
      "Similar output in both groups, unstable contacts, or changes explained by chemistry.",
    cost: "Matched units + media; availability needs checking",
    time: "Several days; biological establishment time unknown",
    scores: {
      cost: 3,
      time: 2,
      feasibility: 3,
      uncertainty: 5,
      information: 5,
    },
  },
  {
    id: "EXP-04",
    title: "Test electrode separation",
    mechanism:
      "Separation can alter ionic path length, oxygen crossover and transport.",
    sources: ["L01", "L06"],
    effect: "Direction and magnitude depend on the complete system.",
    controls:
      "Same area, materials, load, inoculum, medium, cathode, liquid level and timing.",
    protocol:
      "Only after a stable baseline, compare two feasible distances in independently prepared matched units. Record both loaded output and conditions.",
    supports:
      "Repeatable loaded-power differences with matching denominator and controlled conditions.",
    contradicts:
      "No repeatable difference or a simultaneous change in oxygen access/contact.",
    cost: "Adjustable supports; prices unknown",
    time: "Baseline plus matched comparison runs",
    scores: {
      cost: 4,
      time: 2,
      feasibility: 3,
      uncertainty: 4,
      information: 4,
    },
  },
  {
    id: "EXP-05",
    title: "Characterize separator options",
    mechanism:
      "A spacer, porous separator and ion-selective membrane have different roles.",
    sources: ["N01", "L02", "L05"],
    effect:
      "May trade off resistance, leakage, crossover and durability; acid treatment is unverified.",
    controls:
      "Same test fixture, area, thickness, wetting, electrolyte and duration; untreated blanks.",
    protocol:
      "Begin with water permeability and wet ionic continuity checks of separate coupons. Treat acid formulation as unresolved. More advanced transport characterization needs suitable equipment; do not label DC conductivity proton-selective.",
    supports:
      "Repeatable measured properties meeting the chosen separator role.",
    contradicts:
      "No wet continuity, uncontrolled leakage, degradation or shorting.",
    cost: "Coupons and test fixture; characterization equipment may be unavailable",
    time: "Several sessions and durability follow-up",
    scores: {
      cost: 3,
      time: 2,
      feasibility: 2,
      uncertainty: 5,
      information: 4,
    },
  },
];
export const evidenceLabels = {
  measured: "Measured by you",
  reported: "Source-reported",
  provisional: "Provisional",
};
