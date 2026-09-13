/* profile.js
   Implements session-only profile functionality. Profile data is
   deliberately transient, illustrating a different data-retention
   approach from the persisted governance registers.
*/
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

// Displays the active profile name as visible interface content,
// ensuring session status is available to all users rather than
// relying on tooltip-based information.
  let indicator = document.getElementById("session-indicator");
  if (!indicator) {
    indicator = document.createElement("p");
    indicator.id = "session-indicator";
    indicator.className = "session-indicator";
    document.querySelector(".page-header").append(indicator);
  }
  indicator.textContent = `Session profile: ${name} - ${role}`;
});
