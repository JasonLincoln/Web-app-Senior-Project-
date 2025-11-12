"use strict"
let loadCarousel = false;
let intervalID = null;
let image = [];
let imageCollection = [];

$(document).ready( () => {
    checkRadio(); // for the user to pick the image
    saveUserInput(); // for the user to type the desc
})

const runSlick = () => {
    const scriptElement = document.createElement("script");
    scriptElement.src = "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js";
    document.body.appendChild(scriptElement);
    
    scriptElement.addEventListener("load", () => {
        // Slick JS
        $('.post-wrapper').slick({
            slidesToShow: 2,
            slidesToScroll: 1,
            autoplay: false,
            autoplaySpeed: 2000,
            nextArrow: $('.next'),
            prevArrow: $('.prev'),
        });
    })

    loadCarousel = true;
}

const runContinuously = () => {
    if (loadCarousel) 
        pickImage();
    
}

const checkRadio = () => {
    const radios = document.getElementsByName("which_category");
    
    radios.forEach(radio => {
        radio.addEventListener('click', () => {
            detectWhichCategory(radios);
            intervalID = setInterval(runContinuously, 1000);
        })
    })
}

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

    // Clear any previous images
    // $(".post-wrapper").children().html("");
    $("#image-collection").css("visibility", "visible");

    // Store each image into the carousel, or change them if the carousel is already loaded.
    for (let i = 0; i < LIMIT; i++) {
        if (!loadCarousel) {
            html = 
            `
            <div class="post">
                <img src="../images/gallery_images/${selectedValue}/${selectedValue}${i+1}.png" alt="" id="image-${i+1}" class="gallery-image"></img>
            </div>
            `
            $(".post-wrapper").append(html);

            image[i] = document.querySelector(`#image-${i+1}`);
            imageCollection[i] = document.querySelector(`#image-${i+1}`).src;
        } else {
            console.log(imageCollection[i]);
            console.log(image[i]);
            (image[i]).src = imageCollection[i];
            console.log(`ran ${i+1} times`);
        }
        
    }

    // loads in the carousel javascript when the images have been selected
    if (!loadCarousel)
        runSlick();
}

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
            document.getElementById("selected-image").src = image.src;
        })
    })

}

const saveUserInput = () => {
    $("#c-desc").on("input", () => {
        let descLength = $("#c-desc").val().length;
        $("#characters-left").html(`${150 - descLength}`);
    })

    $("#submit").on("click", () => {
        let desc = $("#c-desc").val();
        $(".card-desc").text(desc);
    }) 
}

