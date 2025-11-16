//Login Page using mock users
import { mockUsers } from "./mock.js";

function authenticateMockUser(email, password) {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    return user || null;
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (!loginForm) return;

    const emailGroup = document.querySelector("#email").parentElement;
    const passwordGroup = document.querySelector("#password").parentElement;
    
    if (!emailGroup.querySelector(".error-message")) {
        const emailError = document.createElement("div");
        emailError.className = "error-message";
        emailGroup.appendChild(emailError);
    }
    
    if (!passwordGroup.querySelector(".error-message")) {
        const passwordError = document.createElement("div");
        passwordError.className = "error-message";
        passwordGroup.appendChild(passwordError);
    }

    function showLoginError(input, message) {
        const error = input.parentElement.querySelector(".error-message");
        if (error) {
            error.textContent = message;
            error.style.display = "block";
            input.classList.add("error");
        }
    }

    function clearLoginError(input) {
        const error = input.parentElement.querySelector(".error-message");
        if (error) {
            error.textContent = "";
            error.style.display = "none";
            input.classList.remove("error");
        }
    }

    function clearAllLoginErrors() {
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        clearLoginError(emailInput);
        clearLoginError(passwordInput);
    }

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        clearAllLoginErrors();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");

        let hasErrors = false;

        if (!email) {
            showLoginError(emailInput, "Email is required.");
            hasErrors = true;
        }

        if (!password) {
            showLoginError(passwordInput, "Password is required.");
            hasErrors = true;
        }

        if (hasErrors) return;

        const existingMockUser = mockUsers.find(u => u.email === email);

        if (!existingMockUser) {

            showLoginError(emailInput, "Email not found. Redirecting to register...");
            setTimeout(() => {
                window.location.href = "register.html";
            }, 2000);
            return;
        }

        const loggedInUser = authenticateMockUser(email, password);

        if (loggedInUser) {

            localStorage.setItem("user", JSON.stringify(loggedInUser));

            // Show success and redirect
            const successMsg = document.createElement("div");
            successMsg.className = "success-message__login";
            successMsg.textContent = "Login successful! You will be redirected to the homepage.";
            loginForm.appendChild(successMsg);

            setTimeout(() => {
                const returnTo = new URLSearchParams(window.location.search).get("returnTo");
                window.location.href = returnTo || "../index.html";
            }, 3000);

        } else {
            
            showLoginError(passwordInput, "Incorrect password. Please try again.");
        }
    });
});


//Register Page 
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById("registerForm");

    if (!registerForm) return;

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    function showError(input, message) {
        const error = input.parentElement.querySelector(".error-message");
        error.textContent = message;
        error.style.display = "block";
        input.classList.add("error");
    }

    function clearError(input) {
        const error = input.parentElement.querySelector(".error-message");
        error.textContent = "";
        error.style.display = "none";
        input.classList.remove("error");
    }

    function validateName() {
        const name = nameInput.value.trim();
        clearError(nameInput);

        if (!name) return showError(nameInput, "Name is required."), false;
        if (name.length < 2) return showError(nameInput, "Name must be at least 2 characters."), false;

        return true;
    }

    function validateEmail() {
        const email = emailInput.value.trim();
        clearError(emailInput);

        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) return showError(emailInput, "Email is required."), false;
        if (!pattern.test(email)) return showError(emailInput, "Enter a valid email."), false;

        if (mockUsers.some(u => u.email === email)) {
            return showError(emailInput, "This email is already registered. Please login."), false;
        }

        return true;
    }

    function validatePassword() {
        const pw = passwordInput.value;
        clearError(passwordInput);

        if (!pw) return showError(passwordInput, "Password is required."), false;
        if (pw.length < 8) return showError(passwordInput, "Must be at least 8 characters."), false;
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pw)) {
            return showError(passwordInput, "Must include uppercase, lowercase, number.");
        }

        return true;
    }

    function validateConfirmPassword() {
        const pw = passwordInput.value;
        const confirm = confirmPasswordInput.value;
        clearError(confirmPasswordInput);

        if (!confirm) return showError(confirmPasswordInput, "Please confirm your password."), false;

        if (pw !== confirm) {
            return showError(confirmPasswordInput, "Passwords do not match."), false;
        }

        return true;
    }


    nameInput.addEventListener("blur", validateName);
    emailInput.addEventListener("blur", validateEmail);
    passwordInput.addEventListener("blur", validatePassword);
    confirmPasswordInput.addEventListener("blur", validateConfirmPassword);


    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const valid =
            validateName() &
            validateEmail() &
            validatePassword() &
            validateConfirmPassword();

        if (!valid) {
            const firstError = registerForm.querySelector(".error");
            firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
            firstError?.focus();
            return;
        }

        const successMsg = document.getElementsByClassName("success-message")[0];
        successMsg.style.display = "block";
        registerForm.appendChild(successMsg);
        
        registerForm.reset();

        setTimeout(() => {
            window.location.href = "login.html";
        }, 3000);
    });
});
