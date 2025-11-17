$("#open-popup").on("click", () => {
    document.body.classList.add("active-popup");
})

$(".close-btn").on("click", () => {
    document.body.classList.remove("active-popup");
})