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

  const brand = document.querySelector(".brand");
  brand.setAttribute("title", `Signed in for this session as ${name}`);
});
