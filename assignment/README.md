## Version 23.3

- Strengthened the three Governance Support contact cards with page-relevant SVG artwork, clearer icons, bolder headings and visually separated response targets.
- Added spacing below the contact-card grid so the fictional-content note is no longer obscured.
- Reduced the white header fade across all six pages to make the circuit, neural and mesh artwork more visible while retaining readable text contrast.

# GRC & AI Governance Control Hub — Version 23.3

## Version 23.3 visible feature-artwork refinement

Version 23.3 builds on the Version 21 API, accessibility and print enhancements. It retains the compact operational headers introduced in Version 20 while subtly reusing the earlier SVG banner artwork: circuit graphics support the Dashboard and Risk Register, neural artwork supports the AI Register, and mesh artwork supports Controls, Support and Profile. Layered translucent gradients preserve text contrast and information density without restoring the oversized hero banners. All Version 21 CVE, validation, print and CVE-to-risk functionality remains intact.
 Version 23.3 strengthens the selected dashboard and CVE-panel artwork by adding a coloured base layer, reducing the white fade on the right side and increasing the artwork footprint. The Relationship Health, Framework Coverage, Upcoming AI Reviews, Governance Insight and CVE lookup panels now show the circuit, neural or mesh graphics clearly while retaining a light reading area on the left.


### Run locally

Serve the folder over HTTP rather than opening files directly, for example with VS Code Live Server or `python -m http.server`. The JSON datasets are loaded with `fetch()`.

---

# GRC & AI Governance Control Hub

## Revision v18 — relationship health and upcoming reviews

- [x] Added a live Relationship Health widget linking AI use cases, identified risks, governance controls and risk-control coverage.
- [x] Made each relationship node link to its corresponding register.
- [x] Added an Upcoming AI Reviews widget using review dates already held in the AI register.
- [x] Sorted review entries chronologically and identified overdue, due-today and forthcoming reviews.
- [x] Linked each upcoming review directly to its AI use-case record.
- [x] Retained the existing live Framework Coverage widget from Version 17.
- [x] Added responsive layouts so both widgets remain readable on smaller screens.
- [x] Kept all widget totals data-driven; no governance totals are hard-coded.

# GRC & AI Governance Control Hub — academic prototype

Masters-level prototype for module 55-709700 (Web Technologies). All data is
fictional/synthetic; no confidential organisational information is used.

> Scaffold created with AI assistance (Claude, Anthropic): file structure,
> page skeletons, starter stylesheet, sample datasets and the dashboard
> render example. Subsequent extension and completion by Graham Deacon, with AI-assisted coding support documented below. Cite this in
> line with the assignment brief and SHU academic integrity policy.

## Version 17 — AI-specific risks, framework coverage and clickable relationships

- [x] Added five explicit AI-governance risks covering data leakage, bias, inaccurate output, model drift and over-reliance on automation.
- [x] Added `riskIds` to every baseline AI use case, creating an AI use case → risk → control chain.
- [x] Added automatic AI-risk recommendations for newly registered browser-local use cases.
- [x] Updated reciprocal control-to-risk mappings for the new AI risks.
- [x] Displayed AI-specific risks on each AI use-case card.
- [x] Added a live framework coverage widget to the dashboard showing mapped and implemented controls per framework.
- [x] Made risk-control and AI-risk/control relationships clickable across registers.
- [x] Added hash-based scrolling and temporary visual highlighting of the selected record.
- [x] Extended AI register CSV export with AI-specific risk IDs.

The clickable relationship change is intentionally lightweight: it reuses the existing IDs and linked datasets rather than introducing a modal or side-drawer component. This keeps the implementation explainable and avoids unnecessary interaction complexity.


## Run locally

`fetch()` cannot read local JSON over `file://`, so serve the folder:

```
cd grc-hub
python3 -m http.server 8000      # or: npx serve
```

Then open http://localhost:8000

## Deploy to GitHub Pages (do this in hour one)

1. Create a public GitHub repo and push this folder's contents to its root.
2. Repo → Settings → Pages → Source: "Deploy from a branch" → `main`, `/ (root)`.
3. Your public URL appears within a couple of minutes:
   `https://<username>.github.io/<repo>/`
4. Commit and push as you work - the live site updates automatically, and
   the repo history is useful evidence that the work is yours.




## Revision v16 — scrollable registers and sticky headings

- [x] Added bounded, internally scrollable panels for the Risk Register and Control Library on larger screens.
- [x] Added a bounded scrolling panel for registered AI use cases.
- [x] Kept the overall page on natural document scrolling rather than fixing the whole page height.
- [x] Added sticky table headings so column labels remain visible while risk and control rows are reviewed.
- [x] Preserved horizontal scrolling for wide register tables without compressing their content into unreadable columns.
- [x] Added keyboard-focusable regions, visible focus styling and short instructions for assistive-technology and keyboard users.
- [x] Removed fixed vertical limits on narrow screens to avoid nested-scroll and touch-navigation problems.
- [x] Kept filtering, CSV export, local persistence and dynamic rendering unchanged.

## Revision v15 — icons, dashboard accents and rotating insight banner

- [x] Added Bootstrap Icons as one consistent icon system across every navigation menu.
- [x] Added icons to all live dashboard metric cards and labelled the metrics area as Dashboard Analytics.
- [x] Replaced the plain dashboard starting links with five responsive module cards.
- [x] Added subtle module accents: red for risks, green for controls, purple for AI, blue for CVE lookup and teal for Governance Support.
- [x] Added an accessible rotating GRC Insight banner using live dataset values rather than hard-coded totals.
- [x] Added previous, next and pause/resume controls to the banner.
- [x] Disabled automatic rotation when the user prefers reduced motion.
- [x] Kept icon meaning supplementary: navigation and controls retain visible text or accessible labels.

## Revision v14 — Governance Support Centre

Completed in revision v14 (AI-assisted — record in the citations log):

- [x] Added a Governance Support Centre page and included it in the shared navigation on every page.
- [x] Added a governance request form covering risk reporting, control review, AI governance, vulnerability, compliance, training, technical and feedback requests.
- [x] Added requester, department, priority, related-record, subject and message fields with native HTML validation.
- [x] Added a required confirmation that only fictional or non-sensitive information has been entered.
- [x] Added a live message character counter and accessible status feedback.
- [x] Added browser-local request persistence using `localStorage`, with graceful fallback if storage is unavailable.
- [x] Added sequential support identifiers (`SUP-001`, `SUP-002`, etc.).
- [x] Added a saved-request view, CSV export and a confirmation-protected clear function.
- [x] Added contextual query-string prepopulation so other modules can open a relevant support request type and subject.
- [x] Added support links from the Control Library, Risk Register and AI Use-Case Register.
- [x] Added fictional governance contact cards and response targets.
- [x] Added an accessible FAQ section using native `<details>` and `<summary>` elements.
- [x] Added explicit privacy wording confirming that requests are not emailed or transmitted to a central help desk.
- [x] Added responsive styling for notices, support records, contact cards, FAQs and contextual support panels.
- [x] Updated the Dashboard's “Where to start” guidance to include Governance Support.

Important limitation:

- Support requests are stored only in the user's browser. A production service would require authenticated server-side submission, access control, retention rules, encryption and an auditable case-management workflow.



### Version 15.1 correction

- Replaced CDN-dependent navigation and dashboard icons with locally rendered Unicode icons so they appear even when the project is offline.
- Added page-title icons across all six pages.
- Restyled the GRC Insight area as a prominent blue/teal dashboard banner.
- Initialised banner rotation before JSON data loads, so the banner works even when the site is accidentally opened without the local HTTP server.
- Updated the live dashboard messages after metrics load without attaching duplicate event handlers.

## Project status and action list

Completed in this revision (v12, AI-assisted — record in the citations log):
- [x] localStorage persistence for user additions: CVE-imported risks and registered AI use cases now survive refresh; entries are kept in separate storage keys from the baseline JSON so the synthetic dataset is never modified
- [x] "Clear my saved risks / use cases" buttons (shown only when saved entries exist) remove only the user's additions
- [x] Honest storage feedback: success messages say whether the entry was saved to localStorage or is session-only (storage can be unavailable in some private-browsing modes; all storage access is wrapped in try/catch)
- [x] Privacy implications documented (per the enhancement brief): localStorage is per-browser-profile, never transmitted, but visible to anyone sharing the profile — hence the clear buttons; the profile page deliberately remains session-only as a contrast
- [x] CSV downloads: filtered control library (export respects the active filters), full risk register (including Source CVE column), and full AI register — RFC 4180 quoting, UTF-8 BOM for Excel, Blob + createObjectURL, no dependencies

Completed in revision v11 (AI-assisted — record in the citations log):
- [x] Heat map / bubble chart view toggle: buttons whose `aria-pressed` state is both the accessibility announcement AND the CSS styling hook (attribute selector), so the two can never drift apart
- [x] CVE lookup now relates API scores to the register: EPSS (an exploitation probability) maps to the likelihood axis (≥50% → 5, ≥10% → 4, ≥1% → 3, ≥0.1% → 2, else 1); CVSS base severity maps to the impact axis via the standard CVSS v3 bands (Critical → 5, High → 4, Medium → 3, Low → 2); missing scores default to 3 and the default is stated, never silent
- [x] "Add to risk register" button on each lookup result: creates an in-memory risk with the suggested placement; the register table, heat map and bubble chart all re-render live; duplicate lookups show "Already on the register as RSK-nnn"
- [x] Every suggestion carries a stated caveat: EPSS does not know whether the asset is exposed, and CVSS measures technical severity, not business impact in context — the mapping is a decision aid, not a decision

Completed in revision v10 (AI-assisted — record in the citations log):
- [x] Risks extended with 1–5 likelihood and impact scores (score = likelihood × impact; bands: 15+ high, 8–12 medium, ≤6 low — products of two 1–5 integers never fall between bands); register table now shows both columns
- [x] Risk heat map: 5×5 matrix built as a real `<table>` (caption, scoped row/column headers) — semantically correct for a matrix and accessible by default; occupied cells list risk IDs, band colour is always duplicated by text/position (WCAG 1.4.1)
- [x] Risk bubble chart: dependency-free SVG generated by JS; bubble position = likelihood/impact, bubble area (not radius) scales with risk count; hover tooltips list the risks; SVG is aria-hidden with the heat-map table as its accessible equivalent — a strong Assessment 3 talking point (alternatives rejected: chart library = heavyweight dependency; div-grid heat map = loses table semantics)

Completed in revision v9 (AI-assisted):
- [x] Documented the actual CIRCL rate-limit policy (from https://cve.circl.lu/.well-known/api-policy.json): 20 anonymous requests/minute, keyed by IP address — on a shared campus/office IP the budget is shared by everyone behind it, which explains 429s after very few personal lookups
- [x] Per-provider, per-session lookup cache: a retry after a 429 only re-calls the provider that failed; repeat lookups of the same CVE make no network requests
- [x] 3-second cooldown on the lookup button to prevent rapid repeat submissions burning the shared rate-limit budget
- [x] 429 messages now include the service's Retry-After value when the browser is allowed to read it (CORS-dependent)

Completed in revision v8 (AI-assisted):
- [x] CVE lookup switched from `Promise.all` to `Promise.allSettled`: the two providers are independent, so a CIRCL failure no longer discards a successful EPSS response (and vice versa) — a partial result card renders with per-provider caveats
- [x] Status-specific error advice: HTTP 429 now explains CIRCL/FIRST rate limiting and advises waiting before retrying, instead of a generic failure message
- [x] Observed during deployed testing: CIRCL's free API rate-limits repeated lookups (HTTP 429) — documented here as a known service limitation

Completed in revision v7 (AI-assisted review pass):
- [x] CVE input pattern made case-insensitive (`cve-…` no longer blocked by built-in validation before JS normalises it)
- [x] `aria-describedby` links the CVE format hint to its input (WCAG 3.3.2)
- [x] EPSS parsing hardened: non-numeric scores now read "Unavailable"/"Not available" instead of "Low"/"NaN%"
- [x] Profile session indicator changed from a `title` tooltip (invisible to keyboard/touch users) to visible header text
- [x] Datasets extended: 19 controls, 11 risks, 7 AI use cases — including a Rejected use case so all three approval badges render, and cross-references from risk treatments to control IDs

Completed in earlier revisions:
- [x] All five pages, semantic structure and responsive navigation
- [x] Animated mobile menu with `aria-expanded` synchronisation and reduced-motion support
- [x] Mobile-first stylesheet and supplied SVG brand/logo assets
- [x] Synthetic JSON datasets and dashboard metric rendering
- [x] Control library rendering, combined text/framework/status filtering and no-results state
- [x] Risk register rendering with accessible text-labelled rating badges
- [x] Chained CIRCL CVE and FIRST EPSS lookup, error handling and combined meaningful output
- [x] AI register slider synchronisation, JSON pre-population, domain validation, duplicate check and add-to-list workflow
- [x] Profile form submit handling and session-only confirmation
- [x] Dynamic minimum review date rather than a hard-coded date

Still to complete manually before submission:
- [ ] Deploy to GitHub Pages and confirm every page and local JSON request works
- [ ] Test CIRCL and FIRST EPSS from the deployed HTTPS origin; document any CORS/service limitations
- [ ] Run WAVE and Lighthouse accessibility checks, fix material findings and capture screenshots as evidence
- [ ] Validate all HTML and CSS using W3C validators and retain evidence
- [ ] Test keyboard-only operation, mobile widths and at least two browsers
- [ ] Complete the citations/development log with the exact AI contribution and any external sources used
- [ ] Capture version-control evidence and representative screenshots for the assessment report
- [ ] Review code comments and rewrite any explanation you cannot personally defend in the presentation/evaluation

Optional enhancements, not required for a complete working prototype:
- [ ] Sortable control-library columns
- [x] Add a looked-up CVE directly to the browser-persisted risk register (done in v11/v12)
- [x] Persist session entries with `sessionStorage` or `localStorage` (explain privacy implications) — done in v12
- [ ] Add framework maturity visualisations to the dashboard (risk heat map + bubble chart now done on the risks page)

## Rubric map (Assessment 2)

| Criterion | Where it lives |
|---|---|
| HTML quality (20%) | Semantic landmarks, tables with caption/scope, links/lists on every page |
| CSS quality (20%) | External mobile-first stylesheet; element/class/ID/pseudo-class/attribute selectors (all labelled in comments) |
| HTML Forms (15%) | ai-register.html (8+ element types), my-profile.html, filter + lookup forms |
| JavaScript (15%) | External files; menu, filtering, validation, fetch/render |
| API (15%) | CVE Search + EPSS chained (two providers), driven by form input; JSON files simulate enterprise APIs |
| UI/UX/Accessibility (15%) | Focus styles, aria-current/live, fieldset/legend, contrast, reduced motion, audit evidence |

## Assessment 3 notes — fill in AS YOU BUILD

For each item record: what, why, the alternative you rejected, and where
it is in the code. This file becomes your evaluation's raw material.

### CSS elements (pick 5)
1. Custom properties (`:root` tokens) — alternative: repeated hex values / Sass —
2. Mobile-first media queries — alternative: desktop-first max-width —
3. Attribute selector `a[aria-current="page"]` — alternative: a `.active` class —
4. `:nth-child` zebra striping — alternative: hard-coded row classes —
5. Grid `card-grid` — alternative: flexbox / floats —
6. `:user-invalid` — alternative: `:invalid` (fires too early) / JS-only —

### Form elements (pick 5)
1. `<datalist>` (tool name) — alternative: `<select>` —
2. `type="email"` + required — alternative: text + pattern —
3. Radios in `<fieldset>`/`<legend>` (data category) — alternative: select —
4. Checkboxes (oversight) — alternative: multi-select —
5. `type="date"` + min — alternative: text + JS parsing —
6. `range` + `<output>` (risk rating) — alternative: number input —
7. `<select multiple>` (framework alignment) — alternative: checkboxes
   (compare directly with the oversight checkboxes above: visibility vs
   space vs discoverability of Ctrl/Cmd-click) —

### Overview talking point
The hub maps security frameworks (ISO 27001, NIST CSF, NIST SP 800-82,
IEC 62443) AND AI governance frameworks (ISO/IEC 42001:2023, NIST AI RMF)
in one portal — controls CTL-010–012 and each AI use case's
frameworkAlignment field demonstrate this.

### Accessibility examples (pick 5, cite WCAG 2.1/2.2)
1. Landmarks + heading order - WCAG 1.3.1
2. Status never colour-alone (badges) - WCAG 1.4.1
3. Visible focus (`:focus-visible`) - WCAG 2.4.7
4. `aria-live` result regions - WCAG 4.1.3
5. Labels/fieldsets on all inputs - WCAG 1.3.1 / 3.3.2
6. `prefers-reduced-motion` - WCAG 2.3.3
7. `aria-expanded`/`aria-current` on nav - WCAG 4.1.2

### Citations log
Record every snippet/idea taken from Stack Overflow, MDN, blogs, or AI -
add a comment at the point of use AND list it here.


## Revision v13 — integrated risk, control and AI governance relationships

Completed in revision v13 (AI-assisted — record in the citations log):
- [x] Added explicit many-to-many risk-to-control mappings using `controlIds` in `data/risks.json` and reciprocal `riskIds` in `data/controls.json`.
- [x] Mapped every baseline risk to one or more credible mitigating controls; mappings now reflect each risk's treatment and governance context.
- [x] Extended the Risk Register with a **Mitigating controls** column showing control ID, name and current implementation status.
- [x] Extended the Control Library with a **Risks mitigated** column showing the related risk IDs and titles.
- [x] Extended Control Library text search so a user can find a control by a linked risk ID or risk title.
- [x] Added `controlIds` to every baseline AI use case and display applicable controls on each use-case card.
- [x] Added rules that automatically recommend controls for newly registered AI use cases based on data category, risk rating, oversight selections and framework alignment.
- [x] Added default vulnerability-management, incident-response and monitoring controls to risks imported from the CVE/EPSS lookup.
- [x] Added linked control IDs to Risk Register, Control Library and AI Register CSV exports.
- [x] Expanded dashboard metrics with mapped-control coverage, unmapped risks, risks with an implemented control and high risks lacking an implemented control.
- [x] Dashboard now includes locally stored user risks and AI use cases when calculating live totals.
- [x] Added concise responsive styling for linked references and control mappings.
- [x] Updated README wording to describe the CVE risk register as browser-persisted rather than only in-memory and corrected revision-heading punctuation.

Relationship model:

```text
Risk (controlIds)  >---<  Control (riskIds)
AI use case (controlIds)  --->  applicable Control(s)
```

The mappings represent intended mitigation and governance coverage. A mapped control does not prove that risk is fully treated: its implementation status and operating effectiveness still require assessment. The prototype therefore reports coverage and status but deliberately does not calculate residual risk automatically.


## Version 23.3 compact image-backed page headers

Version 23.3 retains the compact, task-focused Bootstrap card headers and reintroduces the earlier SVG artwork as a restrained background layer. Each header combines a smaller contextual icon, concise purpose statement, status badges and relevant actions, while a translucent gradient protects readability. The artwork is removed on very small screens to preserve clarity and performance. This approach reuses the project assets without returning to the large decorative banners used in earlier versions.

## Version 23.3 routing correction

The canonical Governance Support and Profile pages are now `governance-support.html` and `my-profile.html`. The original `support.html` and `profile.html` files are retained as compatibility copies so earlier bookmarks and links continue to work. Upload all HTML files from the package to the same GitHub Pages assignment folder.
