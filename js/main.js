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

    //Direct path handling for account pages
    let pathPrefix = "";

if (window.location.pathname.indexOf("/account/") !== -1) {
    pathPrefix = "../";
}

if (user) {
    headerIcons.textContent = "";

    const logoutBtn = document.createElement("button");
    logoutBtn.id = "logout-btn";
    logoutBtn.className = "logout-btn";

    const logoutIcon = document.createElement("img");
    logoutIcon.src = pathPrefix + "assets/log-out-user.png";
    logoutIcon.alt = "Logout icon";
    logoutIcon.title = "Logout";

    logoutBtn.appendChild(logoutIcon);

    const cartLink = document.createElement("a");
    cartLink.href = pathPrefix + "cart.html";

    const cartIcon = document.createElement("img");
    cartIcon.src = pathPrefix + "assets/Shopping-bag.png";
    cartIcon.alt = "Shopping Bag Icon";
    cartIcon.title = "Cart";

    cartLink.appendChild(cartIcon);

    headerIcons.appendChild(logoutBtn);
    headerIcons.appendChild(cartLink);

    // Logout icon for mobile
    if (mobileIcons) {
        mobileIcons.innerHTML = `
            <button id="mobile-logout-btn" class="logout-btn" title="Logout">
                <img src="${pathPrefix}assets/log-out-user.png" alt="Logout icon">
            </button>
            <a href="${pathPrefix}cart.html" title="Cart">
                <img src="${pathPrefix}assets/Shopping-bag.png" alt="Shopping Bag Icon">
            </a>
        `;
    }

    // Add logout functionality
    const mobileLogoutBtn = document.getElementById("mobile-logout-btn");

    function handleLogout() {
        localStorage.removeItem("user");
        localStorage.removeItem("cart");
        window.location.href = `${pathPrefix}index.html`;
    }

    logoutBtn.addEventListener("click", handleLogout);

    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener("click", handleLogout);
    }
} else {
    // Show login icon when user is not logged in
    headerIcons.innerHTML = `
        <a href="${pathPrefix}account/login.html" title="Login"><img src="${pathPrefix}assets/user.png" alt="User profile icon"></a>
        <a href="${pathPrefix}cart.html" title="Cart"><img src="${pathPrefix}assets/Shopping-bag.png" alt="Shopping Bag Icon"></a>
    `;

    if (mobileIcons) {
        mobileIcons.innerHTML = `
            <a href="${pathPrefix}account/login.html" title="Login"><img src="${pathPrefix}assets/user.png" alt="User profile icon"></a>
            <a href="${pathPrefix}cart.html" title="Cart"><img src="${pathPrefix}assets/Shopping-bag.png" alt="Shopping Bag Icon"></a>
        `;
    }
}

}
