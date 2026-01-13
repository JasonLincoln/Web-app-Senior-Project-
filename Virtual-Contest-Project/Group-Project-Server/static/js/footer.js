//If the user's screen is too small, the footer becomes an accordion

let footerAcc = document.getElementsByClassName("footer-accordion");

//Clicking on a closed footer accordion element expands the information in it, and clicking an open one closes it
for (let i = 0; i < footerAcc.length; i++) {
    footerAcc[i].addEventListener("click", function() {
        this.classList.toggle("active-footer");

        let panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}
