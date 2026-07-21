/* ai-register.js — AI use-case form behaviour.
   Extended from the original AI-assisted scaffold by Graham Deacon. */

"use strict";

const form = document.getElementById("ai-usecase-form");
const slider = document.getElementById("risk-rating");
const output = document.getElementById("risk-output");
const feedback = document.getElementById("register-feedback");
let useCases = [];

const APPROVAL_BADGE = {
  Approved: "badge--ok",
  "Pending review": "badge--warn",
  Rejected: "badge--risk",
};

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-GB", {day: "numeric", month: "short", year: "numeric"});
}

function renderUseCases() {
  const list = document.getElementById("usecase-list");
  list.replaceChildren();

  for (const useCase of useCases) {
    const item = document.createElement("li");
    item.className = "usecase-card";
    const heading = document.createElement("h3");
    const ref = document.createElement("span");
    ref.className = "ref-id";
    ref.textContent = useCase.id;
    heading.append(ref, ` ${useCase.toolName}`);

    const status = document.createElement("span");
    status.className = `badge ${APPROVAL_BADGE[useCase.approvalStatus] || ""}`;
    status.textContent = useCase.approvalStatus;

    const details = document.createElement("p");
    const frameworks = useCase.frameworkAlignment.length ? useCase.frameworkAlignment.join(", ") : "No framework selected";
    details.textContent = `${useCase.ownerRole} · Risk ${useCase.riskRating}/5 · Review ${formatDate(useCase.reviewDate)} · ${frameworks}`;

    item.append(heading, status, details);
    list.append(item);
  }
}

function roleLabel(value) {
  return document.querySelector(`#owner-role option[value="${CSS.escape(value)}"]`)?.textContent || value;
}

function setMinimumReviewDate() {
  const dateInput = document.getElementById("review-date");
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateInput.min = localToday;
}

slider.addEventListener("input", () => { output.value = slider.value; });

form.addEventListener("submit", event => {
  event.preventDefault();
  feedback.replaceChildren();

  const data = new FormData(form);
  const category = data.get("data-category");
  const oversight = data.getAll("oversight");
  const toolName = String(data.get("tool-name") || "").trim();

  if (["personal", "special"].includes(category) && oversight.length === 0) {
    feedback.textContent = "Select at least one human oversight arrangement when personal or special-category data is used.";
    feedback.className = "results-region error-message";
    document.getElementById("oversight-review").focus();
    return;
  }

  if (useCases.some(item => item.toolName.toLowerCase() === toolName.toLowerCase())) {
    feedback.textContent = "That AI tool name is already registered. Use a distinct name or update the existing record.";
    feedback.className = "results-region error-message";
    document.getElementById("tool-name").focus();
    return;
  }

  const nextNumber = Math.max(0, ...useCases.map(item => Number(item.id.replace(/\D/g, "")) || 0)) + 1;
  useCases.push({
    id: `AI-${String(nextNumber).padStart(3, "0")}`,
    toolName,
    purpose: String(data.get("purpose") || "").trim(),
    supplier: String(data.get("supplier") || "").trim(),
    ownerRole: roleLabel(String(data.get("owner-role"))),
    ownerEmail: String(data.get("owner-email") || "").trim(),
    dataCategory: category,
    riskRating: Number(data.get("risk-rating")),
    approvalStatus: "Pending review",
    oversight,
    reviewDate: String(data.get("review-date")),
    frameworkAlignment: data.getAll("framework-alignment"),
  });

  renderUseCases();
  form.reset();
  output.value = slider.value;
  feedback.className = "results-region success-message";
  feedback.textContent = `${toolName} was added to the in-memory register for this browser session.`;
  document.getElementById("tool-name").focus();
});

async function initUseCases() {
  setMinimumReviewDate();
  output.value = slider.value;
  try {
    useCases = await loadJSON("data/ai-usecases.json");
    renderUseCases();
  } catch (error) {
    feedback.className = "results-region error-message";
    feedback.textContent = `Existing use cases could not be loaded. Serve the site over http. (${error.message})`;
  }
}

initUseCases();
