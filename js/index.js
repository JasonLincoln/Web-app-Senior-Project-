"use strict"

// Slick JS
$('.post-wrapper').slick({
    slidesToShow: 3,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 2000,
    nextArrow: $('.next'),
    prevArrow: $('.prev'),

    responsive: [
    {
        breakpoint: 1200,
        settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
        }
    },
    {
        breakpoint: 1080,
        settings: {
        slidesToShow: 2,
        slidesToScroll: 1
        }
    },
    {
        breakpoint: 840,
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
    let card = $(cardID);
    let element = $(elementID); // card header
    let elementSubtopics = $(elementSubtopicsID); // hidden text context

    card.mouseover(function() {
        elementSubtopics.css("transform", "translate(0%, -100%)");
        element.css("visibility", "hidden");
    })

    card.mouseout(function() {
        elementSubtopics.css("transform", "translate(0%, 100%)");
        element.css("visibility", "visible");
    })
}

hoverEffects("#programming-languages", "#prog-lang-header", "#hidden-prog-lang"); // programming languages
hoverEffects("#computers", "#computers-header", "#hidden-computers"); // computers and info tech
hoverEffects("#math", "#math-header", "#hidden-math"); // math
hoverEffects("#science", "#science-header", "#hidden-science"); // science
hoverEffects("#social-studies", "#social-studies-header", "#hidden-social-studies"); // social studies
hoverEffects("#business", "#business-header", "#hidden-business"); // business
hoverEffects("#life-skills", "#life-skills-header", "#hidden-life-skills"); // life skills
hoverEffects("#languages", "#lang-header", "#hidden-lang"); // foreign languages