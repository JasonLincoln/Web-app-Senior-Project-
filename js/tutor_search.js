// Dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    // Skills dropdown
    const skillsDropdown = document.querySelector('.dropdown');
    const skillsButton = skillsDropdown.querySelector('.link');
    const skillsMenu = skillsDropdown.querySelector('.dropdown-menu');
    const skillsInput = document.getElementById('skill-dropdown-textbox');

    // Toggle skills dropdown on button click
    skillsButton.addEventListener('click', function() {
        skillsDropdown.classList.toggle('active');
    });

    // Select skill on link click
    skillsMenu.addEventListener('click', function(e) {
        if (e.target.classList.contains('link')) {
            skillsInput.value = e.target.textContent;
            skillsDropdown.classList.remove('active');
        }
    });

    // Rating dropdown
    const ratingDropdown = document.querySelectorAll('.dropdown')[1]; // second one
    const ratingButton = ratingDropdown.querySelector('.link');
    const ratingMenu = ratingDropdown.querySelector('.dropdown-menu');
    const ratingInput = document.getElementById('rating-dropdown-textbox');

    // Toggle rating dropdown on button click
    ratingButton.addEventListener('click', function() {
        ratingDropdown.classList.toggle('active');
    });

    // Select rating on link click
    ratingMenu.addEventListener('click', function(e) {
        if (e.target.classList.contains('link')) {
            ratingInput.value = e.target.textContent;
            ratingDropdown.classList.remove('active');
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!skillsDropdown.contains(e.target)) {
            skillsDropdown.classList.remove('active');
        }
        if (!ratingDropdown.contains(e.target)) {
            ratingDropdown.classList.remove('active');
        }
    });
});
