"use strict"

$(document).ready( () => {
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}\b/;

    $("#username").focus();

    $("#signup_form").submit( event => {

        let isValid = true;
        let username = $("#username").val().trim();
        let email = $("#email").val().trim();
        let password = $("#password").val().trim();

        // Validate username
        if ( username == "" ) {
            $("#username").next().text("This field is required.");
            isValid = false;
        } else if (username.length < 4) {
            $("#username").next().text("Usernames require at least 4 letters.");
            isValid = false;
        } else { // Executes if correct
            $("#username").next().text("");
            $("#username").val(username);
        }

        // Validate email
		if ( !emailPattern.test(email) ) {
			$("#email").next().text("Must be a valid email address.");
            isValid = false;
		} else { // Executes if correct
			$("#email").next().text("");
            $("#email").val(email)
		}

        // Validate password
        if ( password == "" ) {
            $("#password").next().text("This field is required.");
            isValid = false;
        } else if (password.length < 8) {
            $("#password").next().text("Passwords require at least 8 letters.");
            isValid = false;
        } else { // Executes if correct
            $("#password").next().text("");
            $("#password").val(password);
        }

        if (isValid == false) {
            event.preventDefault();
        }

    })
})