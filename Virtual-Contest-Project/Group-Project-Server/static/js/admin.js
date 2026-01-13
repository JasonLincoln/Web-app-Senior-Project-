// Function for switching between tabs; is ran from HTML onclick() 
const tabFunctions = (tabName, event) => {
	let tabContents = document.getElementsByClassName("admin-tabs"); // Get a list of admin tabs
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

// Get All Users JS

//Initializes constants for future use
const allUsers = document.getElementById('allUsers');
const getAllUsersEndpoint = '/admin/user';
const allUsersButton = document.getElementById('allUsersButton');

//After clicking the allUsersButton, a function displays every user in the database
allUsersButton.addEventListener('click', async function (event) {
    event.preventDefault();

    console.log("Getting all users.");

    const response = await fetch(getAllUsersEndpoint);
    if (response.ok) {
        const data = await response.json();
        console.log("Using user data for the showAllUsers function.");
        showAllUsers(data);
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
})

//Makes a new list item with the following values
function showAllUsers(data){
    allUsers.innerHTML = "";
    data.forEach(item => {
        console.log("Displaying users on page.");
        const li = document.createElement('li');
        li.innerHTML = `ID: ${item.id},<br>
        Username: ${item.username},<br>
        Email: ${item.email}, <br>
        Hashed Password: ${item.hashed_password},<br>
        Display Name: ${item.display_name},<br>
        Pronouns: ${item.pronouns}, <br>
        Gender: ${item.gender},<br>
        Biography: ${item.biography},<br>
        Profile Picture: ${item.profile_url}, <br>
        Role: ${item.role},<br>
        Active: ${item.is_active} <br> <br>`;
        allUsers.appendChild(li);
    });
}

// Get User By ID JS

//Initializes constants for future use
const userByID = document.getElementById('userByID');
const userByIDButton = document.getElementById('userByIDButton');

//Grabs a user by their ID
userByIDButton.addEventListener('click', async function (event) {
    event.preventDefault();

    const userID = $('#getUserID').val();
    const getUserByIDEndpoint = `/admin/by_user_id/${userID}`;

    const response = await fetch(getUserByIDEndpoint);
    if (response.ok) {
        const data = await response.json();
        console.log("Using user data for the showAllUsers function.");
        showUserByID(data);
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
})

//Makes a list item for the user being displayed
function showUserByID(data){
    userByID.innerHTML = "";
    console.log("Displaying user on page.");
    const li = document.createElement('li');
    li.innerHTML = `ID: ${data.id},<br>
        Username: ${data.username},<br>
        Email: ${data.email}, <br>
        Hashed Password: ${data.hashed_password},<br>
        Display Name: ${data.display_name},<br>
        Pronouns: ${data.pronouns}, <br>
        Gender: ${data.gender},<br>
        Biography: ${data.biography},<br>
        Profile Picture: ${data.profile_url}, <br>
        Role: ${data.role},<br>
        Active: ${data.is_active} <br> <br>`;
        userByID.appendChild(li);
}

// Get All Skills JS

//Initializes constants for future use
const allSkills = document.getElementById('allSkills');
const getAllSkillsEndpoint = '/admin/skill';
const allSkillsButton = document.getElementById('allSkillsButton');

//If allSkillsButton is clicked, all skills in the database are displayed
allSkillsButton.addEventListener('click', async function (event) {
    event.preventDefault();

    console.log("Getting all users.");

    const response = await fetch(getAllSkillsEndpoint);
    if (response.ok) {
        const data = await response.json();
        console.log("Using user data for the showAllSkills function.");
        showAllSkills(data);
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
})

//Makes a list item for each skill
function showAllSkills(data){
    allSkills.innerHTML = "";
    data.forEach(item => {
        console.log("Displaying users on page.");
        const li = document.createElement('li');
       li.innerHTML = `ID: ${item.id}, <br>
        Supercategory: ${item.super_category}, <br>
        Subcategory: ${item.sub_category} <br> <br>`;
        allSkills.appendChild(li);
    });
}


// Get Skill By ID JS

//Initializes constants for future use
const skillByID = document.getElementById('skillByID');
const skillByIDButton = document.getElementById('skillByIDButton');

//After clicking the button, the skill id entered is shown
skillByIDButton.addEventListener('click', async function (event) {
    event.preventDefault();

    const skillID = $('#getSkillID').val();
    const getSkillByIDEndpoint = `/admin/by_skill_id/${skillID}`;

    const response = await fetch(getSkillByIDEndpoint);
    if (response.ok) {
        const data = await response.json();
        console.log("Using user data for the showAllUsers function.");
        showSkillByID(data);
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
})

//Makes a list item for the searched skill
function showSkillByID(data){
    skillByID.innerHTML = "";
    console.log("Displaying user on page.");
    const li = document.createElement('li');
    li.innerHTML = `ID: ${data.id}, <br>
        Supercategory: ${data.super_category}, <br>
        Subcategory: ${data.sub_category} <br> <br>`;
        skillByID.appendChild(li);
}

// Get All Messages JS

//Initializes constants for future use
const allMessages = document.getElementById('allMessages');
const getAllMessagesEndpoint = '/admin/Messages';
const allMessagesButton = document.getElementById('allMessagesButton');

//After clicking the button, all messages are displayed in a list
allMessagesButton.addEventListener('click', async function (event) {
    event.preventDefault();

    console.log("Getting all messages.");

    const response = await fetch(getAllMessagesEndpoint);
    if (response.ok) {
        const data = await response.json();
        console.log("Using message data for the showAllMessages function.");
        showAllMessages(data);
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
})

//Creates a list item for every message
function showAllMessages(data){
    allMessages.innerHTML = "";
    data.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `ID: ${item.id}, <br>
        Recipient: ${item.recipient_username}, <br>
        Sender: ${item.sender_username}, <br>
        Text: "${item.text}", <br>
        Time Sent: ${item.time_sent}, <br>
        Read: ${item.was_read} <br> <br>`;
        allMessages.appendChild(li);
    });
}

// Get Message By ID JS

//Initializes constants for future use
const messageByID = document.getElementById('messageByID');
const messageByIDButton = document.getElementById('messageByIDButton');

//After clicking the button, the message with a certain id is displayed
messageByIDButton.addEventListener('click', async function (event) {
    event.preventDefault();

    const messageID = $('#getMessageID').val();
    const getMessageByIDEndpoint = `/admin/by_message_id/${messageID}`;

    const response = await fetch(getMessageByIDEndpoint);
    if (response.ok) {
        const data = await response.json();
        console.log("Using user data for the showAllUsers function.");
        showMessageByID(data);
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
})

//Makes a list item for the searched message
function showMessageByID(data){
    messageByID.innerHTML = "";
    console.log("Displaying user on page.");
    const li = document.createElement('li');
    li.innerHTML = `ID: ${data.id}, <br>
        Recipient: ${data.recipient_username}, <br>
        Sender: ${data.sender_username}, <br>
        Text: "${data.text}", <br>
        Time Sent: ${data.time_sent}, <br>
        Read: ${data.was_read} <br> <br>`;
        messageByID.appendChild(li);
}

// Get All Sessions JS

//Initializes constants for future use
const allSessions = document.getElementById('allSessions');
const getAllSessionsEndpoint = '/admin/Sessions';
const allSessionsButton = document.getElementById('allSessionsButton');

//Grabs all sessions and displays them in a list after button click
allSessionsButton.addEventListener('click', async function (event) {
    event.preventDefault();

    console.log("Getting all sessions.");

    const response = await fetch(getAllSessionsEndpoint);
    if (response.ok) {
        const data = await response.json();
        console.log("Using session data for the showAllSessions function.");
        showAllSessions(data);
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
})

//Makes a list item for each session
function showAllSessions(data){
    allSessions.innerHTML = "";
    data.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `ID: ${item.id}, <br>
         Session Date: ${item.session_date} <br>
         Accepted: ${item.accepted} <br>
         Recipient Username: ${item.recipient_username} <br>
         Sender Username: ${item.sender_username} <br> <br>`;
        allSessions.appendChild(li);
    });
}

// Get Session By ID JS

//Initializes constants for future use
const sessionByID = document.getElementById('sessionByID');
const sessionByIDButton = document.getElementById('sessionByIDButton');

sessionByIDButton.addEventListener('click', async function (event) {
    event.preventDefault();

    const sessionID = $('#getSessionID').val();
    const getSessionByIDEndpoint = `/admin/by_session_id/${sessionID}`;

    const response = await fetch(getSessionByIDEndpoint);
    if (response.ok) {
        const data = await response.json();
        console.log("Using user data for the showAllUsers function.");
        showSessionByID(data);
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
})

function showSessionByID(data){
    sessionByID.innerHTML = "";
    console.log("Displaying user on page.");
    const li = document.createElement('li');
     li.innerHTML = `ID: ${item.id}, <br>
         Session Date: ${item.session_date} <br>
         Accepted: ${item.accepted} <br>
         Recipient Username: ${item.recipient_username} <br>
         Sender Username: ${item.sender_username} <br> <br>`;
    sessionByID.appendChild(li);
}

// Create Skill JS
const createSkill = document.getElementById('createSkill');
    if (createSkill) {
        //After submitting the form, the supercategory and subcategory are entered into the database for a new skill
        createSkill.addEventListener('submit', async function (event) {
            event.preventDefault();

            const form = event.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            const payload = {
                super_category: data.createSuperCategory,
                sub_category: data.createSubCategory
            };

            try {
                const response = await fetch('/admin/create_skill', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    console.log("Submitted new skill.")
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

// Update User By ID JS
const updateUser = document.getElementById('updateUserByID');
    if (updateUser) {
        //After submitting the form, the form data is entered into the database to update a user
        updateUser.addEventListener('submit', async function (event) {
            event.preventDefault();

            const form = event.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            const updateUserID = data.updateUserID;

            const payload = {
                username: data.updateUserUsername,
                display_name: data.updateUserDisplayName,
                pronouns: data.updateUserPronouns,
                gender: data.updateUserGender,
                profile_url: data.updateUserProfileURL,
                biography: data.updateUserBiography,
                rating: data.updateUserRating,
                email: data.updateUserEmail,
                hashed_password: data.updateUserPassword,
                role: data.updateUserRole,
                is_active: data.updateUserIsActive
            };

            try {
                const response = await fetch(`/admin/update_user/${updateUserID}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    console.log("Updated user.")
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

// Update Skill By ID JS
const updateSkill = document.getElementById('updateSkillByID');
    if (updateSkill) {
        //After submitting the form, the form data is entered into the database to update a skill
        updateSkill.addEventListener('submit', async function (event) {
            event.preventDefault();

            const form = event.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            const updateSkillID = data.updateSkillID;

            const payload = {
                super_category: data.updateSkillSuperCategory,
                sub_category: data.updateSkillSubCategory
            };

            try {
                const response = await fetch(`/admin/update_skill/${updateSkillID}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    console.log("Updated skill.")
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

// Update Session By ID
const updateSession = document.getElementById('updateSessionByID');
    if (updateSession) {
        //After submitting the form, the form data is entered into the database to update a session
        updateSession.addEventListener('submit', async function (event) {
            event.preventDefault();

            const form = event.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            const updateSessionID = data.updateSessionID;

            const payload = {
                session_date: data.updateSessionDate
            };

            try {
                const response = await fetch(`/admin/update_session/${updateSessionID}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    console.log("Updated session.")
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

// Delete User By ID
const deleteUser = document.getElementById('deleteUserByID');
    if (deleteUser) {
        //After submitting the form, the user's id is used to delete a user
        deleteUser.addEventListener('submit', async function (event) {
            event.preventDefault();

            const form = event.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            const deleteUserID = data.deleteUserID;

            try {
                const response = await fetch(`/admin/user/${deleteUserID}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    console.log("Deleted User.");
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

// Delete Skill By ID
const deleteSkill = document.getElementById('deleteSkillByID');
    if (deleteSkill) {
        //After submitting the form, the skill's id is used to delete a skill
        deleteSkill.addEventListener('submit', async function (event) {
            event.preventDefault();

            const form = event.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            const deleteSkillID = data.deleteSkillID;

            try {
                const response = await fetch(`/admin/skill/${deleteSkillID}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    console.log("Deleted skill.");
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

// Delete Session By ID
const deleteSession = document.getElementById('deleteSessionByID');
    if (deleteSession) {
        //After submitting the form, the session's id is used to delete a session
        deleteSession.addEventListener('submit', async function (event) {
            event.preventDefault();

            const form = event.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            const deleteSessionID = data.deleteSessionID;

            try {
                const response = await fetch(`/admin/session/${deleteSessionID}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    console.log("Deleted session.");
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

// Delete Message By ID
const deleteMessage = document.getElementById('deleteMessageByID');
    if (deleteMessage) {
        //After submitting the form, the message's id is used to delete a message
        deleteMessage.addEventListener('submit', async function (event) {
            event.preventDefault();

            const form = event.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            const deleteMessageID = data.deleteMessageID;

            try {
                const response = await fetch(`/admin/message/${deleteMessageID}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    console.log("Deleted message.");
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
