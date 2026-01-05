// Get All Users JS
const allUsers = document.getElementById('allUsers');
const getAllUsersEndpoint = '/admin/user';
const allUsersButton = document.getElementById('allUsersButton');

allUsersButton.addEventListener('click', async function (event) {
    event.preventDefault();

    console.log("Getting all users.");

    const response = await fetch(getAllUsersEndpoint);
    if (response.ok) {
        const data = await response.json();
        console.log('hi');
        console.log(data.data);
        console.log("Using user data for the showAllUsers function.");
        showAllUsers(data);
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
})

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
const userByID = document.getElementById('userByID');
const userByIDButton = document.getElementById('userByIDButton');

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
const allSkills = document.getElementById('allSkills');
const getAllSkillsEndpoint = '/admin/skill';
const allSkillsButton = document.getElementById('allSkillsButton');

allSkillsButton.addEventListener('click', async function (event) {
    event.preventDefault();

    console.log("Getting all users.");

    const response = await fetch(getAllSkillsEndpoint);
    if (response.ok) {
        const data = await response.json();
        console.log('hi');
        console.log(data.data);
        console.log("Using user data for the showAllSkills function.");
        showAllSkills(data);
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
})

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
const skillByID = document.getElementById('skillByID');
const skillByIDButton = document.getElementById('skillByIDButton');

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
const allMessages = document.getElementById('allMessages');
const getAllMessagesEndpoint = '/admin/Messages';
const allMessagesButton = document.getElementById('allMessagesButton');

allMessagesButton.addEventListener('click', async function (event) {
    event.preventDefault();

    console.log("Getting all messages.");

    const response = await fetch(getAllMessagesEndpoint);
    if (response.ok) {
        const data = await response.json();
        console.log('hi');
        console.log(data.data);
        console.log("Using message data for the showAllMessages function.");
        showAllMessages(data);
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
})

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
const messageByID = document.getElementById('messageByID');
const messageByIDButton = document.getElementById('messageByIDButton');

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
const allSessions = document.getElementById('allSessions');
const getAllSessionsEndpoint = '/admin/Sessions';
const allSessionsButton = document.getElementById('allSessionsButton');

allSessionsButton.addEventListener('click', async function (event) {
    event.preventDefault();

    console.log("Getting all sessions.");

    const response = await fetch(getAllSessionsEndpoint);
    if (response.ok) {
        const data = await response.json();
        console.log('hi');
        console.log(data.data);
        console.log("Using session data for the showAllSessions function.");
        showAllSessions(data);
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
})

function showAllSessions(data){
    allSessions.innerHTML = "";
    data.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `ID: ${item.id}, <br>
         Session Date: ${item.session_date} <br> <br>`;
        allSessions.appendChild(li);
    });
}

// Get Session By ID JS
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
    li.innerHTML = `ID: ${data.id}, <br>
         Session Date: ${data.session_date} <br> <br>`;
        sessionByID.appendChild(li);
}

// Create Skill JS
const createSkill = document.getElementById('createSkill');
    if (createSkill) {
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
                    method: 'POST',
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
        updateSkill.addEventListener('submit', async function (event) {
            event.preventDefault();

            const form = event.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            const updateSkillID = data.updateSkillID;

            const payload = {
                super_category: data.updateSuperCategory,
                sub_category: data.updateSubCategory
            };

            try {
                const response = await fetch(`/admin/update_skill/${updateSkillID}`, {
                    method: 'POST',
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


// Delete User By ID


// Delete Skill By ID


// Delete Message By ID

