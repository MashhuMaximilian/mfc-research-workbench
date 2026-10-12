---
name: MFC Research Workbench
description: A local research workspace for reactor geometry, observations and traceable evidence.
colors:
  forest: '#173d3c'
  teal: '#286f6a'
  forest-hover: '#245653'
  amber: '#8b5f22'
  amber-bg: '#f7eedb'
  amber-border: '#e8d9b8'
  error-text: '#a03e28'
  basis-provisional: '#836528'
  basis-measured: '#316951'
  basis-reported: '#526f75'
  saved: '#396e55'
  ink: '#233e3b'
  muted: '#536d67'
  paper: '#f5f6f1'
  surface: '#fff'
  line: '#dce4dc'
  action-line: '#c9d7ce'
  action-hover: '#edf2ec'
  action-line-hover: '#99b2a5'
  input-line: '#b9cac0'
  placeholder: '#657b71'
  focus: '#73a99b'
  nav-text: '#c2d8ce'
  nav-hover: '#254e49'
  nav-selected: '#d4e6d5'
  viewer: '#edf2eb'
  tag-bg: '#eff4ed'
  tag-text: '#46644d'
  tag-line: '#d3dfd4'
  segmented-bg: '#f0f4ed'
  segmented-text: '#53705d'
  segmented-active-text: '#204b43'
  segmented-line: '#cddace'
  segmented-hover: '#dfeadd'
  icon-text: '#62806d'
  icon-selected-bg: '#e0eadc'
  icon-selected-text: '#275d4f'
  icon-selected-line: '#d0dfc9'
  number-bg: '#fbfdf8'
  number-line: '#c8d6cb'
  number-unit: '#536f5b'
  model-housing: '#b6cdcc'
  model-anode: '#354348'
  model-cathode: '#287d79'
  model-separator: '#c9a15d'
  model-liquid: '#73aebc'
  model-wiring: '#b67546'
typography:
  headline:
    fontFamily: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 30px
    fontWeight: 650
    lineHeight: 1.18
    letterSpacing: -0.025em
  title:
    fontFamily: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 18px
    fontWeight: 650
    letterSpacing: -0.015em
  subheading:
    fontFamily: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 14px
    fontWeight: 650
  body:
    fontFamily: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 14px
    lineHeight: 1.6
  research-body:
    fontFamily: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 12px
    lineHeight: 1.6
  label:
    fontFamily: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 11px
    lineHeight: 1.45
  caption:
    fontFamily: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 11px
    lineHeight: 1.5
  button:
    fontFamily: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 14px
    fontWeight: 550
    lineHeight: 1.25
  navigation:
    fontFamily: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.25
  tag:
    fontFamily: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 10px
    fontWeight: 550
    lineHeight: 1.2
  metric:
    fontFamily: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 24px
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: -0.02em
rounded:
  label: 3px
  tag: 4px
  field: 5px
  control: 6px
  surface: 8px
spacing:
  '4': 4px
  '6': 6px
  '8': 8px
  '12': 12px
  '16': 16px
  '20': 20px
  '24': 24px
  mobile-gutter: 17px
  desktop-gutter: 34px
components:
  button-primary:
    backgroundColor: '{colors.forest}'
    textColor: '{colors.surface}'
    typography: '{typography.button}'
    rounded: '{rounded.control}'
    padding: 9px 13px
  button-primary-hover:
    backgroundColor: '{colors.forest-hover}'
  button-secondary:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    typography: '{typography.button}'
    rounded: '{rounded.control}'
    padding: 9px 13px
  button-secondary-hover:
    backgroundColor: '{colors.action-hover}'
  button-icon:
    backgroundColor: transparent
    textColor: '{colors.icon-text}'
    rounded: '{rounded.control}'
    padding: 7px
  button-icon-selected:
    backgroundColor: '{colors.icon-selected-bg}'
    textColor: '{colors.icon-selected-text}'
  input:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.field}'
    padding: 9px 10px
  navigation-item:
    backgroundColor: transparent
    textColor: '{colors.nav-text}'
    typography: '{typography.navigation}'
    rounded: '{rounded.field}'
    padding: 12px 13px
  navigation-item-hover:
    backgroundColor: '{colors.nav-hover}'
    textColor: '{colors.surface}'
  navigation-item-active:
    backgroundColor: '{colors.nav-selected}'
    textColor: '{colors.forest}'
  tag:
    backgroundColor: '{colors.tag-bg}'
    textColor: '{colors.tag-text}'
    typography: '{typography.tag}'
    rounded: '{rounded.tag}'
    padding: 5px 8px
  tag-amber:
    backgroundColor: '{colors.amber-bg}'
    textColor: '{colors.amber}'
  panel:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.control}'
  reactor-panel:
    backgroundColor: '{colors.viewer}'
    textColor: '{colors.ink}'
    rounded: '{rounded.surface}'
  segmented-control:
    backgroundColor: '{colors.segmented-bg}'
    rounded: '{rounded.control}'
    padding: 3px
  segmented-item:
    backgroundColor: transparent
    textColor: '{colors.segmented-text}'
    rounded: '{rounded.tag}'
    padding: 7px 10px
  segmented-item-active:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.segmented-active-text}'
  dimension-number:
    backgroundColor: '{colors.number-bg}'
    textColor: '{colors.ink}'
    rounded: '{rounded.field}'
  dimension-basis:
    backgroundColor: transparent
    textColor: '{colors.basis-provisional}'
    padding: 0 13px 0 0
    height: 16px
  dimension-basis-measured:
    textColor: '{colors.basis-measured}'
  dimension-basis-reported:
    textColor: '{colors.basis-reported}'
---

# Design System: MFC Research Workbench

## Overview

**Creative North Star: "The Research Workbench"** — provisional description of the implemented system.

A quiet, precise research tool with forest navigation, a pale workspace and white editing surfaces. Compact sans-serif text, fine dividers and modest corners support repeated bench and desk work. Teal identifies interaction and calculation context; amber keeps uncertain inputs and historical limitations visible.

This is a scan of the implemented code, not a user-approved visual identity. The descriptive north star and palette names are provisional documentation language. The optional direction question was unanswered; no approved visual comp or QUALITY BAR card exists. Preserve the implemented system during routine maintenance and seek an explicit direction decision before treating its atmosphere as an approved brand commitment.

Source of truth: src/styles.css and the React components, with the real Three.js scene in src/components/ReactorScene.jsx. The 11 October 2026 desktop, mobile, actual-default, notebook and evidence captures under .impeccable/review were opened for this documentation pass. QA and the bounded ship verdict are recorded separately; neither establishes physical geometry, biological performance or comprehensive accessibility validation.

**Key Characteristics:**

- Compact, readable research hierarchy with tabular numbers.
- Tonal separation and thin dividers rather than elevated cards.
- Visible units, evidence labels and original-source context.
- Responsive editing around a genuine, schematic 3D scene.

## Colors

Muted green neutrals support dense research material; forest anchors the shell, teal marks interaction, and amber identifies uncertainty. Frontmatter values are normative extracted values. Generated tonal ramps in the sidecar are preview metadata, not additional implemented fills.

### Primary

- **Forest** (`forest`): navigation field and primary action fill. **Forest hover** supplies the corresponding action response.
- **Research teal** (`teal`): links, selected section underlines, checkbox and range accents, and input carets. The plot uses its own close teal literal; retain it until a deliberate token consolidation.

### Secondary

- **Uncertainty amber** (`amber`, `amber-bg`, `amber-border`): draft and historical tags, unresolved questions and save attention. Larger warning notices have distinct source literals recorded in their component context.
- **Validation red** (`error-text`): reading-form errors. Validation messages remain textual and use alert semantics.
- **Evidence bases** (`basis-provisional`, `basis-measured`, `basis-reported`): compact select text for unconfirmed, measured and source-reported dimensions. **Saved green** describes successful local persistence only.

### Tertiary

- **Model material roles** (`model-housing`, `model-anode`, `model-cathode`, `model-separator`, `model-liquid`, `model-wiring`): distinguish transparent housing, dark graphite, teal cathode, ochre separator, pale blue liquid and warm wiring. These are schematic material cues, not a measured physical appearance.
- The layer legend intentionally has independent CSS literals except for the cathode; it is not a single exact palette shared with Three.js. Preserve that observed distinction rather than claiming consolidated tokens.

### Neutral

- **Green ink** and **muted ink** (`ink`, `muted`): headings, values and supporting prose.
- **Paper**, **white surface**, **divider** and **viewer field** (`paper`, `surface`, `line`, `viewer`): workspace, editor, boundaries and model stage.
- **Action, input and focus roles**: lightly tinted border/hover states; the shared focus color supplies a visible outline beyond color changes.
- **Navigation selected**: a pale green fill with forest text. Default navigation text remains pale against forest.
- **Tags, segments and dimension inputs**: use their extracted local state roles. Do not substitute a similar neutral without changing the code and this document together.

**The Evidence Label Rule.** Every evidence color travels with a written status. A green tone alone never establishes that a value was measured.

## Typography

**Display and body stack:** Inter, ui-sans-serif, Apple system fallbacks, Segoe UI, sans-serif. The code declares Inter but ships no font file or remote font; the available platform fallback renders when Inter is absent. Equations use the browser's default monospace code face; there is no separately defined mono token.

**Character:** a single utilitarian sans stack and compact sentence-case labels. Size and weight establish hierarchy without decorative display type or an invented scale ratio.

### Hierarchy

- **Headline:** main page titles. At the two small-screen breakpoints they become (27px); the desktop role is in frontmatter.
- **Title / subheading:** section headings and compact component headings. Contextual inspector and result headings use (15px), notebook/readings sections use (16px), and evidence headlines use (24px) with their source-specific line height.
- **Body / research body:** default paragraph role and denser evidence text. Supporting editor and notebook prose commonly uses (11px). Reading widths vary by role, including evidence summary (72ch), facts (65ch) and component help (73ch); there is no global prose-width cap.
- **Label / caption:** compact field labels and supporting descriptions. Provenance and small metadata reach (9–10px) in the current implementation; do not represent this as a verified accessibility minimum.
- **Button / navigation / tag:** their own observed sizes and weights. Active navigation uses weight (650); mobile navigation uses (10px) and icon sizes (14px).
- **Metric:** geometric results, with smaller units (12px desktop, 11px mobile). Metric values, table data, numeric dimension inputs and ranking scores use `font-variant-numeric: tabular-nums`.

**The Unit Rule.** Keep a number next to its unit and preserve tabular numerals for values, tables and comparison scores.

## Layout

The desktop shell uses fixed forest navigation (210px) and a workspace offset by that width. The header is (65px) high. Main content has padding (31px 34px 24px), centers within a maximum width (1700px), and places a flexible viewer beside a fixed inspector (303px) with a gap (19px). The stage is (447px) high; the inspector body is a separate scrolling area (423px). Geometry results sit below in four columns.

### Responsive behavior

| Query | Implemented behavior |
| --- | --- |
| Minimum width 1600px | Inspector becomes 330px; stage 520px; inspector body 496px. |
| Maximum width 1200px | Navigation becomes a 72px icon rail; main gutters 25px; inspector 285px; viewer gap 15px. The secondary interaction hint disappears. |
| Maximum width 850px | Viewer and inspector stack in that order. Stage 485px. Dimension fields use two columns; inspector body becomes automatic with a 500px maximum. Geometry and electrical metrics use two columns. Research aside, facts, uncertainties, comparison and proposal detail stack. |
| Maximum width 600px | Navigation becomes a static top band with visible tab labels. Header 50px; main gutters 17px. Title actions wrap. Backup/Restore hide visible text but retain explicit aria-label names. Stage 400px; dimension and metadata fields use one column. Result values retain two columns. Tables scroll horizontally. |

The sidecar records query thresholds, not a new naming convention or breakpoint framework. Spacing is a collection of observed recurring values and context-specific adjustments, not a strict 8px grid. The narrow viewport also wraps notebook actions, moves source actions below row text, and uses a two-column priority-weight grid with the final control spanning both columns. Evidence photographs remain a two-column comparison even on mobile, with shorter crops. Page section tabs can scroll horizontally.

Screenshot widths denote the requested browser viewport; capture pixel width can differ with browser chrome and scrollbars. The actual-default evidence is the post-reset 1280 viewport, not the obsolete user-1272 capture. These captures support the visible responsive arrangement. The missing mobile accessibility-tree result and browser inventory failure are documented in .impeccable/review/qa.md; do not claim a fresh mobile AX or computed-style pass.

## Elevation & Depth

Panels are flat. Pale field, white surface and thin borders convey grouping; fine horizontal dividers structure lists and tables. The active segmented item alone uses a small CSS shadow (`0 1px 3px #21483814`). There is no modal, floating tooltip or card-elevation vocabulary in this version. Native button titles are browser-managed.

The 3D scene supplies the material depth: transparent housing and liquid, opaque cores, a translucent ground grid and directional lighting. Perspective framing derives from object bounds; a camera reset or view/preset change reframes the scene. Rendering uses sRGB output, ACES filmic tone mapping and the observed material settings in the sidecar. These visual cues do not certify sealing, dimensions or reactor behavior.

**The Flat Surface Rule.** Separate panels with fill and thin borders. The selected segmented item is the only implemented CSS shadow role.

There are no authored CSS duration/easing tokens or automatic entrance effects. Orbit interaction uses damping. Reduced-motion CSS removes transitions and smooth scrolling; it does not disable the Three.js animation loop or damping. Do not claim a reduced-motion 3D behavior that is absent from the implementation.

## Shapes

Corners are modest and role-specific: small overlays, tags, fields, controls, then reactor containers. Their exact values live in frontmatter. The general button radius uses the CSS custom property `--radius`; most other radii are literal CSS values rather than shared variables. Major reactor containers clip their content. Lists and section tabs have square divider edges; circular layer dots are (9px) across. The brand icon has its own (9px) corner radius and is not a general component radius.

Borders are generally (1px). Selected section tabs use a (2px) bottom line. Focus uses a (3px) outline with (3px) offset; the dimension input moves that offset inside to (-3px) because its wrapper clips. Do not replace visible outlines with only border-color changes.

## Components

### Buttons

Compact, explicit actions with a restrained outline and optional line icon. Primary buttons use forest and white; secondary buttons use white, green ink and a fine green border. The defaults are in frontmatter; header buttons use (11px) text and (7px 10px) padding, becoming icon-only on mobile. Hover shifts fill and border. Disabled buttons lower opacity to (0.55) and show a not-allowed cursor. No distinct pointer-active transform or transition is implemented. Icons are Lucide line icons, typically (15–18px), with explicit accessible names for icon-only actions.

### Inputs / Fields

White fields, thin borders and compact corners; labels and helper text remain separate. Native selects, checkboxes, range and date/time inputs retain browser behavior. Checkboxes are (16px) and use teal; range controls also use teal. Textareas resize vertically. The shared focus outline applies to input, select, textarea and summary controls. Placeholder text has its own muted role. Error, disabled and missing states are explained in text; no invented red-field variant exists.

### Dimension editor

A label beside a right-aligned number and persistent unit, followed by a compact evidence select. The default field grid reserves (93px) for the number wrapper; its input is (62px) wide. Provisional, source-reported and measured are different textual states with their own colors. Changing a numeric dimension resets inherited evidence to provisional. Validation rejects invalid configurations, shows an alert, and retains the last valid model. The three inspector tabs are Housing, Electrodes and Layers; selected state is a teal underline and weight (650), backed by aria-selected.

### Chips

Tags communicate status; they are not invented selectable filters. The quiet neutral tag marks calculated/contextual information. Amber tags mark Draft, Historical and Unresolved. Both keep an explicit word label. Source links use an even smaller (3px) corner and compact source ID with an inline external-link icon.

### Cards / Containers

White, thin-bordered editing panels with context-specific padding, no card shadow and a modest corner. Geometry/viewer/inspector containers use the larger surface radius. Notebook metadata and readings panels use the control radius; source, facts and record lists use dividers rather than a card for each row. The canonical card snippet represents the readings panel, with padding (20px 21px). Large warning notices are pale amber with their observed darker text; global save/restore messages appear as a full-width status band above main content.

### Navigation

Forest is the persistent shell. A pale selected fill, darker text and aria-current identify the current page; hover uses a lighter forest with white text. Four entries connect Reactor, Notebook, Evidence and Next experiments. The responsive rail/top-band arrangements are in Layout. Section tabs in Evidence and Configuration use underline selection; they are separate from the filled global navigation. The skip link becomes visible on keyboard focus.

### Segmented controls

A compact pale tray with inset buttons. Selected segments use white, dark teal and the only UI shadow. Hover uses a pale green fill; keyboard focus uses the shared outline. aria-pressed exposes selection for assembly/cutaway/exploded and voltage/current/power switches. Selection is implemented in React; the sidecar snippets only preview the supported visual states.

### Reactor viewer

A real WebGL scene, not a raster mockup. Assembly, cutaway and exploded states share layer controls and component descriptions. Projected HTML dimension labels are noninteractive and tied to world positions; available width and orbit position can change their overlap. The schematic geometry remains labelled provisional, except evidence that the user explicitly marks measured and the selected source-reported rod defaults. The no-WebGL state displays an explanatory banner while dimensions and calculations remain available. Fullscreen lets the stage occupy the remaining height. The component guide provides a textual path to each explanation.

### Notebook table and plot

Tabular values have explicit units and original qualifiers. Unknown current/power use a dash, never a fabricated zero. Archived data shows range bars without implied time or replicate order; new dated series connect only eligible adjacent readings with matching nonblank sample identity and circuit/load. Empty plots and empty tables explain the missing evidence. Form error text is an alert; new planned/recording and historical rows use distinct written tags. Historical content retains its original strings; annotations remain visually separate. On narrow screens tables scroll rather than shrinking every cell.

### Evidence and planning lists

Original images and drawings use restrained crops, captions and source IDs with direct file links. The source register has search and a source-type select; no-match text offers a clear next action. Facts and unresolved questions use divider lists, source links and quiet resolution blocks. Proposal ranking selects a pale green row beside a white detail panel; range weights and provisional scores update it. These are observed component patterns, not a mandate that every future page copy the current surface composition.

## Do's and Don'ts

### Do:

- **Do** reuse the extracted forest, teal, neutral and amber roles with their textual meanings.
- **Do** retain the shared focus outline and stable accessible names when visible button text is hidden.
- **Do** keep units, qualifiers, provenance and assumptions beside readings and computed values.
- **Do** follow the implemented breakpoint behavior and keep the viewer before the inspector on small screens.
- **Do** preserve original photographs and drawings with captions, source IDs and a route to the original file.

### Don't:

- **Don't** label this provisional visual direction as user-approved.
- **Don't** turn the schematic reactor into a performance forecast or a manufacturing drawing.
- **Don't** make historical ranges, missing values or disconnected samples look like a continuous measured series.
- **Don't** replace fine dividers and tonal fills with an invented shadow or motion system during routine maintenance.
- **Don't** infer an 8px-only spacing grid, a bundled Inter font or pixel-identical 3D and layer-legend colors.
