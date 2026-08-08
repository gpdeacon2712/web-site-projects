/* profile.js — session-only demonstration profile behaviour.
   Profile data is intentionally not persisted, illustrating a different storage
   choice from the browser-persisted governance registers. */
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

  // Show the saved profile name as visible header text. A title tooltip would
  // not be reliably available to keyboard or touch users, so visible content is
  // the more accessible way to communicate the session state.
  let indicator = document.getElementById("session-indicator");
  if (!indicator) {
    indicator = document.createElement("p");
    indicator.id = "session-indicator";
    indicator.className = "session-indicator";
    document.querySelector(".site-header").append(indicator);
  }
  indicator.textContent = `Session profile: ${name} — ${role}`;
});
