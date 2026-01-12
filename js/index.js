"use strict";
// Slick JS - Carousel Settings
$('.post-wrapper').slick({
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplaySpeed: 2000,
    nextArrow: $('.next'),
    prevArrow: $('.prev'),
    // Responsiveness for carousel
    responsive: [
    {
        breakpoint: 1080,
        settings: {
            slidesToShow: 1,
            slidesToScroll: 1
        }
    }
    ]
});

// Hover & Animation JS
function hoverEffects(cardID, elementID, elementSubtopicsID)
{
    let card = $(cardID); // card id
    let element = $(elementID); // card header
    let elementSubtopics = $(elementSubtopicsID); // hidden text context

    // hover state: remove header and bring the subtopics
    card.mouseover( () => {
        elementSubtopics.css("transform", "translate(0%, -100%)");
        element.css("visibility", "hidden");
    });

    // out of hover state: bring the header and remove the subtopics
    card.mouseout( () => {
        elementSubtopics.css("transform", "translate(0%, 100%)");
        element.css("visibility", "visible");
    });
}

hoverEffects("#programming-languages", "#prog-lang-header", "#hidden-prog-lang"); // programming languages
hoverEffects("#computers", "#computers-header", "#hidden-computers"); // computers and info tech
hoverEffects("#math", "#math-header", "#hidden-math"); // math
hoverEffects("#science", "#science-header", "#hidden-science"); // science
hoverEffects("#social-studies", "#social-studies-header", "#hidden-social-studies"); // social studies
hoverEffects("#business", "#business-header", "#hidden-business"); // business
hoverEffects("#life-skills", "#life-skills-header", "#hidden-life-skills"); // life skills
hoverEffects("#languages", "#lang-header", "#hidden-lang"); // foreign languages

// Accordion JS by w3schools
let acc = document.getElementsByClassName("faq-accordion"); // group of accordion tabs

for (let i = 0; i < acc.length; i++) {
    // Detect if an accordion has been clicked
    acc[i].addEventListener("click", () => {
        acc[i].classList.toggle("active-faq");

        let panel = acc[i].nextElementSibling; // panel content
        if (panel.style.maxHeight) { // run if there's content
            panel.style.maxHeight = null;
        } else { // run if there isn't any content
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}

// On click, it will take you to the explore page
$(".card").on("click", () => {
    window.location.href="tutor_search.html"; // takes you the explore page
})