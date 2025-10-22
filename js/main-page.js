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
            infinite: true,
            dots: true
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
        breakpoint: 720,
        settings: {
            slidesToShow: 1,
            slidesToScroll: 1
        }
    }
    ]
});

// Hover & Animation JS

function hoverEffects(elementID, elementSubtopicsID)
{
    let element = $(elementID);
    let elementSubtopics = $(elementSubtopicsID);

    element.mouseover(function() {
        elementSubtopics.css("display", "block");
    })

    element.mouseout(function() {
        elementSubtopics.css("display", "none");
    })
}

hoverEffects("#prog-lang-header", "#hidden-prog-lang"); // programming languages
hoverEffects("#computers-header", "#hidden-computers"); // computers and info tech
hoverEffects("#math-header", "#hidden-math"); // math
hoverEffects("#science-header", "#hidden-science"); // science
hoverEffects("#social-studies-header", "#hidden-social-studies"); // social studies
hoverEffects("#business-header", "#hidden-business"); // business
hoverEffects("#life-skills-header", "#hidden-life-skills"); // life skills
hoverEffects("#foreign-lang-header", "#hidden-foreign-lang"); // foreign languages