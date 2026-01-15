//Messaging Functionality
let chatMessages = [];
let recentChats = [];

//Grabs elements on the page and places them into constants
const chatContent = document.querySelector(".chat-content");
const conversationTemplate = document.getElementById('conversation');
const myConversationItemTemplate = document.getElementById('my-conversation-item');
const otherConversationItemTemplate = document.getElementById('other-conversation-item');
const messageTemplate = document.getElementById('message');

//Sets the endpoint that grabs information from the logged in user
const currentUserEndpoint = '/users/';

//Initializes blank variables for function use
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


// start: Conversation
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
        //Gets the current user's username, creates and displays a conversation, and places all chats from it into the container
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
// end: Conversation

//Grabs the logged in user's username for future use
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

//Creates a conversationTemplate clone that is active and removes the active class from other conversations
async function makeConversation(){
    conversation = conversationTemplate.content.cloneNode(true).children[0];
    document.querySelectorAll('.conversation').forEach(function(i) {
        i.classList.remove('active');
    })
    conversation.classList.add('active');
}

//Displays all messages between the user and others
async function getFullChats(currentUsername){
    console.log("Getting all messages with user.");
    const getFullChatEndpoint = `/messages/${currentUsername}`;
    const response = await fetch(getFullChatEndpoint);

    if (response.ok) {
        //Converts message data into JSON
        const data = await response.json();
        console.log("Using user data for the getFullChat function.");

        //Makes a constant for the message area of a conversation before clearing it of all entries
        const messageArea = conversation.querySelector('.conversation-wrapper');
        messageArea.textContent = "";

        //Each item in the JSON data is placed into an array and displayed on the page
        chatMessages = data.map(item => {
            console.log("Displaying messages on page.");
            let conversationItem = 0;

            //Depending on if the current user is the sender or recipient, the message becomes a myConversationItem or otherConversationItem
            if(item.sender_username == currentUsername)
            {
                conversationItem = myConversationItemTemplate.content.cloneNode(true).children[0];
                talkingToUser = item.recipient_username;
            }
            else
            {
                //Makes the username of who you're talking to be shown at the top of a conversation
                conversationItem = otherConversationItemTemplate.content.cloneNode(true).children[0];
                talkingToUser = item.sender_username;
                const otherUsername = conversation.querySelector('.conversation-user-name');
                otherUsername.textContent = talkingToUser;
            }

            const conversationItemContent = conversationItem.querySelector('.conversation-item-content');

            //Makes a clone of the message template and its children
            const message = messageTemplate.content.cloneNode(true).children[0];
            const username = conversationItem.querySelector(".username");
            const text = message.querySelector(".text");
            const time_sent = message.querySelector(".timeSent");

            //Replaces the text content of message elements based on endpoint data
            username.textContent = item.sender_username;
            text.textContent = item.text;

            //Takes the PostgreSQL datetime and turns it into a JS variable before becoming a local timezone string
            const postgresDatetime = item.time_sent;
            const jsDate = new Date(postgresDatetime);
            const messageTime = jsDate.toLocaleTimeString();
            time_sent.textContent = messageTime;

            //Adds the message to conversationItemContent, then to conversationItem, before being added to the messageArea
            conversationItemContent.append(message);
            conversationItem.append(conversationItemContent);
            messageArea.append(conversationItem);

        });
        //Adds the whole conversation to chatContent
        chatContent.append(conversation);
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }

}

//Checks for any submit on the messages page
document.addEventListener('submit', async function (event) {
    const chatForm = event.target;

    //If the submitted form isn't the send message form, then the function is left
    if (!chatForm.matches('.send_message'))
    {
        return;
    }

    event.preventDefault();

    const formData = new FormData(chatForm);
    const data = Object.fromEntries(formData.entries());

    //The recipient of the message is whichever user was last talked to, and the text entered into the form is what is the message's text
    const payload = {
        recipient_username: talkingToUser,
        text: data.text
    };

    //A message is attempting to be sent to the database through an endpoint
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
            //The messages get redisplayed with the new message added
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