document.addEventListener("DOMContentLoaded", () => {
    // Update header based on login status
    updateHeaderForLoginStatus();

    // Display star ratings on page load
    displayStarRatings();
    
    // Hamburger Menu Functionality (works on all pages)
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

// Display star ratings
function displayStarRatings() {
    const starElements = document.querySelectorAll('.stars[data-rating]');
    
    starElements.forEach(starElement => {
        const rating = parseFloat(starElement.getAttribute('data-rating'));
        const ratingPercent = (rating / 5) * 100;
        starElement.style.setProperty('--rating-percent', `${ratingPercent}%`);
    });
}

// Update header icons based on login status
function updateHeaderForLoginStatus() {
    const user = JSON.parse(localStorage.getItem("user"));
    const headerIcons = document.querySelector(".header-icons");
    const mobileIcons = document.querySelector(".mobile-icons");
    
    
}