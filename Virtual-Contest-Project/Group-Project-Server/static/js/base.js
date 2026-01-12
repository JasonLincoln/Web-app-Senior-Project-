// Initialization
const currentUserEndpoint = '/users/';
let registeredUsername = "";
let currentUser = "";

async function getCurrentUser(){
    const response = await fetch(currentUserEndpoint);
    if (response.ok) {
        const data = await response.json();
        const currentUserID = data.id;
        return currentUserID;
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

            const payload = new URLSearchParams();
            for (const [key, value] of formData.entries()) {
                payload.append(key, value);
            }

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
                    getCurrentUser().then(currentUserID => {
                        if(currentUserID) {
                            logAudit(currentUserID, currentUserID, "User",
                                "The user was given an access token that was placed in cookies.",
                                true, "No errors, Successful Audit.");
                        }
                    });
                    window.location.href = '/pages/index'; // Change this to your desired redirect page
                } else {
                    getCurrentUser().then(currentUserID => {
                        if(currentUserID) {
                            logAudit(currentUserID, currentUserID, "User",
                                "The user was supposed to be given an access token that was placed in cookies.",
                                false, "Token could not be granted.");
                        }
                    });

                    // Handle error
                    const errorData = await response.json();
                    alert(`Error: ${errorData.detail}`);
                }
            } catch (error) {
                getCurrentUser().then(currentUserID => {
                    if(currentUserID) {
                        console.log()
                        logAudit(currentUserID, currentUserID, "User",
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

            try {
                const response = await fetch('/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
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

 async function logAudit(currentUser, entityID, entityAffected, detailsText, successful, errorDetails){
    const payload = {
        user_id: currentUser,
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