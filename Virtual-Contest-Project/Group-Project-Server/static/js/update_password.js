"use strict";

// Update Password JS
const updatePassword = document.getElementById('update_password_form');
const validNewPassword = returnPassStatus();
    if (updatePassword && validNewPassword) {
        //After submitting the form, the form data is entered into the database to update a user's password
        updateUser.addEventListener('submit', async function (event) {
            event.preventDefault();

            const form = event.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            const payload = {
                password: data.oldPassword,
                new_password: data.newPassword
            };

            try {
                const response = await fetch(`/users/password`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    console.log("Updated user.")
                } else {
                    // Handle error
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }
    else{
        alert("New password is not valid.");
    }

//Checks if the password is the proper length, contains an uppercase letter, and contains a number or special character
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
    $("#newPassword").on("input", () => {

        // Validate Length
        if ($("#newPassword").val().length >= 8) {
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

//Shows a typed in password
function showPassword()
    {
        const lock = $(".passwordToggle");
        const passInput = $(".password");

        lock.forEach(
            const lock = $(".passwordToggle");
            const passInput = $(".password");

            on("click", () => {
                passInput.focus();
                const type = passInput.attr("type") === "password" ? "text" : "password";
                passInput.attr("type", type);

                if (lock.attr("class") == 'fa-solid fa-lock-open')
                {
                    lock.attr("class", "fa-solid fa-lock");
                }
                else
                {
                    lock.attr("class", "fa-solid fa-lock-open");
                }
            })
        )
    }