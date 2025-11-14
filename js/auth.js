
//Testing 
const users = [];

// Corrected createUser function
function createUser(name, email, password) {
    const newUser = { name, email, password };
    users.push(newUser);
    return newUser;
}

function loginUser(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        return user;
    }
    return null;
}

function logoutUser() {
    localStorage.removeItem("user");
}

function isUserLoggedIn() {
    return localStorage.getItem("user") !== null;
}

//Login Page
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (!loginForm) return;

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        // Auto-create user for demo (testing only)
        if (!users.find(u => u.email === email)) {
            createUser("Demo User", email, password);
        }

        const user = loginUser(email, password);

        if (user) {
            alert("Login successful!");

            const returnTo = new URLSearchParams(window.location.search).get("returnTo");
            window.location.href = returnTo || "../index.html";

        } else {
            alert("Invalid email or password.");
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

        if (users.some(u => u.email === email)) {
            return showError(emailInput, "This email is already registered."), false;
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

        // Create user 
        createUser(
            nameInput.value.trim(),
            emailInput.value.trim(),
            passwordInput.value.trim()
        );

        alert("Registration successful! Redirecting...");
        registerForm.reset();

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1200);
    });
});
