//For testing only - Must change logic 

const users = [];

function createUser(email, password) {
    const newUser = { email, password };
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

// Handle login form submission
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // For demo purposes, create a user if they don't exist
            if (!users.find(u => u.email === email)) {
                createUser(email, password);
            }
            
            const user = loginUser(email, password);
            
            if (user) {
                alert('Login successful!');
                // Redirect to previous page or home
                const returnTo = new URLSearchParams(window.location.search).get('returnTo');
                window.location.href = returnTo || '../index.html';
            } else {
                alert('Invalid credentials');
            }
        });
    }
});