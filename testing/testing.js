$("#open-popup").on("click", () => {
    document.body.classList.add("active-popup");
})

$(".close-btn").on("click", () => {
    document.body.classList.remove("active-popup");
})

const selectElement = document.getElementById("myDropdown");

selectElement.addEventListener("change", function() {
  const selectedValue = this.value; // 'this' refers to the selectElement
  console.log("New selected value:", selectedValue);
});