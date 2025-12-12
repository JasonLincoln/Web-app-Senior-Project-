"use strict"

$(document).ready( () => {

    $("#username").focus();
    validateForm();
    
})

function validateForm()
{
    let isValid = true;
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}\b/;

    // Validate password
    let passwordIsValid = returnPassStatus();
    if (!passwordIsValid) {
        isValid = false;
    } else {
        isValid = true;
    }
    
    // Validation for user and email is done inside this event handler
    $("#signup_form").submit( event => {

        let username = $("#username").val().trim();
        let email = $("#email").val().trim();

        // Validate username
        if (username.length < 4) {
            $("#username").next().text("Usernames cannot be less than 4 characters.");
            isValid = false;
        } else { // Executes if correct
            $("#username").next().text("");
            isValid = true;
        }

        // Validate email
		if ( !emailPattern.test(email) ) {
			$("#email").next().text("Must be a valid email address.");
            isValid = false;
		} else { // Executes if correct
			$("#email").next().text("");
            isValid = true;
		}

        if (isValid == false) {
            event.preventDefault();
        } 
    })
}

function returnPassStatus()
{
    // Boolean for each requirement
    let lengthValid = false;
    let uppercaseValid = false;
    let numSpecialValid = false;
    // Patterns
    const upperCaseLetters = /[A-Z]/g;
    const numbersAndSpecials = /[0-9!@#$%^&*()_\+\-=\[\]{};':"\\|,.<>\/?`~]/g;

    // Triggers everytime a letter is typed or deleted.
    $("#password").on("input", () => {

        // Validate Length
        if ($("#password").val().length >= 8) {
            $("#eightChars").children().first().removeClass("fa-solid fa-xmark").addClass("fa-solid fa-check");
            lengthValid = true;
        } else {
            $("#eightChars").children().first().removeClass("fa-solid fa-check").addClass("fa-solid fa-xmark");
            lengthValid = false;
        }

        // Validate Uppercase Pattern
        if ($("#password").val().match(upperCaseLetters)) {
            $("#uppercaseChar").children().first().removeClass("fa-solid fa-xmark").addClass("fa-solid fa-check");
            uppercaseValid = true;
        } else {
            $("#uppercaseChar").children().first().removeClass("fa-solid fa-check").addClass("fa-solid fa-xmark");
            uppercaseValid = false;
        }

        // Validate Numbers or Special Characters Pattern
        if ($("#password").val().match(numbersAndSpecials)) {
            $("#numSpecial").children().first().removeClass("fa-solid fa-xmark").addClass("fa-solid fa-check");
            numSpecialValid = true;
        } else {
            $("#numSpecial").children().first().removeClass("fa-solid fa-check").addClass("fa-solid fa-xmark");
            numSpecialValid = false;
        }

        if (lengthValid && uppercaseValid && numSpecialValid) {
            return true;
        } 

        return false;
    })
}