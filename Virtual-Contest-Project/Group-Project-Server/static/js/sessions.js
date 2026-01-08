$(document).ready( () => {
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
                    makeUserSession(data.withUser);
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

async function makeUserSession(sessionWithUsername){
    const getOtherUserByUsername = `/user/by_username/${sessionWithUsername}`

    const response = await fetch(getOtherUserByUsername);
    if (response.ok) {
        const data = await response.json();


    }
}