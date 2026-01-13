// Initializes an endpoint for future use and two empty variables
const baseCurrentUserEndpoint = '/users/';
let registeredUsername = "";
let baseCurrentUser = "";

//Returns the current user's id
async function getCurrentUser(){
    const response = await fetch(baseCurrentUserEndpoint);
    if (response.ok) {
        const data = await response.json();
        const baseCurrentUserID = data.id;
        return baseCurrentUserID;
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
}

// Login JS
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const form = event.target;
            const formData = new FormData(form);

            //Grabs all entered form items and places it inside the payload
            const payload = new URLSearchParams();
            for (const [key, value] of formData.entries()) {
                payload.append(key, value);
            }

            //Attempts to give the user a token to log into other pages
            try {
                const response = await fetch('/auth/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: payload.toString()
                });

                if (response.ok) {
                    // Handle success (e.g., redirect to dashboard)
                    const data = await response.json();
                    // Delete any cookies available
                    logout();
                    // Save token to cookie
                    document.cookie = `access_token=${data.access_token}; path=/`;
                    getCurrentUser().then(baseCurrentUserID => {
                        if(baseCurrentUserID) {
                            logAudit(baseCurrentUserID, baseCurrentUserID, "User",
                                "The user was given an access token that was placed in cookies.",
                                true, "No errors, Successful Audit.");
                        }
                    });
                    window.location.href = '/pages/index'; // Sends the user to the home page
                } else {
                    getCurrentUser().then(baseCurrentUserID => {
                        if(baseCurrentUserID) {
                            logAudit(baseCurrentUserID, baseCurrentUserID, "User",
                                "The user was supposed to be given an access token that was placed in cookies.",
                                false, "Token could not be granted.");
                        }
                    });

                    // Handle error
                    const errorData = await response.json();
                    alert(`Error: ${errorData.detail}`);
                }
            } catch (error) {
                getCurrentUser().then(baseCurrentUserID => {
                    if(baseCurrentUserID) {
                        console.log()
                        logAudit(baseCurrentUserID, baseCurrentUserID, "User",
                            "The user was supposed to be given an access token that was placed in cookies.",
                            false, "Token could not be granted.");
                    }
                });
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }
 // Register JS
    const registerForm = document.getElementById('signup_form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const form = event.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            const payload = {
                email: data.email,
                username: data.username,
                password: data.password
            };

            //Creates a new user based off the payload and if a user with the same email and username doesn't already exist
            try {
                const response = await fetch('/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    //Makes an automated message for the user to grant access to messaging on the messages page
                    registeredUsername = data.username;
                    automatedMessage(registeredUsername);
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

    // Helper function to get a cookie by name
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    function logout() {
        // Get all cookies
        const cookies = document.cookie.split(";");

        // Iterate through all cookies and delete each one
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            // Set the cookie's expiry date to a past date to delete it
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }

        // Redirect to the login page
        window.location.href = '/pages/login';
    };

//If a user just registered, they are sent a message from the admin user DaeTheMyth78 to allow messaging properly
 async function automatedMessage(newUser){
    const payload = {
        recipient_username: newUser,
        text: 'Welcome to SkillSwap! I am Daedalus, one of the lead developers and an admin of the website you are now visiting. I appreciate your registration, and I am excited for you to interact with other users, as well as hopefully develop some new skills along the way.'
    };

    try {
        const response = await fetch('/messages/automated_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            window.location.href = '/pages/login';
        } else {
            // Handle error
            const errorData = await response.json();
            alert(`Error: Message cannot be sent.`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
 }

//Logs an audit for any change made to a database entity
 async function logAudit(baseCurrentUser, entityID, entityAffected, detailsText, successful, errorDetails){
    const payload = {
        user_id: baseCurrentUser,
        entity_id: entityID,
        entity_affected: entityAffected,
        details: detailsText,
        successful_event: successful,
        error_details: errorDetails
    };

    try {
        const response = await fetch('/audits/create_audit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log("Audit created.");
        } else {
            // Handle error
            const errorData = await response.json();
            alert(`Error: Message cannot be sent.`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
 }