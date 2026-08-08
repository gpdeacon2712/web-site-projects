/* risks.js — Risk Register rendering, visualisations and live CVE/EPSS enrichment.
   The module combines synthetic baseline risks with browser-added records while
   keeping external API guidance clearly separated from governance decisions. */

"use strict";

const RISK_BADGE = {
  High: "badge--risk",
  Medium: "badge--warn",
  Low: "badge--ok",
};

// Baseline risks come from the synthetic JSON; user-added risks (from the
// CVE lookup) persist in localStorage and are merged on load. Keeping the
// two separate means "clear my saved risks" never touches the baseline.
const RISK_STORAGE_KEY = "grc-hub.user-risks";
let baselineRisks = [];
let userRisks = [];
let allRisks = [];
let allControls = [];

function refreshRiskViews() {
  allRisks = [...baselineRisks, ...userRisks];
  renderRiskRows(allRisks);
  renderHeatMap(allRisks);
  renderBubbleChart(allRisks);
  const clearButton = document.getElementById("clear-saved-risks");
  if (clearButton) clearButton.hidden = userRisks.length === 0;
}

/* ---------------------------------------------------------------------------
   Visualisation view toggle. aria-pressed is the single source of truth:
   it informs assistive technology AND drives the CSS attribute selector
   that highlights the active button.
--------------------------------------------------------------------------- */
const viewButtons = document.querySelectorAll(".view-toggle .toggle-button");
viewButtons.forEach(button => {
  button.addEventListener("click", () => {
    viewButtons.forEach(other => {
      const isActive = other === button;
      other.setAttribute("aria-pressed", String(isActive));
      const view = document.getElementById(other.dataset.view);
      if (view) view.hidden = !isActive;
    });
  });
});

function renderRiskRows(risks) {
  const tbody = document.getElementById("risk-rows");
  tbody.replaceChildren();

  for (const risk of risks) {
    const row = document.createElement("tr");
    row.id = risk.id;
    const values = [risk.id, risk.title, risk.category, risk.likelihood, risk.impact];

    values.forEach((value, index) => {
      const cell = document.createElement("td");
      if (index === 0) {
        const ref = document.createElement("span");
        ref.className = "ref-id";
        ref.textContent = value;
        cell.append(ref);
      } else {
        cell.textContent = String(value ?? "—");
      }
      row.append(cell);
    });

    const ratingCell = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = `badge ${RISK_BADGE[risk.rating] || ""}`;
    badge.textContent = risk.rating;
    ratingCell.append(badge);

    const ownerCell = document.createElement("td");
    ownerCell.textContent = risk.owner;
    const treatmentCell = document.createElement("td");
    treatmentCell.textContent = risk.treatment;
    const controlsCell = document.createElement("td");
    const controlLookup = new Map(allControls.map(control => [control.id, control]));
    const mappedControls = risk.controlIds || [];
    if (mappedControls.length === 0) {
      controlsCell.textContent = "No controls mapped";
    } else {
      const list = document.createElement("div");
      list.className = "reference-list";
      mappedControls.forEach(id => {
        const control = controlLookup.get(id);
        const item = document.createElement("a");
        item.className = "linked-reference record-link";
        item.href = `controls.html#${id}`;
        item.textContent = `${id} — ${control?.name || "Unknown control"} (${control?.status || "Status unavailable"})`;
        list.append(item);
      });
      controlsCell.append(list);
    }

    row.append(ratingCell, ownerCell, treatmentCell, controlsCell);
    tbody.append(row);
  }
}

/* ---------------------------------------------------------------------------
   Relating API scores to the register.
   EPSS is an exploitation *probability*, so it maps to the register's
   likelihood axis. CVSS base severity maps to the impact axis using the
   standard CVSS v3 bands (Critical 9.0+, High 7.0+, Medium 4.0+, Low >0).
   Both mappings are heuristics: EPSS says nothing about whether the asset
   is even present, and CVSS measures technical severity, not business
   impact in context — hence the caveat shown with every suggestion.
--------------------------------------------------------------------------- */
function likelihoodFromEpss(score) {
  if (!Number.isFinite(score)) return null;
  if (score >= 0.5) return 5;
  if (score >= 0.1) return 4;
  if (score >= 0.01) return 3;
  if (score >= 0.001) return 2;
  return 1;
}

function impactFromCvss(score) {
  if (!Number.isFinite(score)) return null;
  if (score >= 9) return 5;   // CVSS Critical
  if (score >= 7) return 4;   // CVSS High
  if (score >= 4) return 3;   // CVSS Medium
  if (score > 0) return 2;    // CVSS Low
  return 1;
}

function addRiskFromLookup(cveId, likelihood, impact, button) {
  const nextNumber = Math.max(0, ...allRisks.map(risk => Number(risk.id.replace(/\D/g, "")) || 0)) + 1;
  const risk = {
    id: `RSK-${String(nextNumber).padStart(3, "0")}`,
    title: `Vulnerability exposure: ${cveId}`,
    category: "Technical",
    likelihood,
    impact,
    rating: scoreBand(likelihood * impact).label,
    owner: "IT Operations Lead",
    treatment: "Assess — imported from threat-intelligence lookup; confirm asset exposure before treating",
    cveId,
    controlIds: ["CTL-005", "CTL-007", "CTL-013"],
  };
  userRisks.push(risk);
  const saved = saveStoredList(RISK_STORAGE_KEY, userRisks);
  refreshRiskViews();
  button.disabled = true;
  // The result card is inside an aria-live region, so this status can be
  // announced to screen-reader users. If localStorage is unavailable, the
  // newly added risk remains available only until the page is closed.
  button.textContent = saved
    ? `Added as ${risk.id} (saved in this browser)`
    : `Added as ${risk.id} (this browser session only — storage unavailable)`;
}

// Builds the "suggested register placement" block shown under a lookup
// result. Returns a DocumentFragment to append to the result card.
function buildRegisterSuggestion(cveId, cvssValue, epssScore) {
  const fragment = document.createDocumentFragment();

  const epssLikelihood = likelihoodFromEpss(epssScore);
  const cvssImpact = impactFromCvss(cvssValue);
  // Default to 3 (medium) when a provider gave us nothing, and say so —
  // a silent default would misrepresent the data.
  const likelihood = epssLikelihood ?? 3;
  const impact = cvssImpact ?? 3;
  const band = scoreBand(likelihood * impact);

  const heading = document.createElement("h4");
  heading.textContent = "Suggested register placement";
  fragment.append(heading);

  const explanation = document.createElement("p");
  const likelihoodSource = epssLikelihood === null
    ? "likelihood defaulted to 3 (no EPSS score)"
    : `likelihood ${likelihood} from the EPSS exploitation probability`;
  const impactSource = cvssImpact === null
    ? "impact defaulted to 3 (no CVSS score)"
    : `impact ${impact} from the CVSS base severity band`;
  explanation.textContent = `${likelihoodSource}; ${impactSource}. Score ${likelihood} × ${impact} = ${likelihood * impact} → ${band.label.toLowerCase()} band.`;
  fragment.append(explanation);

  const caveat = document.createElement("p");
  caveat.className = "form-hint";
  caveat.textContent =
    "Heuristic only: EPSS estimates exploitation probability in the wild, not whether this asset is exposed, and CVSS measures technical severity, not business impact in context. Confirm both before relying on the placement.";
  fragment.append(caveat);

  const existing = allRisks.find(risk => risk.cveId === cveId);
  const button = document.createElement("button");
  button.type = "button";
  button.className = "add-risk-button";
  if (existing) {
    button.disabled = true;
    button.textContent = `Already on the register as ${existing.id}`;
  } else {
    button.textContent = `Add ${cveId} to the risk register`;
    button.addEventListener("click", () => addRiskFromLookup(cveId, likelihood, impact, button));
  }
  fragment.append(button);

  return fragment;
}
function scoreBand(score) {
  if (score >= 15) return {label: "High", className: "heat--high", colour: "var(--status-red)"};
  if (score >= 8) return {label: "Medium", className: "heat--medium", colour: "var(--status-amber)"};
  return {label: "Low", className: "heat--low", colour: "var(--status-green)"};
}

// Group risks by their (likelihood, impact) cell. Returns a Map keyed
// "L-I" → array of risks. Risks without numeric scores are skipped.
function groupByCell(risks) {
  const cells = new Map();
  for (const risk of risks) {
    if (!Number.isInteger(risk.likelihood) || !Number.isInteger(risk.impact)) continue;
    const key = `${risk.likelihood}-${risk.impact}`;
    if (!cells.has(key)) cells.set(key, []);
    cells.get(key).push(risk);
  }
  return cells;
}

function renderHeatMap(risks) {
  const container = document.getElementById("risk-heatmap");
  if (!container) return;
  container.replaceChildren();

  const cells = groupByCell(risks);
  const table = document.createElement("table");
  table.className = "heatmap-table";

  const caption = document.createElement("caption");
  caption.textContent = "Risk heat map: rows are likelihood (5 high to 1 low), columns are impact (1 low to 5 high)";
  table.append(caption);

  // Header row: corner cell then impact 1..5
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  const corner = document.createElement("th");
  corner.scope = "col";
  corner.textContent = "Likelihood \\ Impact";
  headRow.append(corner);
  for (let impact = 1; impact <= 5; impact++) {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = String(impact);
    headRow.append(th);
  }
  thead.append(headRow);
  table.append(thead);

  const tbody = document.createElement("tbody");
  for (let likelihood = 5; likelihood >= 1; likelihood--) {
    const row = document.createElement("tr");
    const rowHeader = document.createElement("th");
    rowHeader.scope = "row";
    rowHeader.textContent = String(likelihood);
    row.append(rowHeader);

    for (let impact = 1; impact <= 5; impact++) {
      const td = document.createElement("td");
      const band = scoreBand(likelihood * impact);
      td.className = `heat ${band.className}`;
      const inCell = cells.get(`${likelihood}-${impact}`) || [];
      // Cell text carries the information (WCAG 1.4.1: never colour
      // alone) — risk IDs when present, otherwise just the score.
      td.textContent = inCell.length
        ? inCell.map(risk => risk.id).join(", ")
        : String(likelihood * impact);
      if (inCell.length) {
        td.classList.add("heat--occupied");
        td.title = inCell.map(risk => `${risk.id}: ${risk.title}`).join("; ");
      }
      row.append(td);
    }
    tbody.append(row);
  }
  table.append(tbody);
  container.append(table);

  // Text legend with swatches — the band labels are text, the colour is
  // supplementary.
  const legend = document.createElement("p");
  legend.className = "heat-legend";
  for (const score of [4, 9, 16]) {
    const band = scoreBand(score);
    const swatch = document.createElement("span");
    swatch.className = `heat-swatch ${band.className}`;
    legend.append(swatch, ` ${band.label} `);
  }
  legend.append("(score = likelihood × impact: 15+ high, 8–12 medium, ≤6 low)");
  container.append(legend);
}

// Helper: create a namespaced SVG element with attributes.
function svgElement(name, attributes = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", name);
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, String(value));
  }
  return element;
}

function renderBubbleChart(risks) {
  const container = document.getElementById("risk-bubble");
  if (!container) return;
  container.replaceChildren();

  const cells = groupByCell(risks);
  const width = 520;
  const height = 400;
  const margin = {top: 20, right: 20, bottom: 55, left: 60};
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const xScale = value => margin.left + ((value - 0.5) / 5) * plotWidth;
  const yScale = value => margin.top + plotHeight - ((value - 0.5) / 5) * plotHeight;

  // aria-hidden: the heat-map table is the accessible equivalent, so the
  // SVG is decorative for assistive technology.
  const svg = svgElement("svg", {
    viewBox: `0 0 ${width} ${height}`,
    class: "bubble-chart",
    "aria-hidden": "true",
    focusable: "false",
  });

  // Gridlines and axis tick labels
  for (let value = 1; value <= 5; value++) {
    svg.append(svgElement("line", {
      x1: xScale(value), y1: margin.top, x2: xScale(value), y2: margin.top + plotHeight,
      class: "bubble-grid",
    }));
    svg.append(svgElement("line", {
      x1: margin.left, y1: yScale(value), x2: margin.left + plotWidth, y2: yScale(value),
      class: "bubble-grid",
    }));
    const xTick = svgElement("text", {x: xScale(value), y: margin.top + plotHeight + 22, class: "bubble-tick", "text-anchor": "middle"});
    xTick.textContent = String(value);
    svg.append(xTick);
    const yTick = svgElement("text", {x: margin.left - 12, y: yScale(value) + 4, class: "bubble-tick", "text-anchor": "end"});
    yTick.textContent = String(value);
    svg.append(yTick);
  }

  // Axis titles
  const xTitle = svgElement("text", {x: margin.left + plotWidth / 2, y: height - 12, class: "bubble-axis", "text-anchor": "middle"});
  xTitle.textContent = "Impact →";
  svg.append(xTitle);
  const yTitle = svgElement("text", {
    x: 16, y: margin.top + plotHeight / 2, class: "bubble-axis", "text-anchor": "middle",
    transform: `rotate(-90 16 ${margin.top + plotHeight / 2})`,
  });
  yTitle.textContent = "Likelihood →";
  svg.append(yTitle);

  // Bubbles: one per occupied cell; area (not radius) scales with the
  // number of risks so a 2-risk bubble does not look 4× bigger.
  for (const [key, inCell] of cells) {
    const [likelihood, impact] = key.split("-").map(Number);
    const band = scoreBand(likelihood * impact);
    const radius = 16 * Math.sqrt(inCell.length);

    const group = svgElement("g");
    const circle = svgElement("circle", {
      cx: xScale(impact), cy: yScale(likelihood), r: radius,
      fill: band.colour, "fill-opacity": "0.75", stroke: band.colour, "stroke-width": "2",
    });
    // Native tooltip on hover listing the risks in this bubble
    const tooltip = svgElement("title");
    tooltip.textContent = inCell.map(risk => `${risk.id}: ${risk.title}`).join("; ");
    circle.append(tooltip);
    group.append(circle);

    const label = svgElement("text", {
      x: xScale(impact), y: yScale(likelihood) + 5,
      class: "bubble-count", "text-anchor": "middle",
    });
    label.textContent = String(inCell.length);
    group.append(label);
    svg.append(group);
  }

  container.append(svg);
}

async function initRisks() {
  try {
    [baselineRisks, allControls] = await Promise.all([
      loadJSON("data/risks.json"),
      loadJSON("data/controls.json"),
    ]);
    userRisks = loadStoredList(RISK_STORAGE_KEY);
    refreshRiskViews();
  } catch (error) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 9;
    cell.className = "empty-state";
    cell.textContent = `Risks could not be loaded. Serve the site over http. (${error.message})`;
    row.append(cell);
    document.getElementById("risk-rows").append(row);
  }
}

// Clear only the user's persisted additions; the baseline JSON is untouched.
document.getElementById("clear-saved-risks")?.addEventListener("click", () => {
  userRisks = [];
  clearStoredList(RISK_STORAGE_KEY);
  refreshRiskViews();
});

document.getElementById("download-risks")?.addEventListener("click", () => {
  const rows = [
    ["Risk ID", "Title", "Category", "Likelihood", "Impact", "Rating", "Owner role", "Treatment", "Mitigating controls", "Source CVE"],
    ...allRisks.map(risk => [
      risk.id, risk.title, risk.category, risk.likelihood, risk.impact,
      risk.rating, risk.owner, risk.treatment, (risk.controlIds || []).join("; "), risk.cveId || "",
    ]),
  ];
  downloadCSV("risk-register.csv", rows);
});

function firstEnglishDescription(cve) {
  if (typeof cve.summary === "string") return cve.summary;
  if (typeof cve.details === "string") return cve.details;
  const descriptions = cve.containers?.cna?.descriptions || cve.cve?.descriptions || cve.descriptions;
  if (Array.isArray(descriptions)) {
    return descriptions.find(item => item.lang === "en")?.value || descriptions[0]?.value;
  }
  return "No description was supplied by the vulnerability provider.";
}

function extractCvssValue(cve) {
  const candidates = [
    cve.cvss, cve.cvss3, cve.cvssScore,
    cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore,
    cve.metrics?.cvssMetricV30?.[0]?.cvssData?.baseScore,
    cve.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore,
    cve.cve?.metrics?.cvssMetricV30?.[0]?.cvssData?.baseScore,
    cve.containers?.cna?.metrics?.[0]?.cvssV3_1?.baseScore,
    cve.containers?.cna?.metrics?.[0]?.cvssV3_0?.baseScore,
  ];
  const raw = candidates.find(value => value !== undefined && value !== null && value !== "");
  const score = Number(raw);
  return Number.isFinite(score) ? score : null;
}

function extractCvss(cve) {
  const score = extractCvssValue(cve);
  return score === null ? "Not supplied" : String(score);
}

function addDefinition(container, term, value) {
  const dt = document.createElement("dt");
  dt.textContent = term;
  const dd = document.createElement("dd");
  if (value instanceof Node) dd.append(value);
  else dd.textContent = value;
  container.append(dt, dd);
}

function epssRisk(score) {
  // Number.isFinite also rejects NaN — a malformed provider value must
  // read "Unavailable", not fall through the comparisons to "Low".
  if (score === null || !Number.isFinite(score)) return {label: "Unavailable", className: ""};
  if (score >= 0.5) return {label: "High", className: "badge--risk"};
  if (score >= 0.1) return {label: "Medium", className: "badge--warn"};
  return {label: "Low", className: "badge--ok"};
}

function renderLookupResult(cveId, cve, epssRecord, notes = []) {
  const region = document.getElementById("cve-results");
  region.replaceChildren();

  const article = document.createElement("article");
  article.className = "result-card";
  const heading = document.createElement("h3");
  const ref = document.createElement("span");
  ref.className = "ref-id";
  ref.textContent = cveId;
  heading.append("Threat intelligence for ", ref);

  // cve may be null when CIRCL failed but EPSS succeeded — render what
  // we have rather than discarding a good response (graceful degradation).
  const description = document.createElement("p");
  description.textContent = cve
    ? firstEnglishDescription(cve)
    : "Vulnerability description unavailable — showing exploit-prediction data only.";

  const list = document.createElement("dl");
  list.className = "result-details";
  addDefinition(list, "CVSS base score", cve ? extractCvss(cve) : "Not available");

  const score = epssRecord ? Number(epssRecord.epss) : null;
  const percentile = epssRecord ? Number(epssRecord.percentile) : null;
  // Number.isFinite guards against a record whose fields are missing or
  // non-numeric, which Number() would otherwise turn into NaN ("NaN%").
  addDefinition(list, "EPSS probability", Number.isFinite(score) ? `${(score * 100).toFixed(2)}%` : "Not available");
  addDefinition(list, "EPSS percentile", Number.isFinite(percentile) ? `${(percentile * 100).toFixed(2)}%` : "Not available");

  const assessment = epssRisk(score);
  const assessmentBadge = document.createElement("span");
  assessmentBadge.className = `badge ${assessment.className}`;
  assessmentBadge.textContent = assessment.label;
  addDefinition(list, "Prototype exploitation priority", assessmentBadge);
  if (epssRecord?.date) addDefinition(list, "EPSS score date", epssRecord.date);

  const note = document.createElement("p");
  note.className = "form-hint";
  note.textContent = "EPSS estimates exploitation probability; it does not replace asset context, impact assessment or professional judgement.";

  article.append(heading, description, list);

  // Per-provider caveats (rate limits, missing records) are shown inside
  // the card so a partial result is never mistaken for a complete one.
  for (const noteText of notes) {
    const caveat = document.createElement("p");
    caveat.className = "form-hint error-message";
    caveat.textContent = noteText;
    article.append(caveat);
  }

  // Relate the API scores back to the register: EPSS → likelihood,
  // CVSS → impact, with an add-to-register action.
  article.append(buildRegisterSuggestion(cveId, cve ? extractCvssValue(cve) : null, score));

  article.append(note);
  region.append(article);
}

async function fetchJSON(url, providerName) {
  const response = await fetch(url, {headers: {Accept: "application/json"}});
  if (!response.ok) {
    // Attach the status and provider so the submit handler can give
    // status-specific advice (e.g. HTTP 429 rate limiting) rather than
    // one generic failure message. CIRCL's published API policy sends a
    // Retry-After header on 429s; it is only readable here if the
    // service's CORS config exposes it, so treat it as optional.
    const error = new Error(`${providerName} returned HTTP ${response.status}`);
    error.status = response.status;
    error.provider = providerName;
    error.retryAfter = response.headers.get("Retry-After");
    throw error;
  }
  return response.json();
}

/* Per-provider, per-session cache. CIRCL rate-limits anonymous callers to
   20 requests/minute per IP (per its /.well-known/api-policy.json), and on
   a shared university/office IP that budget is shared by everyone behind
   it. Caching successful responses means a retry after a 429 only re-calls
   the provider that actually failed, and repeated demo lookups of the same
   CVE cost nothing. */
const providerCache = new Map();

async function cachedFetchJSON(cacheKey, url, providerName) {
  if (providerCache.has(cacheKey)) return providerCache.get(cacheKey);
  const value = await fetchJSON(url, providerName);
  providerCache.set(cacheKey, value);
  return value;
}

function friendlyProviderError(error) {
  if (error?.status === 429) {
    const wait = error.retryAfter ? `about ${error.retryAfter} seconds` : "a minute or two";
    return `${error.provider} is rate limiting requests (HTTP 429 Too Many Requests) — the free service allows a limited number of lookups per minute per IP address, so wait ${wait} before retrying`;
  }
  return error?.message || String(error);
}


/* Version 23: populate the CVE input datalist from CIRCL's recent-CVE
   endpoint. The feature is deliberately optional: if the free service is
   unavailable or rate-limited, users can still type any valid CVE ID. */
function extractRecentCveIds(payload) {
  const records = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.results)
        ? payload.results
        : [];

  const ids = records.map(record => {
    if (typeof record === "string") return record;
    return record?.id || record?.cve || record?.cveId || record?.cveMetadata?.cveId || record?.CVE;
  }).filter(value => /^CVE-\d{4}-\d{4,}$/i.test(String(value || "")))
    .map(value => String(value).toUpperCase());

  return [...new Set(ids)].slice(0, 25);
}

async function loadRecentCveSuggestions() {
  const datalist = document.getElementById("recent-cve-options");
  const status = document.getElementById("recent-cve-status");
  if (!datalist || !status) return;

  const cacheKey = "grcRecentCvesV21";
  let ids = [];
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) ids = JSON.parse(cached);
  } catch {
    /* session storage is optional */
  }

  if (!Array.isArray(ids) || ids.length === 0) {
    try {
      const payload = await cachedFetchJSON("CIRCL:recent", "https://cve.circl.lu/api/vulnerability/last/25?light=1", "CIRCL recent CVEs");
      ids = extractRecentCveIds(payload);
      if (ids.length === 0) throw new Error("The service returned no recognisable CVE identifiers");
      try { sessionStorage.setItem(cacheKey, JSON.stringify(ids)); } catch { /* optional */ }
    } catch (error) {
      status.textContent = `Recent CVE suggestions could not be loaded (${friendlyProviderError(error)}). You can still enter a CVE identifier manually.`;
      status.classList.add("error-message");
      return;
    }
  }

  datalist.replaceChildren(...ids.map(id => {
    const option = document.createElement("option");
    option.value = id;
    return option;
  }));
  status.textContent = `${ids.length} recent CVE suggestions are available. Select one or enter another valid identifier.`;
  status.classList.remove("error-message");
}

const lookupForm = document.getElementById("cve-lookup");
lookupForm.addEventListener("submit", async event => {
  event.preventDefault();
  const input = document.getElementById("cve-id");
  const cveId = input.value.trim().toUpperCase();
  input.value = cveId;

  if (!lookupForm.checkValidity()) {
    input.setAttribute("aria-invalid", "true");
    const error = document.getElementById("cve-id-error");
    if (error) {
      error.hidden = false;
      error.textContent = "Enter a CVE identifier in the format CVE-YYYY-NNNN.";
    }
    lookupForm.reportValidity();
    return;
  }

  input.removeAttribute("aria-invalid");
  const inputError = document.getElementById("cve-id-error");
  if (inputError) inputError.hidden = true;

  const submitButton = document.getElementById("cve-submit") || lookupForm.querySelector("button[type='submit']");
  const originalLabel = submitButton.textContent;
  const region = document.getElementById("cve-results");

  submitButton.disabled = true;
  submitButton.textContent = "Looking up…";
  submitButton.setAttribute("aria-disabled", "true");
  region.setAttribute("aria-busy", "true");
  region.textContent = `Looking up ${cveId} across CIRCL and FIRST EPSS…`;

  try {
    // allSettled (not all): the two providers are independent, so one
    // failing must not discard a successful response from the other.
    const [circlResult, epssResult] = await Promise.allSettled([
      cachedFetchJSON(`CIRCL:${cveId}`, `https://cve.circl.lu/api/cve/${encodeURIComponent(cveId)}`, "CIRCL"),
      cachedFetchJSON(`EPSS:${cveId}`, `https://api.first.org/data/v1/epss?cve=${encodeURIComponent(cveId)}`, "FIRST EPSS"),
    ]);

    let cve = null;
    const notes = [];
    if (circlResult.status === "fulfilled") {
      const record = circlResult.value;
      if (record && (record.id || record.cveMetadata || record.cve || record.summary || record.details)) {
        cve = record;
      } else {
        notes.push("CIRCL returned no vulnerability record for that identifier — check that it exists.");
      }
    } else {
      notes.push(`CVE details unavailable: ${friendlyProviderError(circlResult.reason)}.`);
    }

    let epssRecord = null;
    if (epssResult.status === "fulfilled") {
      epssRecord = Array.isArray(epssResult.value.data) ? epssResult.value.data[0] : null;
      if (!epssRecord) notes.push("FIRST EPSS holds no score for that identifier (scores exist only for published CVEs).");
    } else {
      notes.push(`EPSS score unavailable: ${friendlyProviderError(epssResult.reason)}.`);
    }

    if (!cve && !epssRecord) {
      region.replaceChildren();
      const message = document.createElement("p");
      message.className = "error-message";
      message.textContent = `The lookup could not be completed. ${notes.join(" ")}`;
      region.append(message);
      return;
    }

    renderLookupResult(cveId, cve, epssRecord, notes);
  } finally {
    region.setAttribute("aria-busy", "false");
    submitButton.disabled = false;
    submitButton.removeAttribute("aria-disabled");
    submitButton.textContent = originalLabel;
  }
});

loadRecentCveSuggestions();

initRisks();
