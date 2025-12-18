"use strict";
let loadCarousel = false;
let intervalID = null;
let selectedImage = null;

$(document).ready( () => {
    checkRadio(); // for the user to pick the image
    saveUserInput(); // for the user to type the desc
    editCard(); // for the user to click the card customization popup
    clickOut(); // for the user to click out of the card customization
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
                <img src="../images/gallery_images/${selectedValue}/${selectedValue}${i+1}.png" alt="" id="image-${i+1}" class="gallery-image"></img>
            </div>
            `;
            $(".post-wrapper").append(html);
        } else {
            let image = document.querySelector(`#image-${i+1}`);
            (image).src = `../images/gallery_images/${selectedValue}/${selectedValue}${i+1}.png`;
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
    $(".textarea").on("input", () => {
        let descLength = $(".textarea").val().length;
        $(".characters-left").html(`${150 - descLength}`);
    })

    $(".save-changes-btn").on("click", () => {
        let desc = $(".textarea").val();
        $(".card-desc p").text(desc);
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