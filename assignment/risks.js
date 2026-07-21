/* dashboard.js — renders the metric cards on index.html.
   Scaffold created with AI assistance (Claude, Anthropic). Cite per the
   assignment brief; extend with your own work.

   This file is the WORKED EXAMPLE of the fetch-and-render pattern used
   throughout the prototype. Study it, then apply the same pattern
   yourself in controls.js, risks.js and ai-register.js. */

"use strict";

async function renderDashboard() {
  const cardsSection = document.getElementById("metric-cards");

  try {
    // Load all three synthetic datasets in parallel
    const [controls, risks, useCases] = await Promise.all([
      loadJSON("data/controls.json"),
      loadJSON("data/risks.json"),
      loadJSON("data/ai-usecases.json"),
    ]);

    // Derive headline metrics from the raw data
    const implemented = controls.filter(c => c.status === "Implemented").length;
    const highRisks = risks.filter(r => r.rating === "High").length;
    const pendingAI = useCases.filter(u => u.approvalStatus === "Pending review").length;

    const metrics = [
      { value: `${implemented}/${controls.length}`, label: "Controls implemented" },
      { value: String(risks.length), label: "Risks on register" },
      { value: String(highRisks), label: "High-rated risks" },
      { value: String(pendingAI), label: "AI use cases pending review" },
    ];

    // Build the cards. textContent (not innerHTML) is used for data
    // values — a small but real defence against injection if the data
    // source ever became untrusted.
    cardsSection.replaceChildren();
    for (const metric of metrics) {
      const card = document.createElement("article");
      card.className = "card";

      const value = document.createElement("span");
      value.className = "metric";
      value.textContent = metric.value;

      const label = document.createElement("span");
      label.className = "metric-label";
      label.textContent = metric.label;

      card.append(value, label);
      cardsSection.append(card);
    }

    /* Optional future enhancements:
       - a maturity bar per framework (compute % implemented by framework)
       - make each card a link to the relevant page
       - animate the numbers counting up on load (respect
         prefers-reduced-motion) */
  } catch (error) {
    // Direct, actionable error message (also useful during marking!)
    cardsSection.replaceChildren();
    const message = document.createElement("p");
    message.textContent =
      "Metrics could not be loaded. If you are viewing this from a file:// URL, " +
      "serve the site over http instead — see the README. (" + error.message + ")";
    cardsSection.append(message);
  }
}

renderDashboard();
