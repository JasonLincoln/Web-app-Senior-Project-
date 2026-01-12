"use strict";

// Dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    // Skills dropdown
    const skillsDropdown = document.querySelector('.dropdown');
    const skillsButton = skillsDropdown.querySelector('.link');
    const skillsMenu = skillsDropdown.querySelector('.dropdown-menu');
    const skillsInput = document.getElementById('skill-dropdown-textbox');

    // Toggle skills dropdown on button click
    skillsButton.addEventListener('click', function() {
        skillsDropdown.classList.toggle('active');
    });

    // Select skill on link click

    // skillsMenu.addEventListener('click', function(e) {
    //     if (e.target.classList.contains('link')) {
    //         skillsInput.value = e.target.textContent;
    //         skillsDropdown.classList.remove('active');
    //     }
    // });

    // Rating dropdown
    const ratingDropdown = document.querySelectorAll('.dropdown')[1]; // second one
    const ratingButton = ratingDropdown.querySelector('.link');
    const ratingMenu = ratingDropdown.querySelector('.dropdown-menu');
    const ratingInput = document.getElementById('rating-dropdown-textbox');

    // Toggle rating dropdown on button click
    ratingButton.addEventListener('click', function() {
        ratingDropdown.classList.toggle('active');
    });

    // Select rating on link click
    
    // ratingMenu.addEventListener('click', function(e) {
    //     if (e.target.classList.contains('link')) {
    //         ratingInput.value = e.target.textContent;
    //         ratingDropdown.classList.remove('active');
    //     }
    // });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!skillsDropdown.contains(e.target)) {
            skillsDropdown.classList.remove('active');
        }
        if (!ratingDropdown.contains(e.target)) {
            ratingDropdown.classList.remove('active');
        }
    });
});

// Search Functionality
let users = [];

// Display Tutors other than you
const allTutors = document.getElementById('cards-grid');
const tutorTemplate = document.getElementById('tutorTemplate');
const getAllUsersEndpoint = '/admin/user';
const currentUserEndpoint = '/users/';
getCurrentUser().then(username => {
    if(username) {
        showAllUsers(username);
    }
});

async function getCurrentUser(){
    const response = await fetch(currentUserEndpoint);
    if (response.ok) {
        const data = await response.json();
        const currentUsername = data.username;
        return currentUsername;
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
}

async function showAllUsers(currentUsername){
    console.log("Getting all users.");

    const response = await fetch(getAllUsersEndpoint);
    if (response.ok) {
        const data = await response.json();
        console.log(data.data);
        console.log("Using user data for the showAllUsers function.");
        allTutors.innerHTML = "";
        users = data.map(item => {
            console.log("Displaying users on page.");
            let card = tutorTemplate.content.cloneNode(true).children[0];
            const username = card.querySelector("[data-username]");
            const biography = card.querySelector("[data-biography]");
            const skills = card.querySelector("[data-skills]");
            let rating = card.querySelector("[data-rating]");
            const profilePic = card.querySelector("[data-profile-url]");
            profilePic.src = item.profile_url;
            username.textContent = item.username;
            biography.textContent = item.biography;
            console.log(item.rating);
            for(let i = 0; i < item.rating; i++)
            {
                const star = Object.assign(document.createElement('i'), { className : "fa-solid fa-star"});
                rating.append(star);
            }
            allTutors.append(card);
            card.addEventListener('click', function(e) {
                window.location.href = `/pages/profile/${item.id}`;
            })
            if(currentUsername == item.username)
            {
                card.classList.toggle("hide");
            }
            return { username: item.username, biography: item.biography, rating: item.rating, element: card};
        });
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
}

// Search Tutors
const searchBar = document.getElementById('searchBar');
searchBar.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    users.forEach(item => {
        const isVisible = item.username.toLowerCase().includes(value);

            getCurrentUser().then(username => {
                if(username) {
                    if(username != item.username)
                    {
                        item.element.classList.toggle("hide", !isVisible);
                    }
                }
            });
    })
})