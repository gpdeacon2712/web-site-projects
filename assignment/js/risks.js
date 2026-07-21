/* risks.js — risk register + live CVE/EPSS lookup on risks.html.
   Scaffold created with AI assistance (Claude, Anthropic). Cite per the
   assignment brief; extend with your own work.

   This file is deliberately a SKELETON: the third-party API integration
   is the highest-value JavaScript in the project, so it should be your
   work. The plan below tells you exactly what to build and where the
   marks are. */

"use strict";

/* ---------------------------------------------------------------------------
   PART 1 — render the synthetic risk register table.
   TODO (student): load data/risks.json with loadJSON() and build rows in
   #risk-rows. Follow the pattern in js/controls.js (renderControlRows).
   Fields available per risk: id, title, category, rating, owner, treatment.
   Reuse the .badge classes for the rating column.
--------------------------------------------------------------------------- */


/* ---------------------------------------------------------------------------
   PART 2 — chained third-party API lookup (distinction-band criterion:
   "combining multiple endpoints from different api providers", driven by
   data the user entered in an HTML form).

   Provider A — CIRCL CVE Search (vulnerability details):
     GET https://cve.circl.lu/api/cve/{CVE-ID}
     e.g. https://cve.circl.lu/api/cve/CVE-2021-44228
     Useful response fields (verify in the browser first — API shapes
     change): summary/description text, CVSS score, published date.

   Provider B — FIRST EPSS (exploit prediction score):
     GET https://api.first.org/data/v1/epss?cve={CVE-ID}
     Response: { data: [ { cve, epss, percentile, date } ] }
     data may be an EMPTY ARRAY for unknown CVEs — handle that case.

   TODO (student) plan:
   1. Listen for "submit" on #cve-lookup; call event.preventDefault().
      (Built-in validation — required + pattern on the input — has already
      run by the time submit fires. Mention that layering in Assessment 3.)
   2. Read the CVE ID from the input; show a "Looking up…" message in
      #cve-results so the user knows something is happening.
   3. fetch() provider A. Check response.ok; handle a CVE that doesn't
      exist with a helpful message, not a broken page.
   4. fetch() provider B with the same ID (you can run both with
      Promise.all since neither depends on the other's response).
   5. Render a combined result card into #cve-results: the CVE ID
      (class "ref-id"), description, CVSS score, and the EPSS probability
      formatted as a percentage. Use textContent for API data — it is
      untrusted input; never insert it with innerHTML.
   6. Translate the EPSS score into your prototype's own risk language,
      e.g. >= 0.5 High / >= 0.1 Medium / else Low, shown with the .badge
      classes. This is what turns "displaying API data" into "displaying
      it in a useful and meaningful way" (the rubric's wording).
   7. Wrap it all in try/catch; on network failure explain what happened.

   Stretch: an "Add to risk register" button on the result that appends
   a new row to the Part 1 table (connects the two halves of the page).

   NOTE: test both APIs from your deployed site early — if either is
   blocked by CORS or offline, fall back to the module's example API
   (https://freetestapi.com/api/v1/movies) rather than losing the marks.
--------------------------------------------------------------------------- */
