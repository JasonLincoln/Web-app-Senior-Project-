// start: Sidebar
document.querySelector('.chat-sidebar-profile-toggle').addEventListener('click', function(e) {
    e.preventDefault()
    this.parentElement.classList.toggle('active')
})

document.addEventListener('click', function(e) {
    if(!e.matches('.chat-sidebar-profile, .chat-sidebar-profile *')) {
        
    }
})
// end: Sidebar