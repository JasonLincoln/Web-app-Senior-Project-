"use strict"
let runPickImageFnct = false;
let intervalID = null;

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
}

const runContinuously = () => {
    if (runPickImageFnct) 
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
    let LIMIT = 0;

    // go through each radio to see which one was checked
    for (let radio of radios) {
        if (radio.checked) {
            selectedValue = radio.value;
            break;
        }
    }

    // each skill category has a different number of images in the gallery; might change all of them to 10 soon
    switch (selectedValue) {
        case "prog_lang":
        case "computers":
        case "business":
        case "math":
        case "social_studies":
        case "languages":
            LIMIT = 6;
            break;
        case "science":
        case "life_skills":
            LIMIT = 10;
            break;
    }

    // Declarations
    let html = "";

    // Clear any previous images
    $(".post-wrapper").children().html("");
    $(".post-slider").css("visibility", "visible");

    // Store images into an array
    for (let i = 0; i < LIMIT; i++) {
        html = 
        `
        <div class="post">
            <img src="../images/gallery_images/${selectedValue}/${selectedValue}${i+1}.png" alt="" id="image-${i+1}" class="gallery-image"></img>
        </div>
        `
        $(".post-wrapper").append(html);
        console.log(`appended ${i+1} times`);
    }

    runSlick();
    runPickImageFnct = true;
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

