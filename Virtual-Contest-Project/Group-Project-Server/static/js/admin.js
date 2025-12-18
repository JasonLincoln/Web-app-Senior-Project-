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


// Get All Skills JS
const allSkills = document.getElementById('allSkills');
const getAllSkillsEndpoint = '/admin/skill';
const allSkillsButton = document.getElementById('allSkillsButton');

allSkillsButton.addEventListener('click', (event) => {
    event.preventDefault();
    fetch(getAllSkillsEndpoint)
    .then(response => response.json)
    .then(data => {
        showAllSkills(data);
    })
})

function showAllSkills(data){
    allSkills.innerHTML = "";
    data.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `ID: ${item.id}, Supercategory: ${item.supercategory}, Subcategory: ${item.subcategory}`;
        allSkills.appendChild(li);
    });
}

// Get Skill By ID JS


// Get All Achievements JS
const allAchievements = document.getElementById('allAchievements');
const getAllAchievementsEndpoint = '/admin/Achievement';
const allAchievementsButton = document.getElementById('allAchievementsButton');

allAchievementsButton.addEventListener('click', (event) => {
    event.preventDefault();
    fetch(getAllAchievementsEndpoint)
    .then(response => response.json)
    .then(data => {
        showAllAchievements(data);
    })
})

function showAllAchievements(data){
    allAchievements.innerHTML = "";
    data.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `ID: ${item.id}, Name: ${item.name}, Description: ${item.description}, Image URL: ${item.img_url}`;
        allAchievements.appendChild(li);
    });
}

// Get Achievements By ID JS


// Get All Messages JS
const allMessages = document.getElementById('allMessages');
const getAllMessagesEndpoint = '/admin/Messages';
const allMessagesButton = document.getElementById('allMessagesButton');

allMessagesButton.addEventListener('click', (event) => {
    event.preventDefault();
    fetch(getAllMessagesEndpoint)
    .then(response => response.json)
    .then(data => {
        showAllMessages(data);
    })
})

function showAllMessages(data){
    allMessages.innerHTML = "";
    data.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `ID: ${item.id}, Name: ${item.name}, Description: ${item.description}, Image URL: ${item.img_url}`;
        allMessages.appendChild(li);
    });
}

// Get Message By ID JS


// Get All Sessions JS
const allSessions = document.getElementById('allSessions');
const getAllSessionsEndpoint = '/admin/Sessions';
const allSessionsButton = document.getElementById('allSessionsButton');

allSessionsButton.addEventListener('click', (event) => {
    event.preventDefault();
    fetch(getAllSessionsEndpoint)
    .then(response => response.json)
    .then(data => {
        showAllSessions(data);
    })
})

function showAllSessions(data){
    allSessions.innerHTML = "";
    data.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `ID: ${item.id}, Name: ${item.name}, Description: ${item.description}, Image URL: ${item.img_url}`;
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

