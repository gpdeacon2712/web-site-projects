/* main.js - shared functions used across the website.

   AITS Statement (AI Level 1)

   The idea for this application came from early work on a possible
   Governance, Risk and Compliance project using OneTrust dashboards.
   An initial scaffold was provided to build on and develop further.
   No confidential organisational information or live OneTrust data
   is included.

   I confirm that no generative AI tools were used to design, structure
   or develop the technical or written work that followed. All code,
   design decisions, testing and written content were created and
   checked by me.

   Only standard proofreading features in Microsoft Word, including
   spelling, grammar, clarity and style suggestions, and formatting
   tools in Visual Studio Code were used. These tools did not generate
   substantive content or code.

   I take full responsibility for all submitted work.
*/

"use strict";


/* ---------------------------------------------------------------------------
   OLD MOBILE NAVIGATION

   This code was used before the site was changed to Bootstrap 5.
   Bootstrap now controls the mobile navigation, so this code is no
   longer used. It has been left here for reference.

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.getElementById("site-nav");

if (navToggle && siteNav) {
  // Show the navigation and add the enhanced styling.
  siteNav.hidden = false;
  siteNav.classList.add("site-nav--enhanced");

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("site-nav--open", !isOpen);
  });

  siteNav.addEventListener("click", event => {
    if (
      event.target.closest("a") &&
      window.matchMedia("(max-width: 47.99rem)").matches
    ) {
      navToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("site-nav--open");
    }
  });
}
--------------------------------------------------------------------------- */


/* ---------------------------------------------------------------------------
   LOAD JSON DATA

   Loads local JSON data used by the prototype.
   The project should be run through a web server because fetch() may
   not work correctly when files are opened directly using file://.
--------------------------------------------------------------------------- */

async function loadJSON(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Could not load ${path} (HTTP ${response.status})`);
  }

  return response.json();
}


/* ---------------------------------------------------------------------------
   LOCAL STORAGE

   These functions save, load and clear user-added entries in the browser.

   The data stays in localStorage on the user's device and is not sent
   to a server. It remains there until it is cleared.

   try/catch is used because localStorage may not always be available,
   for example in some private browsing modes.
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
    /* Storage is unavailable or there is nothing to clear. */
  }
}


/* ---------------------------------------------------------------------------
   CSV EXPORT

   Converts table data into CSV format and downloads it as a file.
   Special characters are escaped and UTF-8 encoding is used to improve
   compatibility with spreadsheet software.
--------------------------------------------------------------------------- */

function downloadCSV(filename, rows) {
  const escapeCell = value => {
    const text = String(value ?? "");
    return /[",\n]/.test(text)
      ? `"${text.replace(/"/g, '""')}"`
      : text;
  };

  const csv = rows
    .map(row => row.map(escapeCell).join(","))
    .join("\r\n");

  const blob = new Blob(
    ["\uFEFF" + csv],
    {type: "text/csv;charset=utf-8;"}
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.append(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}


/* Highlight a record when a link opens it directly. */

function highlightLinkedRecord() {
  const id = decodeURIComponent(window.location.hash.slice(1));

  if (!id) return;

  window.setTimeout(() => {
    const target = document.getElementById(id);

    if (!target) return;

    target.classList.add("linked-target");

    target.scrollIntoView({
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
        ? "auto"
        : "smooth",
      block: "center"
    });

    if (target.matches("tr")) {
      target
        .querySelector("a, button")
        ?.focus({preventScroll: true});
    }
  }, 250);
}

window.addEventListener(
  "hashchange",
  highlightLinkedRecord
);

window.addEventListener(
  "DOMContentLoaded",
  highlightLinkedRecord
);


/* Bootstrap provides the shared page layout and navigation.
   The GRC functions remain separate so they are easier to maintain
   and test. The application version is stored in the page data. */

document.documentElement.dataset.appVersion = "23.4";


/* ---------------------------------------------------------------------------
   FORM VALIDATION

   Browser validation is used as the main validation method.
   JavaScript adds clear error messages for invalid form fields and
   links each message to the correct field for accessibility.
--------------------------------------------------------------------------- */

function validationMessageFor(control) {
  if (control.validity.valueMissing) {
    return "This field is required.";
  }

  if (
    control.validity.typeMismatch &&
    control.type === "email"
  ) {
    return "Enter a valid email address.";
  }

  if (control.validity.patternMismatch) {
    return control.title ||
      "Enter a value in the requested format.";
  }

  if (control.validity.tooShort) {
    return `Enter at least ${control.minLength} characters.`;
  }

  if (control.validity.tooLong) {
    return `Enter no more than ${control.maxLength} characters.`;
  }

  if (control.validity.rangeUnderflow) {
    return `Enter a value of at least ${control.min}.`;
  }

  if (control.validity.rangeOverflow) {
    return `Enter a value no greater than ${control.max}.`;
  }

  return control.validationMessage ||
    "Check this field and try again.";
}


function ensureInlineError(control) {
  if (!control.id) return null;

  const errorId = `${control.id}-error`;
  let error = document.getElementById(errorId);

  if (!error) {
    error = document.createElement("p");
    error.id = errorId;
    error.className =
      "form-hint error-message validation-error";
    error.hidden = true;

    control.insertAdjacentElement(
      "afterend",
      error
    );
  }

  const describedBy = new Set(
    (control.getAttribute("aria-describedby") || "")
      .split(/\s+/)
      .filter(Boolean)
  );

  describedBy.add(errorId);

  control.setAttribute(
    "aria-describedby",
    [...describedBy].join(" ")
  );

  return error;
}


function showInlineError(control) {
  const error = ensureInlineError(control);

  if (!error) return;

  error.textContent =
    validationMessageFor(control);

  error.hidden = false;

  control.setAttribute(
    "aria-invalid",
    "true"
  );
}


function clearInlineError(control) {
  if (!control.id) return;

  const error = document.getElementById(
    `${control.id}-error`
  );

  if (error) {
    error.hidden = true;
  }

  control.removeAttribute("aria-invalid");
}


/* Show an error when a form field is invalid. */

document.addEventListener(
  "invalid",
  event => {
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLSelectElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      showInlineError(event.target);
    }
  },
  true
);


/* Remove the error when the field becomes valid. */

document.addEventListener(
  "input",
  event => {
    const control = event.target;

    if (
      (
        control instanceof HTMLInputElement ||
        control instanceof HTMLSelectElement ||
        control instanceof HTMLTextAreaElement
      ) &&
      control.validity.valid
    ) {
      clearInlineError(control);
    }
  }
);


document.addEventListener(
  "change",
  event => {
    const control = event.target;

    if (
      (
        control instanceof HTMLInputElement ||
        control instanceof HTMLSelectElement ||
        control instanceof HTMLTextAreaElement
      ) &&
      control.validity.valid
    ) {
      clearInlineError(control);
    }
  }
);

