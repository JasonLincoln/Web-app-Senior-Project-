"use strict"

// On clicking the sessions button:
$("#sessions-button").on("click", () => {
    window.location.href="/pages/sessions"; // takes you to the sessions page
})

// On clicking the ratings button:
$("#ratings-button").on("click", () => {
    window.location.href="/pages/rating/{username}"; // takes you to the rating page
})

// On clicking the gear icon:
$(".settings-icon").on("click", () => {
    window.location.href="/pages/profile-creation"; // takes you to the profile creation page
})