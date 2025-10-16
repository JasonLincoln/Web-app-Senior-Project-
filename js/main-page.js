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

// Hover JS

let example = $(".skill-categories");
let exampleText = $("#hiddenText1")

example.mouseover(function() {
    exampleText.css("display", "block");
});

example.mouseout(function() {
    exampleText.css("display", "none");
})