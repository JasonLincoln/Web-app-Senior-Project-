// start: Stars

// Selects all elements with the "i" tag and stores them in a NodeList called "stars"
const stars = document.querySelectorAll(".stars i");

// Loops through the "stars" NodeList
stars.forEach((star, index1) => {
    // add an event listener that runs a function when the "click" event is triggered
    star.addEventListener("click", () => {
        // Loops through the "stars" NodeList Again
        stars.forEach((star, index2) => {
            // Add the "active" class to the clicked star and any stars with a lower index
            // and remove the "active" class from any stars with a higher index
            index1 >= index2 ? star.classList.add("active") : star.classList.remove("active");
        });
    });
});

// end: Stars

//Rating functionality