# GRC & AI Governance Control Hub — academic prototype

Masters-level prototype for module 55-709700 (Web Technologies). All data is
fictional/synthetic; no confidential organisational information is used.

> Scaffold created with AI assistance (Claude, Anthropic): file structure,
> page skeletons, starter stylesheet, sample datasets and the dashboard
> render example. Subsequent extension and completion by Graham Deacon, with AI-assisted coding support documented below. Cite this in
> line with the assignment brief and SHU academic integrity policy.

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

## Project status and action list

Completed in this revision:
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
- [ ] Add a looked-up CVE directly to the in-memory risk register
- [ ] Persist session entries with `sessionStorage` or `localStorage` (explain privacy implications)
- [ ] Add framework maturity visualisations to the dashboard

## Rubric map (Assessment 2)

| Criterion | Where it lives |
|---|---|
| HTML quality (20%) | Semantic landmarks, tables with caption/scope, links/lists on every page |
| CSS quality (20%) | External mobile-first stylesheet; element/class/ID/pseudo-class/attribute selectors (all labelled in comments) |
| HTML Forms (15%) | ai-register.html (8+ element types), profile.html, filter + lookup forms |
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
