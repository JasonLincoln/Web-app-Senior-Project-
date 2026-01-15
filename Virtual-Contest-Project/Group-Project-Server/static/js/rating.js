// Page Load
let currentUser = [];
const currentPath = window.location.pathname;
const ratingUser = currentPath.substring(14);
const reviewsList = document.getElementById('reviews_list');
const ratingTemplate = document.getElementById('rating-template');
const currentUserEndpoint = '/users/';

getCurrentUserProfilePic().then(profile_url => {
    //After grabbing the user's profile picture, all ratings will be displayed
    showAllRatings(profile_url);
});

//Grabs the logged in user's profile picture for use in
async function getCurrentUserProfilePic(){
    const response = await fetch(currentUserEndpoint);
    if (response.ok) {
        const data = await response.json();
        const profilePic = data.profile_url;
        return profilePic;
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
}

// Displays ratings and places all ratings in an array
async function showAllRatings(profilePic){
    console.log("Getting all users.");

    const currentPath = window.location.pathname;
    const ratingUser = currentPath.substring(14);

    //Grabs ratings for a user's page based on the URL
    const getOtherUserRating = `/ratings/${ratingUser}`;
    const response = await fetch(getOtherUserRating);
    if (response.ok) {
        //Converts the information from the endpoint into JSON
        const data = await response.json();
        console.log("Using rating data for the showAllRatings function.");

        //Creates rating entries and places them on the page and into the array
        ratingArray = data.map(item => {
            console.log("Displaying ratings on page.");
            //Clones the template and grabs the classes within the template's clone
            let rating = ratingTemplate.content.cloneNode(true).children[0];
            const profile_url = rating.querySelector(".review-profile-image");
            const username = rating.querySelector(".review-user-name");
            const comment = rating.querySelector(".review-comment");
            let stars = rating.querySelector(".stars");
            //Changes the values of the clone's classes
            profile_url.src = profilePic;
            username.textContent = item.sender_username;
            comment.textContent = item.feedback_text;
            console.log(item.feedback_rating);
            //Based on the rating, that many stars will be displayed
            for(let i = 0; i < item.feedback_rating; i++)
            {
                const star = Object.assign(document.createElement('i'), { className : "fa-solid fa-star"});
                stars.append(star);
            }
            //Places each rating into the ratings container
            reviewsList.append(rating);
            return { recipient_username: ratingUser, sender_username: item.sender_username, feedback_text: item.feedback_text, rating: item.rating, element: rating};
        });
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
}

// start: Stars

// Selects all elements with the "i" tag and stores them in a NodeList called "stars"
const stars = document.querySelectorAll(".stars i");

// Loops through the "stars" NodeList
stars.forEach((star, index1) => {
    // add an event listener that runs a function when the "click" event is triggered
    star.addEventListener("click", () => {
        // Loops through the "stars" NodeList Again
        stars.forEach((star, index2) => {
            // Add the "active" class to the clicked star and any stars with a lower index
            // and remove the "active" class from any stars with a higher index
            index1 >= index2 ? star.classList.add("active") : star.classList.remove("active");
        });
    });
});

// end: Stars

// Rating functionality

//Grabs the review submission form, and if it is valid, sends the payload into the database using the response endpoint
const submitRating = document.getElementById('send_review');
    if (submitRating) {
        submitRating.addEventListener('submit', async function (event) {
            event.preventDefault();

            const form = event.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            const payload = {
                feedback_text: data.review_text,
                feedback_rating: data.review_rating,
                recipient_username: ratingUser
            };

            try {
                const response = await fetch('/ratings/create_rating', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    console.log("Rating created.");
                    //Refreshes the page to display new ratings
                    window.location.href = `/pages/rating/${ratingUser}`;
                } else {
                    // Handle error
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }