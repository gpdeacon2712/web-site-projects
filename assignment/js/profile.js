/* profile.js — session-only demonstration profile. */
"use strict";

const profileForm = document.getElementById("profile-form");
const profileFeedback = document.getElementById("profile-feedback");

profileForm.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(profileForm);
  const name = String(data.get("display-name") || "").trim();
  const role = document.querySelector(`#role-type option[value="${CSS.escape(String(data.get("role-type")))}"]`)?.textContent;
  const department = document.querySelector(`#department option[value="${CSS.escape(String(data.get("department")))}"]`)?.textContent;

  profileFeedback.className = "results-region success-message";
  profileFeedback.textContent = `Profile saved for this session. Welcome, ${name}. Role: ${role}; department: ${department}.`;

  // Visible session indicator in the header. An earlier version set a
  // title attribute on the brand link, but title tooltips are invisible
  // to keyboard and touch users — visible text is the accessible choice
  // (WCAG 1.3.1 / general perceivability). Created once, updated on
  // subsequent saves.
  let indicator = document.getElementById("session-indicator");
  if (!indicator) {
    indicator = document.createElement("p");
    indicator.id = "session-indicator";
    indicator.className = "session-indicator";
    document.querySelector(".site-header").append(indicator);
  }
  indicator.textContent = `Session profile: ${name} — ${role}`;
});
