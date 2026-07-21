/* main.js — shared behaviour on every page.
   Scaffold created with AI assistance (Claude, Anthropic). Cite per the
   assignment brief; extend with your own work. */

"use strict";

/* ---------------------------------------------------------------------------
   Mobile navigation toggle.
   The nav starts with the `hidden` attribute (so it works sensibly even if
   JS fails to load — progressive enhancement). Clicking the button flips
   `hidden` and keeps aria-expanded in sync for screen readers.

   JavaScript progressively enhances this into an animated menu by toggling
   CSS classes while keeping aria-expanded synchronised.
--------------------------------------------------------------------------- */
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.getElementById("site-nav");

if (navToggle && siteNav) {
  // Once JavaScript is available, CSS controls the collapsed/open states so
  // the menu can animate. Without JavaScript, the original hidden attribute
  // remains a safe fallback.
  siteNav.hidden = false;
  siteNav.classList.add("site-nav--enhanced");

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("site-nav--open", !isOpen);
  });

  siteNav.addEventListener("click", event => {
    if (event.target.closest("a") && window.matchMedia("(max-width: 47.99rem)").matches) {
      navToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("site-nav--open");
    }
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
