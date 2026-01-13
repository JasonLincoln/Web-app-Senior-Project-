let acceptedSessions = [];
let requestedSessions = [];
const upcomingSection = document.getElementById('upcoming-sessions-tab');
const requestedSection = document.getElementById('requested-sessions-tab');
const upcomingTemplate = document.getElementById('upcoming_session');
const requestedTemplate = document.getElementById('requested_session');
const currentUserEndpoint = '/users/';

getCurrentUser().then(username => {
    if(username) {
        showAcceptedSessions(username);
        showRequestedSessions(username);
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

async function showAcceptedSessions(currentUsername){
    console.log("Getting all accepted sessions.");

    const getAcceptedSessions = `/sessions/accepted/${currentUsername}`;

    const response = await fetch(getAcceptedSessions);
    if (response.ok) {
        const data = await response.json();
        console.log("Using acceptedTemplate data for the showAcceptedSessions function.");
        acceptedSessions = data.map(item => {
            console.log("Displaying acceptedTemplates on page.");
            let acceptedTemplate = upcomingTemplate.content.cloneNode(true).children[0];
            const username = acceptedTemplate.querySelector(".template_username");
            const date = acceptedTemplate.querySelector(".template_date");
            const time = acceptedTemplate.querySelector(".template_time");
            if(currentUsername == item.sender_username)
            {
                username.textContent = item.recipient_username;
            }
            else
            {
                username.textContent = item.sender_username;
            }
            const dateObject = new Date(item.session_date);
            date.textContent = dateObject.toLocaleDateString();
            time.textContent = dateObject.toLocaleTimeString();
            upcomingSection.append(acceptedTemplate);
            return { recipient_username: item.recipient_username, sender_username: item.sender_username, accepted: item.accepted, session_date: item.session_date, element: acceptedTemplate};
        });
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
}

async function showRequestedSessions(currentUsername){
    console.log("Getting all requested sessions.");

    const getRequestedSessions = `/sessions/requested/${currentUsername}`;

    const response = await fetch(getRequestedSessions);
    if (response.ok) {
        const data = await response.json();
        console.log("Using acceptedTemplate data for the showRequestedSessions function.");
        requestedSessions = data.map(item => {
            console.log("Displaying requestedTemplates on page.");
            let unacceptedTemplate = requestedTemplate.content.cloneNode(true).children[0];
            const username = unacceptedTemplate.querySelector(".template_username");
            const date = unacceptedTemplate.querySelector(".template_date");
            const time = unacceptedTemplate.querySelector(".template_time");
            const acceptButton = unacceptedTemplate.querySelector(".accept-session-button");
            const denyButton = unacceptedTemplate.querySelector(".deny-session-button");
            
            username.textContent = item.sender_username;
            const dateObject = new Date(item.session_date);
            date.textContent = dateObject.toLocaleDateString();
            time.textContent = dateObject.toLocaleTimeString();
            
            acceptButton.addEventListener('click', function(e) {
                e.preventDefault();
                acceptSession(item.id, dateObject, item.recipient_username);
            })
            denyButton.addEventListener('click', function(e) {
                e.preventDefault();
                deleteSession(item.id);
            })
            
            requestedSection.append(unacceptedTemplate);
            return { recipient_username: item.recipient_username, sender_username: item.sender_username, accepted: item.accepted, session_date: item.session_date, element: unacceptedTemplate};
        });
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
}

async function deleteSession(currentUserID) {
    try {
        const response = await fetch(`/sessions/delete_session/${currentUserID}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log("Deleted session.");
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

async function acceptSession(currentUserID, dateObject, recipientUsername) {
    const payload = {
        session_date: dateObject,
        recipient_username: recipientUsername,
        accepted: true
    };

    try {
        const response = await fetch(`/sessions/update_session/${currentUserID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log("Accepted session.");
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

async function submitSession(){
    const requestForm = document.getElementById('session_request');
    if (requestForm) {
        requestForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const form = event.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());



            const sessionDate = new Date(`${data.date} ${data.time}`)

            const payload = {
                recipient_username: data.withUser,
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