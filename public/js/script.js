

/** @format */

// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();
document.getElementById("submitBtn").addEventListener("click", function (event) {
  const passwordField = document.getElementById("password");
  const passwordError = document.getElementById("passwordError");
  const password = passwordField.value;

  // Define password validation rules
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[@$!%*?&_+=]/.test(password);

  // Initialize error message
  let errorMessage = "";

  // Validate each condition
  if (password.length < minLength) {
    errorMessage += "Password must be at least 8 characters long.<br>";
  }
  if (!hasUpperCase) {
    errorMessage += "Password must include at least one uppercase letter.<br>";
  }
  if (!hasLowerCase) {
    errorMessage += "Password must include at least one lowercase letter.<br>";
  }
  if (!hasNumber) {
    errorMessage += "Password must include at least one number.<br>";
  }
  if (!hasSpecialChar) {
    errorMessage += "Password must include at least one special character (@, $, !, %, *, ?, &, _, +, =).<br>";
  }

  // Display error or allow form submission
  if (errorMessage) {
    event.preventDefault(); // Prevent form submission
    passwordError.innerHTML = errorMessage; // Display error messages
    passwordField.classList.add("is-invalid"); // Add invalid class to input field
  } else {
    passwordError.innerHTML = ""; // Clear error messages
    passwordField.classList.remove("is-invalid"); // Remove invalid class
    passwordField.classList.add("is-valid"); // Add valid class
  }
});

// Toggle password visibility
document.getElementById("togglePassword").addEventListener("click", function () {
  const passwordField = document.getElementById("password");
  const eyeIcon = document.getElementById("eyeIcon");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    eyeIcon.classList.remove("bi-eye");
    eyeIcon.classList.add("bi-eye-slash");
  } else {
    passwordField.type = "password";
    eyeIcon.classList.remove("bi-eye-slash");
    eyeIcon.classList.add("bi-eye");
  }
});
