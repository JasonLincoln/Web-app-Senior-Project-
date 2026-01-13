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

//Makes constants based on page elements
const allTutors = document.getElementById('cards-grid');
const tutorTemplate = document.getElementById('tutorTemplate');

//Makes constants based on database endpoints
const getAllUsersEndpoint = '/admin/user';
const currentUserEndpoint = '/users/';

//If the user has a username, then all tutors are shown
getCurrentUser().then(username => {
    if(username) {
        showAllUsers(username);
    }
});

//Returns the logged in user's username for function use
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

//Displays all users other than the logged in user
async function showAllUsers(currentUsername){
    console.log("Getting all users.");

    const response = await fetch(getAllUsersEndpoint);
    if (response.ok) {
        //Converts all user data into JSON
        const data = await response.json();
        console.log("Using user data for the showAllUsers function.");

        //Clears the allTutors section before placing all users into an array and displaying the users
        allTutors.innerHTML = "";
        users = data.map(item => {
            console.log("Displaying users on page.");
            //Clones the card template and its child elements
            let card = tutorTemplate.content.cloneNode(true).children[0];
            const username = card.querySelector("[data-username]");
            const biography = card.querySelector("[data-biography]");
            const skills = card.querySelector("[data-skills]");
            let rating = card.querySelector("[data-rating]");
            const profilePic = card.querySelector("[data-profile-url]");
            const profileButton = card.querySelector(".profile_button");
            const sessionRequestButton = card.querySelector(".request_session_button");

            //Changes text content based on user data
            profilePic.src = item.profile_url;
            username.textContent = item.username;
            biography.textContent = item.biography;
            for(let i = 0; i < item.rating; i++)
            {
                const star = Object.assign(document.createElement('i'), { className : "fa-solid fa-star"});
                rating.append(star);
            }

            //Adds the card to the allTutors section
            allTutors.append(card);

            //Adds an event listener for buttons on the cards, sending the user to different pages for each button
            profileButton.addEventListener('click', function(e) {
                window.location.href = `/pages/profile/${item.id}`;
            });
            sessionRequestButton.addEventListener('click', function(e) {
                //Adds the tutor's username to session storage for another page's use
                sessionStorage.setItem('tutorName', item.username);
                window.location.href = `/pages/sessions`;
            });
            if(currentUsername == item.username)
            {
                //Hides your user card
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

//Whenever the user types into the searchbar, there is a case insensitive search for if any tutor's username has the values entered
//If the values entered are not in a tutor's username, then the tutor's card is hidden
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