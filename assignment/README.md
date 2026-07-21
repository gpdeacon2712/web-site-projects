# GRC & AI Governance Control Hub — academic prototype

Masters-level prototype for module 55-709700 (Web Technologies). All data is
fictional/synthetic; no confidential organisational information is used.

> Scaffold created with AI assistance (Claude, Anthropic): file structure,
> page skeletons, starter stylesheet, sample datasets and the dashboard
> render example. All subsequent development by [YOUR NAME]. Cite this in
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
4. Commit and push as you work — the live site updates automatically, and
   the repo history is useful evidence that the work is yours.

## What's done vs. what's yours

Working now:
- All five pages, semantic structure, navigation (with mobile toggle)
- Mobile-first stylesheet (`css/styles.css`)
- Synthetic datasets (`data/*.json`)
- Dashboard metric cards — the worked fetch/render example (`js/dashboard.js`)
- Control library table render (`js/controls.js`)

TODO (yours — each is marked `TODO (student)` in the code):
- [ ] Control library filtering (`js/controls.js`)
- [ ] Risk register table render (`js/risks.js`, Part 1)
- [ ] CVE + EPSS chained API lookup (`js/risks.js`, Part 2) ← biggest marks
- [ ] AI form: slider `<output>` sync, custom validation, add-to-list (`js/ai-register.js`)
- [ ] Profile form submit handling (create `js/profile.js`)
- [ ] Animate the mobile menu (`js/main.js` + CSS)
- [ ] A logo (e.g. looka.com) in the header
- [ ] Accessibility audit (WAVE / Lighthouse) — screenshot the results as evidence
- [ ] Test the CIRCL and EPSS APIs from the deployed site EARLY; fall back to
      the module's freetestapi if blocked

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
1. Landmarks + heading order — WCAG 1.3.1
2. Status never colour-alone (badges) — WCAG 1.4.1
3. Visible focus (`:focus-visible`) — WCAG 2.4.7
4. `aria-live` result regions — WCAG 4.1.3
5. Labels/fieldsets on all inputs — WCAG 1.3.1 / 3.3.2
6. `prefers-reduced-motion` — WCAG 2.3.3
7. `aria-expanded`/`aria-current` on nav — WCAG 4.1.2

### Citations log
Record every snippet/idea taken from Stack Overflow, MDN, blogs, or AI —
add a comment at the point of use AND list it here.
