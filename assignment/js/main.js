/* main.js — shared utilities and progressive enhancements used across the site.
   AI use statement (AITS Level 2 - AI for Shaping): generative AI supported
   the initial framework skeleton; subsequent development, testing and refinement
   were completed and verified by the author. */

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
   loadJSON(path) fetches one of the prototype's local synthetic datasets.
   Keeping data in JSON separates content from presentation and imitates the
   asynchronous loading pattern used with server APIs. Because fetch() does not
   reliably load local files through file://, run the project through an HTTP
   server during development (see README).
--------------------------------------------------------------------------- */
async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Could not load ${path} (HTTP ${response.status})`);
  }
  return response.json();
}

/* ---------------------------------------------------------------------------
   localStorage helpers — persistence for user-added register entries.
   PRIVACY NOTE (also in the README): localStorage lives only in this
   browser profile on this device; nothing is transmitted to any server.
   It persists until cleared, so anyone sharing the browser profile can
   see the entries — hence each page offers a "clear" button, and the
   profile page deliberately remains session-only. Both operations are
   wrapped in try/catch because localStorage can be unavailable or full
   (e.g. some private-browsing modes); the app then degrades gracefully
   to session-only behaviour.
--------------------------------------------------------------------------- */
function loadStoredList(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredList(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

function clearStoredList(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* nothing to clear or storage unavailable — either way, done */
  }
}

/* ---------------------------------------------------------------------------
   CSV download. rows is an array of arrays (first row = headers).
   Fields containing commas, quotes or newlines are quoted with internal
   quotes doubled (RFC 4180); the UTF-8 byte-order mark makes Excel open
   the file with correct character decoding.
--------------------------------------------------------------------------- */
function downloadCSV(filename, rows) {
  const escapeCell = value => {
    const text = String(value ?? "");
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const csv = rows.map(row => row.map(escapeCell).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], {type: "text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// Version 17: highlight records opened through cross-register relationship links.
function highlightLinkedRecord() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return;
  window.setTimeout(() => {
    const target = document.getElementById(id);
    if (!target) return;
    target.classList.add("linked-target");
    target.scrollIntoView({behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center"});
    if (target.matches("tr")) target.querySelector("a, button")?.focus({preventScroll: true});
  }, 250);
}
window.addEventListener("hashchange", highlightLinkedRecord);
window.addEventListener("DOMContentLoaded", highlightLinkedRecord);

/* Bootstrap supplies the shared responsive interface components, while these
   helpers remain framework-independent so governance logic is easier to test
   and maintain separately. The data attribute exposes the submitted build
   version for diagnostics without changing visible page content. */
document.documentElement.dataset.appVersion = "23.3";


/* ---------------------------------------------------------------------------
   Accessible inline validation.
   Native HTML validation remains the source of truth. This progressive
   enhancement adds a visible, programmatically associated message for any
   required, patterned or typed control that becomes invalid. The helper
   preserves existing aria-describedby references and removes aria-invalid
   as soon as the value becomes valid.
--------------------------------------------------------------------------- */
function validationMessageFor(control) {
  if (control.validity.valueMissing) return "This field is required.";
  if (control.validity.typeMismatch && control.type === "email") return "Enter a valid email address.";
  if (control.validity.patternMismatch) return control.title || "Enter a value in the requested format.";
  if (control.validity.tooShort) return `Enter at least ${control.minLength} characters.`;
  if (control.validity.tooLong) return `Enter no more than ${control.maxLength} characters.`;
  if (control.validity.rangeUnderflow) return `Enter a value of at least ${control.min}.`;
  if (control.validity.rangeOverflow) return `Enter a value no greater than ${control.max}.`;
  return control.validationMessage || "Check this field and try again.";
}

function ensureInlineError(control) {
  if (!control.id) return null;
  const errorId = `${control.id}-error`;
  let error = document.getElementById(errorId);
  if (!error) {
    error = document.createElement("p");
    error.id = errorId;
    error.className = "form-hint error-message validation-error";
    error.hidden = true;
    control.insertAdjacentElement("afterend", error);
  }
  const describedBy = new Set((control.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
  describedBy.add(errorId);
  control.setAttribute("aria-describedby", [...describedBy].join(" "));
  return error;
}

function showInlineError(control) {
  const error = ensureInlineError(control);
  if (!error) return;
  error.textContent = validationMessageFor(control);
  error.hidden = false;
  control.setAttribute("aria-invalid", "true");
}

function clearInlineError(control) {
  if (!control.id) return;
  const error = document.getElementById(`${control.id}-error`);
  if (error) error.hidden = true;
  control.removeAttribute("aria-invalid");
}

document.addEventListener("invalid", event => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement) {
    showInlineError(event.target);
  }
}, true);

document.addEventListener("input", event => {
  const control = event.target;
  if ((control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement) && control.validity.valid) {
    clearInlineError(control);
  }
});

document.addEventListener("change", event => {
  const control = event.target;
  if ((control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement) && control.validity.valid) {
    clearInlineError(control);
  }
});
