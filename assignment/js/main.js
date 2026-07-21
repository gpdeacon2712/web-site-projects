/* main.js — shared behaviour on every page.
   Scaffold created with AI assistance (Claude, Anthropic). Cite per the
   assignment brief; extend with your own work. */

"use strict";

/* ---------------------------------------------------------------------------
   Mobile navigation toggle.
   The nav starts with the `hidden` attribute (so it works sensibly even if
   JS fails to load — progressive enhancement). Clicking the button flips
   `hidden` and keeps aria-expanded in sync for screen readers.

   TODO (student): upgrade this into an ANIMATED menu for the JS rubric
   line — e.g. toggle a class instead of `hidden` and transition
   max-height or transform in CSS (respect prefers-reduced-motion).
--------------------------------------------------------------------------- */
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.getElementById("site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.hidden = isOpen;
  });
}

/* ---------------------------------------------------------------------------
   loadJSON(path) — fetch one of the prototype's synthetic datasets.
   These local JSON files stand in for enterprise APIs (Graph, ServiceNow,
   CMDB…) per the scope brief. Reused by dashboard.js, controls.js, etc.

   NOTE: fetch() cannot read local files over file:// — serve the site
   over http while developing (see README).
--------------------------------------------------------------------------- */
async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Could not load ${path} (HTTP ${response.status})`);
  }
  return response.json();
}
