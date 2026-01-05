//Messaging Functionality
let chatMessages = [];

const messageArea = document.querySelector('.conversation-wrapper');
const myConversationItemTemplate = document.getElementById('my-conversation-item');
const otherConversationItemTemplate = document.getElementById('other-conversation-item');
const messageTemplate = document.getElementById('message');
const currentUserEndpoint = '/users/';
let talkingToUser = "";

// start: Sidebar
document.querySelector('.chat-sidebar-profile-toggle').addEventListener('click', function(e) {
    e.preventDefault()
    this.parentElement.classList.toggle('active')
})

document.addEventListener('click', function(e) {
    if(!e.target.matches('.chat-sidebar-profile, .chat-sidebar-profile *')) {
        document.querySelector('.chat-sidebar-profile').classList.remove('active')
    }
})

document.querySelector(".content-clicky").addEventListener('click', function(e) {
    getCurrentUser().then(username => {
        if(username) {
            getFullChats(username);
        }
    });
})
// end: Sidebar


// start: Coversation
document.querySelectorAll('.conversation-item-dropdown-toggle').forEach(function(item) {
    item.addEventListener('click', function(e) {
        e.preventDefault()
        if(this.parentElement.classList.contains('active')) {
            this.parentElement.classList.remove('active')
        } else {
            document.querySelectorAll('.conversation-item-dropdown').forEach(function(i) {
                i.classList.remove('active')
            })
            this.parentElement.classList.add('active')
        }
    })
})

document.addEventListener('click', function(e) {
    if(!e.target.matches('.conversation-item-dropdown, .conversation-item-dropdown *')) {
        document.querySelectorAll('.conversation-item-dropdown').forEach(function(i) {
            i.classList.remove('active')
        })
    }
})

document.querySelectorAll('.conversation-form-input').forEach(function(item) {
    item.addEventListener('input', function() {
        this.rows = this.value.split('\n').length
    })
})

document.querySelectorAll('[data-conversation]').forEach(function(item) {
    item.addEventListener('click', function(e) {
        e.preventDefault()
        document.querySelectorAll('.conversation').forEach(function(i) {
            i.classList.remove('active')
        })
        document.querySelector(this.dataset.conversation).classList.add('active')
    })
})

document.querySelectorAll('.conversation-back').forEach(function(item) {
    item.addEventListener('click', function(e) {
        e.preventDefault()
        this.closest('.conversation').classList.remove('active')
        document.querySelector('.conversation-default').classList.add('active')
    })
})
// end: Coversation

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

async function getFullChats(currentUsername){
    console.log("Getting all messages with user.");
    const getFullChatEndpoint = `/messages/${currentUsername}`;
    const response = await fetch(getFullChatEndpoint);
    if (response.ok) {
        const data = await response.json();
        console.log(data);
        console.log("Using user data for the getFullChat function.");
        messageArea.innerHTML = "";
        chatMessages = data.map(item => {
            console.log("Displaying messages on page.");
            let conversationItem = 0;
            console.log(item.sender_username);
            console.log(currentUsername);
            if(item.sender_username == currentUsername)
            {
                conversationItem = myConversationItemTemplate.content.cloneNode(true).children[0];
                talkingToUser = item.recipient_username;
            }
            else
            {
                conversationItem = otherConversationItemTemplate.content.cloneNode(true).children[0];
                talkingToUser = item.sender_username;
            }
            const conversationItemContent = conversationItem.querySelector('.conversation-item-content');
            const message = messageTemplate.content.cloneNode(true).children[0];
            const username = conversationItem.querySelector(".username");
            const text = message.querySelector(".text");
            const time_sent = message.querySelector(".timeSent");
            const was_read = message.querySelector(".wasRead");

            username.textContent = item.sender_username;
            text.textContent = item.text;

            const postgresDatetime = item.time_sent;
            const jsDate = new Date(postgresDatetime);
            const messageTime = jsDate.toLocaleTimeString();
            time_sent.textContent = messageTime;

            if(item.was_read == false)
            {
                was_read.textContent = "Delivered";
            }
            else
            {
                was_read.textContent = "Read";
            }
            conversationItemContent.append(message);
            console.log(conversationItemContent);
            conversationItem.append(conversationItemContent);
            console.log(conversationItem);
            messageArea.append(conversationItem);
        });
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
}

    const chatForm = document.getElementById('send_message');
    if (chatForm) {
        chatForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const form = event.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            const payload = {
                recipient_username: talkingToUser,
                text: data.text
            };

            try {
                const response = await fetch('/messages/create_message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    getCurrentUser().then(username => {
                        if(username) {
                            getFullChats(username);
                        }
                    });
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