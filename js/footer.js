let acc = document.getElementsByClassName("footer-accordion");
let i = 0;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        acc[i].classList.toggle("active");

        let panel = acc[i].nextElementSibling;
        if (panel.style.display === "block") {
        panel.style.display = "none";
        } else {
        panel.style.display = "block";
        }
    });
}
