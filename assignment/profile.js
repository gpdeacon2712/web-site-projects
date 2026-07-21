/* controls.js — control library table on controls.html.
   Scaffold created with AI assistance (Claude, Anthropic). Cite per the
   assignment brief; extend with your own work.

   Rendering is provided so the page works out of the box.
   FILTERING is yours to build — it is a core "user interaction" mark. */

"use strict";

// Map data statuses to badge classes. Note text label + colour together —
// never colour alone (WCAG 1.4.1).
const STATUS_BADGE = {
  "Implemented": "badge--ok",
  "In progress": "badge--warn",
  "Not implemented": "badge--risk",
};

let allControls = []; // kept in memory so filtering never re-fetches

function renderControlRows(controls) {
  const tbody = document.getElementById("control-rows");
  tbody.replaceChildren();

  for (const control of controls) {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    const idRef = document.createElement("span");
    idRef.className = "ref-id";
    idRef.textContent = control.id;
    idCell.append(idRef);

    const nameCell = document.createElement("td");
    nameCell.textContent = control.name;

    const frameworkCell = document.createElement("td");
    frameworkCell.textContent = control.frameworks.join(", ");

    const ownerCell = document.createElement("td");
    ownerCell.textContent = control.owner;

    const statusCell = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = "badge " + (STATUS_BADGE[control.status] || "");
    badge.textContent = control.status;
    statusCell.append(badge);

    row.append(idCell, nameCell, frameworkCell, ownerCell, statusCell);
    tbody.append(row);
  }

  // aria-live element in the HTML announces this to screen readers
  const count = document.getElementById("control-count");
  count.textContent = `${controls.length} control${controls.length === 1 ? "" : "s"} shown.`;
}

function applyFilters() {
  const text = document.getElementById("filter-text").value.trim().toLowerCase();
  const framework = document.getElementById("filter-framework").value;
  const status = document.getElementById("filter-status").value;

  const filtered = allControls.filter(control => {
    const searchableText = `${control.id} ${control.name} ${control.owner}`.toLowerCase();
    const matchesText = !text || searchableText.includes(text);
    const matchesFramework = !framework || control.frameworks.includes(framework);
    const matchesStatus = !status || control.status === status;
    return matchesText && matchesFramework && matchesStatus;
  });

  renderControlRows(filtered);

  if (filtered.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.className = "empty-state";
    cell.textContent = "No controls match the selected filters.";
    row.append(cell);
    document.getElementById("control-rows").append(row);
  }
}

document.getElementById("filter-text").addEventListener("input", applyFilters);
document.getElementById("filter-framework").addEventListener("change", applyFilters);
document.getElementById("filter-status").addEventListener("change", applyFilters);

async function initControls() {
  try {
    allControls = await loadJSON("data/controls.json");
    renderControlRows(allControls);
  } catch (error) {
    document.getElementById("control-count").textContent =
      "Controls could not be loaded — serve the site over http (see README). (" +
      error.message + ")";
  }
}

initControls();
