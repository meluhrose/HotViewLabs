document.addEventListener("DOMContentLoaded", () => {
    updateLogInIcon();
    
    // Hamburger Menu Functionality
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (hamburger && mobileMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            mobileMenu.classList.toggle("active");
        });

        // Close menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll("a");
        mobileLinks.forEach((link) => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                mobileMenu.classList.remove("active");
            });
        });

        // Close menu when clicking outside
        document.addEventListener("click", (e) => {
            if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
                hamburger.classList.remove("active");
                mobileMenu.classList.remove("active");
            }
        });
    }
});

// Update header icons based on login status
function updateLogInIcon() {
    const user = JSON.parse(localStorage.getItem("user"));
    const headerIcons = document.querySelector(".header-icons");
    const mobileIcons = document.querySelector(".mobile-icons");

    if (!headerIcons) return;

    if (user) {
        // User is logged in - show logout icon
        headerIcons.innerHTML = `
            <button id="logout-btn" class="logout-btn" aria-label="Logout">
                <img src="assets/log-out-user.png" alt="Logout icon">
            </button>
            <a href="cart.html"><img src="assets/shopping-bag.png" alt="Shopping Bag Icon"></a>
        `;

        if (mobileIcons) {
            mobileIcons.innerHTML = `
                <button id="mobile-logout-btn" class="logout-btn" aria-label="Logout">
                    <img src="assets/log-out-user.png" alt="Logout icon">
                </button>
                <a href="cart.html"><img src="assets/shopping-bag.png" alt="Shopping Bag Icon"></a>
            `;
        }

        // Add logout functionality
        const logoutBtn = document.getElementById("logout-btn");
        const mobileLogoutBtn = document.getElementById("mobile-logout-btn");

        function handleLogout() {
            localStorage.removeItem("user");
            localStorage.removeItem("cart");
            window.location.href = "index.html";
        }

        if (logoutBtn) {
            logoutBtn.addEventListener("click", handleLogout);
        }

        if (mobileLogoutBtn) {
            mobileLogoutBtn.addEventListener("click", handleLogout);
        }
    } else {
        // Show login icon when user is not logged in
        headerIcons.innerHTML = `
            <a href="account/login.html"><img src="assets/user.png" alt="User profile icon"></a>
            <a href="cart.html"><img src="assets/shopping-bag.png" alt="Shopping Bag Icon"></a>
        `;

        if (mobileIcons) {
            mobileIcons.innerHTML = `
                <a href="account/login.html"><img src="assets/user.png" alt="User profile icon"></a>
                <a href="cart.html"><img src="assets/shopping-bag.png" alt="Shopping Bag Icon"></a>
            `;
        }
    }
}
