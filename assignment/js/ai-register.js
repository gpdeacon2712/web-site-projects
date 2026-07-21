/* ai-register.js — AI use-case form behaviour on ai-register.html.
   Scaffold created with AI assistance (Claude, Anthropic). Cite per the
   assignment brief; extend with your own work.

   Everything here is TODO by design — form validation is a named
   JavaScript rubric feature and should be your work. The worked example
   to copy patterns from is js/dashboard.js + js/controls.js. */

"use strict";

/* TODO (student) plan:

   1. Live slider label — smallest win first:
      const slider = document.getElementById("risk-rating");
      const output = document.getElementById("risk-output");
      Listen for "input" on the slider and copy slider.value into
      output.value. (<output> exists for exactly this — calculation
      results; an Assessment 3 talking point.)

   2. Pre-populate the "Registered use cases" list (#usecase-list) from
      data/ai-usecases.json using loadJSON(). Render each as an <li>
      with the tool name, owner role, a .badge for approvalStatus, the
      review date and its frameworkAlignment array (join with ", " —
      shows AI governance frameworks mapped in the hub, per the scope
      brief). Keep the array in memory.

   3. Handle "submit" on #ai-usecase-form:
      - event.preventDefault()
      - Built-in validation (required, type="email", maxlength) has
        already passed by the time submit fires. Add your OWN checks on
        top for rules HTML can't express — e.g. if data-category is
        "personal" or "special", require at least one oversight checkbox.
        That's a meaningful, domain-driven validation rule: exactly what
        "validation … to prevent entry of invalid data" (distinction
        band) is looking for.
      - Read values with new FormData(form) — note .getAll("oversight")
        for the checkboxes and .getAll("framework-alignment") for the
        multi-select.
      - Push the new use case into the in-memory array, re-render the
        list, reset the form, and write a confirmation into
        #register-feedback (its aria-live attribute announces it to
        screen-reader users).

   Stretch: a client-side "draft saved" indicator, or a duplicate-name
   check against the existing list with a helpful message. */
