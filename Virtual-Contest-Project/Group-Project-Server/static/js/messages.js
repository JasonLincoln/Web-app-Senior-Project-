//Messaging Functionality
let chatMessages = [];
let recentChats = [];

const chatContent = document.querySelector(".chat-content");
const conversationTemplate = document.getElementById('conversation');
const myConversationItemTemplate = document.getElementById('my-conversation-item');
const otherConversationItemTemplate = document.getElementById('other-conversation-item');
const messageTemplate = document.getElementById('message');
const currentUserEndpoint = '/users/';
let talkingToUser = "";
let chatForm = 0;

addEventListener("DOMContentLoaded", (event) => {
    getCurrentUser().then(username => {
        if(username) {
            displayRecents(username);
        }
    });
})


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
        getCurrentUser().then(username => {
            if(username) {
                makeConversation();
                getFullChats(username);
            }
        });
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

async function makeConversation(){
    conversation = conversationTemplate.content.cloneNode(true).children[0];
    document.querySelectorAll('.conversation').forEach(function(i) {
        i.classList.remove('active');
    })
    conversation.classList.add('active');
    chatForm = conversation.querySelector('.send_message');
    console.log(chatForm);
}

async function getFullChats(currentUsername){
    console.log("Getting all messages with user.");
    const getFullChatEndpoint = `/messages/${currentUsername}`;
    const response = await fetch(getFullChatEndpoint);

    if (response.ok) {
        const data = await response.json();
        console.log(data);
        console.log("Using user data for the getFullChat function.");

        const messageArea = conversation.querySelector('.conversation-wrapper');
        messageArea.textContent = "";

        chatMessages = data.map(item => {
            console.log("Displaying messages on page.");
            let conversationItem = 0;

            if(item.sender_username == currentUsername)
            {
                conversationItem = myConversationItemTemplate.content.cloneNode(true).children[0];
                talkingToUser = item.recipient_username;
            }
            else
            {
                conversationItem = otherConversationItemTemplate.content.cloneNode(true).children[0];
                talkingToUser = item.sender_username;
                const otherUsername = conversation.querySelector('.conversation-user-name');
                otherUsername.textContent = talkingToUser;
            }

            const conversationItemContent = conversationItem.querySelector('.conversation-item-content');
            const message = messageTemplate.content.cloneNode(true).children[0];
            const username = conversationItem.querySelector(".username");
            const text = message.querySelector(".text");
            const time_sent = message.querySelector(".timeSent");

            username.textContent = item.sender_username;
            text.textContent = item.text;

            const postgresDatetime = item.time_sent;
            const jsDate = new Date(postgresDatetime);
            const messageTime = jsDate.toLocaleTimeString();
            time_sent.textContent = messageTime;

            conversationItemContent.append(message);
            conversationItem.append(conversationItemContent);
            messageArea.append(conversationItem);

        });
        chatContent.append(conversation);
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }

}

document.addEventListener('submit', async function (event) {
    const chatForm = event.target;

    if (!chatForm.matches('.send_message'))
    {
        return;
    }

    event.preventDefault();

    const formData = new FormData(chatForm);
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
            console.log("Making message.");
            getCurrentUser().then(username => {
                if(username) {
                    getFullChats(username);
                }
            });
            } else {
                // Handle error
                const errorData = await response.json();
                alert(`Error: Message cannot be sent.`);
            }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });