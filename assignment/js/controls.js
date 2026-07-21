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

/* TODO (student): implement filtering.
   Plan:
   1. Read the three inputs: #filter-text, #filter-framework, #filter-status.
   2. Write applyFilters() that filters `allControls` with .filter():
        - text: case-insensitive match against control.name (and id?)
        - framework: control.frameworks.includes(selectedFramework)
        - status: exact match
      then calls renderControlRows(filtered).
   3. Listen for the right events:
        document.getElementById("filter-text").addEventListener("input", applyFilters);
        // "change" suits the two selects
   Stretch: sortable column headers; a "no results" row when the filter
   matches nothing (an empty table is a poor empty state). */

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
