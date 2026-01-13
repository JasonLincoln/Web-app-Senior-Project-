"use strict"

// On clicking the sessions button:
$("#sessions-button").on("click", () => {
    window.location.href="sessions.html"; // takes you to the sessions page
})

// On clicking the ratings button:
$("#ratings-button").on("click", () => {
    window.location.href="rating.html"; // takes you to the rating page
})

// On clicking the gear icon:
$(".settings-icon").on("click", () => {
    window.location.href="profile_creation.html"; // takes you to the profile creation page
})