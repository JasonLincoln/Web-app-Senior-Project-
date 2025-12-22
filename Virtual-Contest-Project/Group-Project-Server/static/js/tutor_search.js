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

// Display Tutors
const allTutors = document.getElementById('cards-grid');
const tutorTemplate = document.querySelector("[data-tutor-template]");
const getAllUsersEndpoint = '/admin/user';
showAllUsers();

async function showAllUsers(){
    console.log("Getting all users.");

    const response = await fetch(getAllUsersEndpoint);
    if (response.ok) {
        const data = await response.json();
        console.log('hi');
        console.log(data.data);
        console.log("Using user data for the showAllUsers function.");
        allTutors.innerHTML = "";
        users = data.map(item => {
            console.log("Displaying users on page.");
            const card = tutorTemplate.content.cloneNode(true).children[0];
            const username = card.querySelector("[data-username]");
            const biography = card.querySelector("[data-biography]");
            const skills = card.querySelector("[data-skills]");
            const rating = card.querySelector("[data-rating]");
            username.textContent = item.username;
            biography.textContent = item.biography;
            rating.textContent = item.rating;
            allTutors.append(card);
            return { username: item.username, biography: item.biography, rating: item.rating, element: card};
        });
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
}

// Search Tutors
const searchBar = document.querySelector("[data-search]");
searchBar.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    users.forEach(item => {
        const isVisible = item.username.toLowerCase().includes(value);
        item.element.classList.toggle("hide", !isVisible);
    })
})
