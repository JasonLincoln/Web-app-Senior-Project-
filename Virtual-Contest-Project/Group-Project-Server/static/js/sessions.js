//Initializes arrays and elements from the page for later use

let acceptedSessions = [];
let requestedSessions = [];
const upcomingSection = document.getElementById('upcoming-sessions-tab');
const requestedSection = document.getElementById('requested-sessions-tab');
const upcomingTemplate = document.getElementById('upcoming_session');
const requestedTemplate = document.getElementById('requested_session');

//Get logged in user endpoint
const currentUserEndpoint = '/users/';

//If the user has a username, then all upcoming and requested sessions will be shown
getCurrentUser().then(username => {
    if(username) {
        showAcceptedSessions(username);
        showRequestedSessions(username);
    }
});

async function getCurrentUser(){
    const response = await fetch(currentUserEndpoint);
    if (response.ok) {
        //Places the user's username into a variable and returns the variable
        const data = await response.json();
        const currentUsername = data.username;
        return currentUsername;
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
}

//As the page loads, if the user was on the explore page and chose to request a session, that requested username is automatically entered
//The form itself is also consistently being validated once the page is ready
$(document).ready( () => {
    const tutorName = sessionStorage.getItem('tutorName');
    if(tutorName) {
        document.getElementById('withUser').value = tutorName;
        sessionStorage.removeItem('tutorName');
    }
	validateInput();
});

// Function for switching between tabs; is ran from HTML onclick() 
const tabFunctions = (tabName, event) => {
	let tabContents = document.getElementsByClassName("creation-tabs"); // Get a list of profile tabs
	let tabLinks = document.getElementsByClassName("tab-buttons");

	// Loop through each tab and set display to none; the targeted tab will be displayed after this loop
	for (let i = 0; i < tabContents.length; i++) {
		tabContents[i].style.display = "none";
	}

    // Loop through each tab and remove their active-tab class; the targeted tab will be displayed after this loop
	for (let i = 0; i < tabLinks.length; i++) {
		tabLinks[i].className = tabLinks[i].className.replace(" active-tab", "");
	}

	document.getElementById(tabName).style.display = "block"; // display targeted panel
	event.currentTarget.className += " active-tab"; // display targeted tab
}

// Function for 
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
const dropdownOptions = () => {
	document.getElementById("myDropdown").classList.toggle("show");

	// Close the dropdown menu if the user clicks outside of it
	$(".dropbtn").on("click", event => {
		if (!event.target.matches('.dropbtn')) {
			let dropdowns = document.getElementsByClassName("dropdown-content");
			closeDropdown(dropdowns);
		}
	})

	$(".dropdown-tab").on("click", event => {
		let dropdowns = document.getElementsByClassName("dropdown-content");
		let text = event.target.textContent;
		$(".text-input").val(text);
		closeDropdown(dropdowns);
	})
}

// Function for closing the dropdown, used by dropdownOptions()
const closeDropdown = dropdowns => {
	for (let i = 0; i < dropdowns.length; i++) {
		let openDropdown = dropdowns[i];
		if (openDropdown.classList.contains('show')) {
			openDropdown.classList.remove('show');
		}
	}
}

//Grabs all upcoming sessions a user has sent or received
async function showAcceptedSessions(currentUsername){
    console.log("Getting all accepted sessions.");

    const getAcceptedSessions = `/sessions/accepted/${currentUsername}`;

    const response = await fetch(getAcceptedSessions);
    if (response.ok) {
        //Turns the endpoint's data into JSON to be placed in the acceptedSessions array and be displayed on the page
        const data = await response.json();
        console.log("Using acceptedTemplate data for the showAcceptedSessions function.");
        acceptedSessions = data.map(item => {
            console.log("Displaying acceptedTemplates on page.");
            //Clones a template and places elements from the template into variables
            let acceptedTemplate = upcomingTemplate.content.cloneNode(true).children[0];
            const username = acceptedTemplate.querySelector(".template_username");
            const date = acceptedTemplate.querySelector(".template_date");
            const time = acceptedTemplate.querySelector(".template_time");

            //Changes the values shown in the variable elements
            if(currentUsername == item.sender_username)
            {
                username.textContent = item.recipient_username;
            }
            else
            {
                username.textContent = item.sender_username;
            }
            //Converts the PostgreSQL datetime entry into a JS date object and separates the date and time
            const dateObject = new Date(item.session_date);
            date.textContent = dateObject.toLocaleDateString();
            time.textContent = dateObject.toLocaleTimeString();

            //Adds the clone to the upcoming session tab
            upcomingSection.append(acceptedTemplate);
            return { recipient_username: item.recipient_username, sender_username: item.sender_username, accepted: item.accepted, session_date: item.session_date, element: acceptedTemplate};
        });
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
}

//Grabs all requested sessions a user has received
async function showRequestedSessions(currentUsername){
    console.log("Getting all requested sessions.");

    const getRequestedSessions = `/sessions/requested/${currentUsername}`;

    const response = await fetch(getRequestedSessions);
    if (response.ok) {
        //Turns the endpoint's data into JSON to be placed in the acceptedSessions array and be displayed on the page
        const data = await response.json();
        console.log("Using acceptedTemplate data for the showRequestedSessions function.");
        requestedSessions = data.map(item => {
            console.log("Displaying requestedTemplates on page.");
            //Clones a template and places elements from the template into variables
            let unacceptedTemplate = requestedTemplate.content.cloneNode(true).children[0];
            const username = unacceptedTemplate.querySelector(".template_username");
            const date = unacceptedTemplate.querySelector(".template_date");
            const time = unacceptedTemplate.querySelector(".template_time");
            const acceptButton = unacceptedTemplate.querySelector(".accept-session-button");
            const denyButton = unacceptedTemplate.querySelector(".deny-session-button");

            //Changes the values shown in the variable elements
            username.textContent = item.sender_username;

            //Converts the PostgreSQL datetime entry into a JS date object and separates the date and time
            const dateObject = new Date(item.session_date);
            date.textContent = dateObject.toLocaleDateString();
            time.textContent = dateObject.toLocaleTimeString();

            //Adds event listeners for the deny and accept buttons
            acceptButton.addEventListener('click', function(e) {
                e.preventDefault();
                acceptSession(item.id, dateObject, item.recipient_username);
            })
            denyButton.addEventListener('click', function(e) {
                e.preventDefault();
                deleteSession(item.id);
            })

            //Adds the clone to the requested session tab
            requestedSection.append(unacceptedTemplate);
            return { recipient_username: item.recipient_username, sender_username: item.sender_username, accepted: item.accepted, session_date: item.session_date, element: unacceptedTemplate};
        });
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
}

//The function that runs when a session request is denied, deleted the requested session
async function deleteSession(sessionID) {
    try {
        const response = await fetch(`/sessions/delete_session/${sessionID}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log("Deleted session.");
            //Reloads the page after deleting the session
            window.location.href = `/pages/sessions`;
        } else {
            // Handle error
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}

//The function that runs when a session request is accepted, updating the requested session's accepted boolean to true
async function acceptSession(sessionID, dateObject, recipientUsername) {
    //supplies a payload of pre-existing information and changing the accepted boolean to true
    const payload = {
        session_date: dateObject,
        recipient_username: recipientUsername,
        accepted: true
    };

    try {
        const response = await fetch(`/sessions/update_session/${sessionID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log("Accepted session.");
            //Reloads the page after updating the session
            window.location.href = `/pages/sessions`;
        } else {
            // Handle error
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}

// Function for validating the input upon hitting the request button.
const validateInput = () => {
	$(".request-button").on("click", evt => {
		let text = $(".text-input").val(); // grab text content from skill selected
		let isValid = true;
		
		// Checks if the user selected a skill
		if (text == "") {
			alert("You must select a skill before requesting a session!");
			isValid = false;
		}

		if (isValid == false) {
			evt.preventDefault();
		}
		else
		{
            submitSession();
		}
	})
}

//Allows a session to be submitted if the session_request form is filled out and validated
async function submitSession(){
    const requestForm = document.getElementById('session_request');
    if (requestForm) {
        requestForm.addEventListener('submit', async function (event) {
            //Prevents an immediate page refresh
            event.preventDefault();

            //Grabs the data from the form so that it can be sent to the database
            const form = event.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());


            //Turns the time and date entries into a JS Date object
            const sessionDate = new Date(`${data.date} ${data.time}`)

            const payload = {
                recipient_username: data.withUser,
                //Converts the Date object into PostgreSQL format
                session_date: sessionDate.toISOString()
            };

            try {
                const response = await fetch('/sessions/create_session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    console.log("Session requested.");
                    //Resets the form's information and refreshes the page
                    requestForm.reset();
                    window.location.href = `/pages/sessions`;
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
}