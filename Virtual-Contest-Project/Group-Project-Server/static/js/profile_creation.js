"use strict";
let loadCarousel = false;
let intervalID = null;
let selectedImage = null;
const currentUserEndpoint = '/users/';

$(document).ready( () => {
    checkRadio(); // for the user to pick the image
    saveUserInput(); // for the user to type the desc
    editCard(); // for the user to click the card customization popup
    clickOut(); // for the user to click out of the card customization
    switchSkillsMode(); // for the user to switch between skills they need and skills they have
});

// function for initializing the slick carousel, activated after the user clicks one of radio boxes
const runSlick = () => {
    const scriptElement = document.createElement("script");
    scriptElement.src = "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js";
    document.body.appendChild(scriptElement);
    
    scriptElement.addEventListener("load", () => {
        // Slick JS
        $('.post-wrapper').slick({
            slidesToShow: 2,
            slidesToScroll: 1,
            nextArrow: $('.next'),
            prevArrow: $('.prev'),

            responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                }
            },
            ]
        });
    });

    loadCarousel = true;
};

// function that runs every 1 second after the user has selected a radio box, it is important that this does not run on pageload
const runContinuously = () => {
    if (loadCarousel) 
        pickImage();
};

// function that checks what radio box the user has selected
const checkRadio = () => {
    const radios = document.getElementsByName("which_category");
    
    // iterate through each radio
    radios.forEach(radio => {
        radio.addEventListener('click', () => { // runs if one of the radio boxes is clicked
            detectWhichCategory(radios); // function for selecting the category
            intervalID = setInterval(runContinuously, 1000);
        });
    });
};

const detectWhichCategory = radios => {
    let selectedValue = null;
    let LIMIT = 10;
    let html = "";

    // go through each radio to see which one was checked
    for (let radio of radios) {
        if (radio.checked) {
            selectedValue = radio.value;
            break;
        }
    }
    
    // Shows the image collection carousel after a radio box is selected and if the carousel has not loaded yet.
    if (!loadCarousel) 
        $(".image-collection").css("visibility", "visible");

    // remove outline if the user picks a different radio box
    $(selectedImage).css("outline", "none");

    // Store each image into the carousel and add them, or change them if the carousel is already loaded.
    for (let i = 0; i < LIMIT; i++) {
        if (!loadCarousel) {
            html = 
            `
            <div class="post">
                <img src='../static/images/gallery_images/${selectedValue}/${selectedValue}${i+1}.png' class="gallery-image" id='image-${i+1}'></img>
            </div>
            `;
            $(".post-wrapper").append(html);
        } else {
            let image = document.querySelector(`#image-${i+1}`);
            image.src = `../static/images/gallery_images/${selectedValue}/${selectedValue}${i+1}.png`;
            selectedImage = image;
        } // end if
    } // end for

    // loads in the carousel javascript when the images have been selected
    if (!loadCarousel)
        runSlick();
};

// function to detect the image the user clicks and store it
const pickImage = () => {

    const images = document.querySelectorAll(".gallery-image");

    images.forEach(image => {
        image.addEventListener('click', () => {
            clearInterval(intervalID);
            // clear any previously selected images of the outline
            for (let i = 0; i < images.length; i++) {
                $(images[i]).css("outline", "none");
            }
            // set current selected image to be outlined
            $(image).css("outline", "5px solid rgba(0, 255, 0, 0.5)");
            selectedImage = image;
            document.querySelector(".selected-image").src = image.src;
        })
    })
};

const saveUserInput = () => {
    $(".about-me-textarea").on("input", () => {
        let descLength = $(".about-me-textarea").val().length;
        $(".characters-left").html(`${150 - descLength}`);
    })

    $(".save-changes-btn").on("click", () => {
        // insert user's biography input into the card for showcase
        let desc = $(".about-me-textarea").val();
        $(".card-desc p").text(desc);
        // insert user's display name into the card for showcase
        let name = $(".display-name").val();
        $(".creator h3").text(name);
    });
};

const editCard = () => {
    $(".open-popup").on("click", () => {
        document.body.classList.add("active-popup");
    });
};

const clickOut = () => {
    $(".close-btn").on("click", () => {
        document.body.classList.remove("active-popup");
    });
};

const switchSkillsMode = () => {
	const btnHave = document.getElementById('toggle-have'); // button for "Skills I Have"
	const btnNeed = document.getElementById('toggle-need'); // button for "Skills To Learn"
	const panelHave = document.getElementById('panel-have'); // panel for "Skills I Have"
	const panelNeed = document.getElementById('panel-need'); // panel for "Skills To Learn"

	const setActive = (type) => {
		if (type === 'have') {
			btnHave.classList.add('active');
			btnNeed.classList.remove('active');
			panelHave.classList.add('active');
			panelNeed.classList.remove('active');
		} else {
			btnHave.classList.remove('active');
			btnNeed.classList.add('active');
			panelHave.classList.remove('active');
			panelNeed.classList.add('active');
		}
	}

	btnHave.addEventListener('click', function (e) {
		e.preventDefault();
		setActive('have');
	});

	btnNeed.addEventListener('click', function (e) {
		e.preventDefault();
		setActive('need');
	});

	// Transform anchors inside the skills-sidebox into checkbox label items for each skill
	const dropdownContainers = document.querySelectorAll('.skills-sidebox .dropdown-links');
	dropdownContainers.forEach(function (container) {
		const anchors = Array.from(container.querySelectorAll('a.link'));
		anchors.forEach(function (a) {
			const text = a.textContent.trim();
			const label = document.createElement('label');
			label.className = 'skill-item';
			label.setAttribute('tabindex', '0');
			label.innerHTML = '<input type="checkbox" class="skill-checkbox" value="' + text + '"> <span class="skill-name">' + text + '</span>';
			a.replaceWith(label);
		});
	});

	// Add event listeners to the newly created skill items
	document.querySelectorAll('.skills-sidebox .skill-item').forEach(function (item) {
		const checkbox = item.querySelector('.skill-checkbox');
		const nameSpan = item.querySelector('.skill-name');
		item.addEventListener('click', function (e) {
			// allow checkbox default toggle; populate textbox with clicked skill
			const text = nameSpan.textContent.trim();
			const activePanel = document.querySelector('.skills-panel.active');
			const isHave = activePanel && activePanel.id === 'panel-have';
			const inputs = Array.from(document.querySelectorAll('.skill-dropdown-textbox'));
			const target = isHave ? inputs[0] : inputs[1];
			if (target) target.value = text;
		});

		checkbox.addEventListener('change', function () {
			item.classList.toggle('selected', checkbox.checked);
		});
	});
};

// Function for switching between tabs; is ran from HTML onclick() 
const tabFunctions = (tabName, event) => {
	let tabContents = document.getElementsByClassName("creation-tabs"); // Get a list of profile tabs
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

async function getCurrentUser(){
    const response = await fetch(currentUserEndpoint);
    if (response.ok) {
        const data = await response.json();
        const currentId = data.id;
        return currentId;
    }
    else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
    }
}

async function getSkill(form, id){
    const skillForm = document.getElementById('user_update');
    if (skillForm) {

        console.log('into second');

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        let payload = '';
        let deleteSkillSubCategory = '';
        let needSkill = '';

        const skills = ['Python', 'Java', 'C++', 'CSharp', 'HTML', 'CSS', 'Javascript', 'SQL', 'Microsoft Word', 'Microsoft Excel', 'Microsoft Powerpoint', 'Networking',
        'Cybersecurity', 'Algebra', 'Statistics', 'Geometry', 'Pre-Calculus', 'Calculus', 'Biology', 'Chemistry', 'Anatomy & Physiology', 'Physics', 'Astrology',
        'Nutrition', 'History', 'Economics', 'Government', 'Geography', 'Accounting', 'Banking & Finance', 'Entrepreneurship', 'Marketing', 'Real Estate', 'Cars',
        'College Admissions', 'Job Applications', 'Social Media', 'Physical Arts', 'Visual Arts', 'Music', 'English', 'Spanish', 'French',
        'PythonNeed', 'JavaNeed', 'C++Need', 'CSharpNeed', 'HTMLNeed', 'CSSNeed', 'JavascriptNeed', 'SQLNeed', 'MicrosoftWordNeed', 'MicrosoftExcelNeed', 'MicrosoftPowerpointNeed',
        'NetworkingNeed', 'CybersecurityNeed', 'AlgebraNeed', 'StatisticsNeed', 'GeometryNeed', 'Pre-CalculusNeed', 'CalculusNeed', 'BiologyNeed', 'ChemistryNeed',
        'Anatomy&PhysiologyNeed', 'PhysicsNeed', 'AstrologyNeed', 'NutritionNeed', 'HistoryNeed', 'EconomicsNeed', 'GovernmentNeed', 'GeographyNeed', 'AccountingNeed',
        'Banking&FinanceNeed', 'EntrepreneurshipNeed', 'MarketingNeed', 'RealEstateNeed', 'CarsNeed', 'CollegeAdmissionsNeed', 'JobApplicationsNeed', 'SocialMediaNeed',
        'PhysicalArtsNeed', 'VisualArtsNeed', 'MusicNeed', 'EnglishNeed', 'SpanishNeed', 'FrenchNeed'];

        console.log('Made array')

        console.log(skills.length)

        try {
            const token = getCookie('access_token');
            console.log(token);
            if (!token) {
                throw new Error('Authentication token not found');
            }

            for (let i = 0; i < skills.length; i++)
            {
                deleteSkillSubCategory = skills[i]

                console.log(payload)

                const response = await fetch(`/skills/skill/${deleteSkillSubCategory}`, {
                method: 'DELETE'
                });
            }

            for (let i = 0; i < skills.length; i++)
            {
                const checkbox = document.getElementById(skills[i]);

                if (checkbox.checked)
                {
                    if (skills[i].includes('Need'))
                    {
                        console.log('include working')

                        needSkill = skills[i].slice(0, -4);

                        payload = {
                            skill_sub_category: needSkill,
                            is_learning: true
                        };

                        console.log(payload)

                        const response = await fetch('/skills/create_userskill', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(payload)
                        });
                    }
                    else
                    {
                        console.log(skills[i])

                        payload = {
                            skill_sub_category: skills[i],
                            is_learning: false
                        };

                        console.log(payload)

                        const response = await fetch('/skills/create_userskill', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(payload)
                        });
                    }
                }
            }

            window.location.href = '/pages/index';

        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };
};

const profileCreationForm = document.getElementById('user_update');
    if (profileCreationForm) {
        profileCreationForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const form = event.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            const payload = {
                display_name: data.display_name,
                pronouns: data.pronouns,
                biography: data.biography,
                profile_url: selectedImage.src
            };

            try {
                const token = getCookie('access_token');
                console.log(token)
                if (!token) {
                    throw new Error('Authentication token not found');
                }

                const response = await fetch('/users/update_user', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    console.log('finished first')
                    getCurrentUser().then(id => {
                        if(id) {
                            setTimeout(getSkill, 50, form, id);
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
    };

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