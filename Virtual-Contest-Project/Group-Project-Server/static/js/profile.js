"use strict";

addEventListener("DOMContentLoaded", (event) => {
    getProfileUsernameAndID();
})

async function getProfileUsernameAndID() {
    const profileUsername = document.querySelector(".username").textContent;

    const response = await fetch(`users/by_username/${profileUsername}`);

    if (response.ok)
    {
        const data = await response.json();

        const profileUserID = data.id;

        showHaveSkills(profileUserID);
        showToLearnSkills(profileUserID);
    }
}

async function showHaveSkills(userID)
{
    const response = await fetch(`/skills/skillsHas/${userID}`);

    if (response.ok)
    {
        const data = await response.json();

        const skillsHave = document.querySelector(".skills-you-have");
        skillsHave.innerHTML = `<h2>Skills You Have</h2>`;
        const ul = document.createElement("ul");
        data.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `${item.skill_sub_category}`
            ul.append(li);
        })
        skillsHave.appendChild(ul);
    }
}

async function showToLearnSkills(userID)
{
    const response = await fetch(`/skills/skillsLearning/${userID}`);

    if (response.ok)
    {
        const data = await response.json();

        const skillsLearning = document.querySelector(".skills-to-learn");
        skillsLearning.innerHTML = `<h2>Skills To Learn</h2>`;
        const ul = document.createElement("ul");
        data.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `${item.skill_sub_category}`
            ul.append(li);
        })
        skillsLearning.appendChild(ul);
    }
}
