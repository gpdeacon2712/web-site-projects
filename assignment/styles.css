/* risks.js — risk register and live CVE/EPSS lookup.
   Extended from the original AI-assisted scaffold by Graham Deacon. */

"use strict";

const RISK_BADGE = {
  High: "badge--risk",
  Medium: "badge--warn",
  Low: "badge--ok",
};

function renderRiskRows(risks) {
  const tbody = document.getElementById("risk-rows");
  tbody.replaceChildren();

  for (const risk of risks) {
    const row = document.createElement("tr");
    const values = [risk.id, risk.title, risk.category];

    values.forEach((value, index) => {
      const cell = document.createElement("td");
      if (index === 0) {
        const ref = document.createElement("span");
        ref.className = "ref-id";
        ref.textContent = value;
        cell.append(ref);
      } else {
        cell.textContent = value;
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

    row.append(ratingCell, ownerCell, treatmentCell);
    tbody.append(row);
  }
}

async function initRisks() {
  try {
    renderRiskRows(await loadJSON("data/risks.json"));
  } catch (error) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 6;
    cell.className = "empty-state";
    cell.textContent = `Risks could not be loaded. Serve the site over http. (${error.message})`;
    row.append(cell);
    document.getElementById("risk-rows").append(row);
  }
}

function firstEnglishDescription(cve) {
  if (typeof cve.summary === "string") return cve.summary;
  if (typeof cve.details === "string") return cve.details;
  const descriptions = cve.containers?.cna?.descriptions || cve.cve?.descriptions || cve.descriptions;
  if (Array.isArray(descriptions)) {
    return descriptions.find(item => item.lang === "en")?.value || descriptions[0]?.value;
  }
  return "No description was supplied by the vulnerability provider.";
}

function extractCvss(cve) {
  const candidates = [
    cve.cvss, cve.cvss3, cve.cvssScore,
    cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore,
    cve.metrics?.cvssMetricV30?.[0]?.cvssData?.baseScore,
    cve.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore,
    cve.cve?.metrics?.cvssMetricV30?.[0]?.cvssData?.baseScore,
    cve.containers?.cna?.metrics?.[0]?.cvssV3_1?.baseScore,
    cve.containers?.cna?.metrics?.[0]?.cvssV3_0?.baseScore,
  ];
  const score = candidates.find(value => value !== undefined && value !== null && value !== "");
  return score === undefined ? "Not supplied" : String(score);
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
  if (score === null) return {label: "Unavailable", className: ""};
  if (score >= 0.5) return {label: "High", className: "badge--risk"};
  if (score >= 0.1) return {label: "Medium", className: "badge--warn"};
  return {label: "Low", className: "badge--ok"};
}

function renderLookupResult(cveId, cve, epssRecord) {
  const region = document.getElementById("cve-results");
  region.replaceChildren();

  const article = document.createElement("article");
  article.className = "result-card";
  const heading = document.createElement("h3");
  const ref = document.createElement("span");
  ref.className = "ref-id";
  ref.textContent = cveId;
  heading.append("Threat intelligence for ", ref);

  const description = document.createElement("p");
  description.textContent = firstEnglishDescription(cve);

  const list = document.createElement("dl");
  list.className = "result-details";
  addDefinition(list, "CVSS base score", extractCvss(cve));

  const score = epssRecord ? Number(epssRecord.epss) : null;
  const percentile = epssRecord ? Number(epssRecord.percentile) : null;
  addDefinition(list, "EPSS probability", score === null ? "Not available" : `${(score * 100).toFixed(2)}%`);
  addDefinition(list, "EPSS percentile", percentile === null ? "Not available" : `${(percentile * 100).toFixed(2)}%`);

  const assessment = epssRisk(score);
  const assessmentBadge = document.createElement("span");
  assessmentBadge.className = `badge ${assessment.className}`;
  assessmentBadge.textContent = assessment.label;
  addDefinition(list, "Prototype exploitation priority", assessmentBadge);
  if (epssRecord?.date) addDefinition(list, "EPSS score date", epssRecord.date);

  const note = document.createElement("p");
  note.className = "form-hint";
  note.textContent = "EPSS estimates exploitation probability; it does not replace asset context, impact assessment or professional judgement.";

  article.append(heading, description, list, note);
  region.append(article);
}

async function fetchJSON(url, providerName) {
  const response = await fetch(url, {headers: {Accept: "application/json"}});
  if (!response.ok) throw new Error(`${providerName} returned HTTP ${response.status}`);
  return response.json();
}

const lookupForm = document.getElementById("cve-lookup");
lookupForm.addEventListener("submit", async event => {
  event.preventDefault();
  const input = document.getElementById("cve-id");
  const cveId = input.value.trim().toUpperCase();
  input.value = cveId;

  const region = document.getElementById("cve-results");
  region.textContent = `Looking up ${cveId}…`;

  try {
    const [cve, epss] = await Promise.all([
      fetchJSON(`https://cve.circl.lu/api/cve/${encodeURIComponent(cveId)}`, "CIRCL"),
      fetchJSON(`https://api.first.org/data/v1/epss?cve=${encodeURIComponent(cveId)}`, "FIRST EPSS"),
    ]);

    if (!cve || (!cve.id && !cve.cveMetadata && !cve.cve && !cve.summary && !cve.details)) {
      throw new Error("No vulnerability record was returned for that identifier");
    }
    renderLookupResult(cveId, cve, Array.isArray(epss.data) ? epss.data[0] : null);
  } catch (error) {
    region.replaceChildren();
    const message = document.createElement("p");
    message.className = "error-message";
    message.textContent = `The lookup could not be completed: ${error.message}. Check the identifier, network connection and deployed-site API/CORS access.`;
    region.append(message);
  }
});

initRisks();
