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

    // Carousel functionality
    const carouselContainer = document.querySelector(".carousel-container");
    const slides = document.querySelectorAll(".carousel-slide");
    const prevButton = document.querySelector(".carousel-nav__prev");
    const nextButton = document.querySelector(".carousel-nav__next");
    const indicators = document.querySelectorAll(".carousel-indicator");

    //Starts carousel if all required elements exist
    if (!carouselContainer || !slides.length || !prevButton || !nextButton) {
        console.log("Carousel elements not found");
        return;
    }

    console.log("Access to carousel granted", {
        slides: slides.length,
        carouselContainer: carouselContainer,
        buttons: { prev: prevButton, next: nextButton }
    });

    let currentIndex = 0;
    let interval;
    const slideCount = slides.length;

    //Clone first and last slide for infinite looping//
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slideCount - 1].cloneNode(true);
    firstClone.classList.add("clone");
    lastClone.classList.add("clone");

    carouselContainer.appendChild(firstClone);
    carouselContainer.insertBefore(lastClone, carouselContainer.firstChild);
    
    const allSlides = document.querySelectorAll(".carousel-slide");
    const totalSlides = allSlides.length;

    //Set initial position//
    carouselContainer.style.transform = `translateX(-${100}%)`;

    //Update Active indicator//
    function updateIndicators() {
        indicators.forEach((dot, index) => {
            dot.classList.toggle("active", index === getRealIndex());
        });
    }

    function getRealIndex() {
        if (currentIndex === 0) return slideCount - 1;
        if (currentIndex === totalSlides - 1) return 0;
        return currentIndex - 1;
    }

    //Move to slide//
    function moveToSlide(index) {

    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;

    carouselContainer.style.transition = "transform 0.5s ease-in-out";
    carouselContainer.style.transform = `translateX(-${index * 100}%)`;
    currentIndex = index;
}


// Snap loop after animation

carouselContainer.addEventListener("transitionend", () => {
    if (currentIndex < 0 || currentIndex >= totalSlides) return;

    const currentSlide = allSlides[currentIndex];
    if (!currentSlide) return;

    if (currentSlide.classList.contains("clone")) {
        carouselContainer.style.transition = "none";

        if (currentIndex === 0) {
            currentIndex = slideCount;
        } else if (currentIndex === totalSlides - 1) {
            currentIndex = 1;
        }

        // Forces a reflow before resetting the transform
        void carouselContainer.offsetWidth;

        carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    updateIndicators();
});


    //Previous & Next Buttons//
    prevButton.addEventListener("click", () => {
        moveToSlide(currentIndex - 1);
        resetAutoplay();
    });

    nextButton.addEventListener("click", () => {
        moveToSlide(currentIndex + 1);
        resetAutoplay();
    });

    //Indicators controls//
    indicators.forEach((dot,i) => {
        dot.addEventListener("click", () => {
            moveToSlide(i + 1);
            resetAutoplay();
        });
    });

    //Autoplay functionality
    function startAutoplay() {
        interval = setInterval(() => moveToSlide(currentIndex + 1), 3000);
        }

    function stopAutoplay() {
        clearInterval(interval);
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    document.querySelector(".carousel").addEventListener("mouseenter", stopAutoplay);
    document.querySelector(".carousel").addEventListener("mouseleave", startAutoplay);

    // Initialize carousel
    updateIndicators();
    // Enable transitions for subsequent moves
    carouselContainer.style.transition = "transform 0.5s ease-in-out";
    startAutoplay();
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