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

//I don't know what the hell I'm doing with this function

//const userByID = document.getElementById('getUserByID');
//    if (userByID) {
//        userByID.addEventListener('submit', async function (event) {
//            event.preventDefault();
//
//            const form = event.target;
//            const formData = new FormData(form);
//            const data = Object.fromEntries(formData.entries());
//
//            const payload = {id: data.id};
//
//            try {
//                const response = await fetch(`/admin/by_id/${payload}`, {
//                    method: 'GET',
//                    headers: {
//                        'Content-Type': 'application/json'
//                    },
//                    body: JSON.stringify(payload)
//                });
//
//                if (response.ok) {
//                    showUserByID()
//                } else {
//                    // Handle error
//                    const errorData = await response.json();
//                    alert(`Error: ${errorData.message}`);
//                }
//            } catch (error) {
//                console.error('Error:', error);
//                alert('An error occurred. Please try again.');
//            }
//        });
//    }

function showUserByID(data){
    allUsers.innerHTML = "";
    console.log("Displaying user on page.");
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


// Get All Achievements JS
const allAchievements = document.getElementById('allAchievements');
const getAllAchievementsEndpoint = '/admin/Achievement';
const allAchievementsButton = document.getElementById('allAchievementsButton');

allAchievementsButton.addEventListener('click', async function (event) {
    event.preventDefault();

    console.log("Getting all achievements.");

    const response = await fetch(getAllAchievementsEndpoint);
    if (response.ok) {
        const data = await response.json();
        console.log('hi');
        console.log(data.data);
        console.log("Using achievement data for the showAllAchievements function.");
        showAllAchievements(data);
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
})

function showAllAchievements(data){
    allAchievements.innerHTML = "";
    data.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `ID: ${item.id}, <br>
        Name: ${item.name}, <br>
        Description: ${item.description}, <br>
        Image URL: ${item.img_url} <br> <br>`;
        allAchievements.appendChild(li);
    });
}

// Get Achievements By ID JS


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


// Create Skill JS
const createSkill = document.getElementById('createSkill');
    if (createSkill) {
        createSkill.addEventListener('submit', async function (event) {
            event.preventDefault();

            const form = event.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries);

            const payload = {
                subcategory: data.createSubcategory,
                supercategory: data.createSupercategory
            };

            try {
                const response = await fetch('/admin/create_skill', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    alert("Created a skill.");
                    // // Handle success (e.g., redirect to dashboard)
                    // const data = await response.json();
                    // // Delete any cookies available
                    // logout();
                    // // Save token to cookie
                    // document.cookie = `access_token=${data.access_token}; path=/`;
                    // window.location.href = '/users/main-page'; // Change this to your desired redirect page
                } else {
                    // Handle error
                    const errorData = await response.json();
                    alert(`Error: ${errorData.detail}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }

// Create Achievement JS
const createAchievement = document.getElementById('createAchievement');
    if (createAchievement) {
        createAchievement.addEventListener('submit', async function (event) {
            event.preventDefault();

            print('help');

            const form = event.target;
            const formData = new FormData(form);

            const payload = {
                name: data.createAchievementName,
                description: data.createDescription,
                img_url: data.createImageURL
            };

            try {
                const response = await fetch('/admin/create_achievement', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    alert("Created an achievement.");
                    // // Handle success (e.g., redirect to dashboard)
                    // const data = await response.json();
                    // // Delete any cookies available
                    // logout();
                    // // Save token to cookie
                    // document.cookie = `access_token=${data.access_token}; path=/`;
                    // window.location.href = '/users/main-page'; // Change this to your desired redirect page
                } else {
                    // Handle error
                    const errorData = await response.json();
                    alert(`Error: ${errorData.detail}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }

// Update User By ID JS
const updateUser = document.getElementById('updateUser');
    if (updateUser) {
        updateUser.addEventListener('submit', async function (event) {
            event.preventDefault();

            print('help');

            const form = event.target;
            const formData = new FormData(form);

            const payload = {
                subcategory: data.subcategory,
                supercategory: data.supercategory
            };

            try {
                const response = await fetch('/admin/create_skill', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: payload.toString()
                });

                if (response.ok) {
                    alert("Updated a user.");
                    // // Handle success (e.g., redirect to dashboard)
                    // const data = await response.json();
                    // // Delete any cookies available
                    // logout();
                    // // Save token to cookie
                    // document.cookie = `access_token=${data.access_token}; path=/`;
                    // window.location.href = '/users/main-page'; // Change this to your desired redirect page
                } else {
                    // Handle error
                    const errorData = await response.json();
                    alert(`Error: ${errorData.detail}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }

// Update Skill By ID JS
const updateSkill = document.getElementById('updateSkill');
    if (updateSkill) {
        updateSkill.addEventListener('submit', async function (event) {
            event.preventDefault();

            print('help');

            const form = event.target;
            const formData = new FormData(form);

            const payload = {
                subcategory: data.subcategory,
                supercategory: data.supercategory
            };

            try {
                const response = await fetch('/admin/create_skill', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: payload.toString()
                });

                if (response.ok) {
                    alert("Updated a user.");
                    // // Handle success (e.g., redirect to dashboard)
                    // const data = await response.json();
                    // // Delete any cookies available
                    // logout();
                    // // Save token to cookie
                    // document.cookie = `access_token=${data.access_token}; path=/`;
                    // window.location.href = '/users/main-page'; // Change this to your desired redirect page
                } else {
                    // Handle error
                    const errorData = await response.json();
                    alert(`Error: ${errorData.detail}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }

// Update Achievement By ID JS
const updateAchievement = document.getElementById('updateAchievement');
    if (updateAchievement) {
        updateAchievement.addEventListener('submit', async function (event) {
            event.preventDefault();

            print('help');

            const form = event.target;
            const formData = new FormData(form);

            const payload = {
                subcategory: data.subcategory,
                supercategory: data.supercategory
            };

            try {
                const response = await fetch('/admin/create_skill', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: payload.toString()
                });

                if (response.ok) {
                    alert("Updated a user.");
                    // // Handle success (e.g., redirect to dashboard)
                    // const data = await response.json();
                    // // Delete any cookies available
                    // logout();
                    // // Save token to cookie
                    // document.cookie = `access_token=${data.access_token}; path=/`;
                    // window.location.href = '/users/main-page'; // Change this to your desired redirect page
                } else {
                    // Handle error
                    const errorData = await response.json();
                    alert(`Error: ${errorData.detail}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }

// Delete User By ID


// Delete Skill By ID


// Delete Achievement By ID


// Delete Message By ID

