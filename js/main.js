import"api.js";


const carouselContainer = document.querySelector(".carousel-container");
const slides = document.querySelectorAll(".carousel-slide");
const prevButton = document.querySelector(".carousel-nav.prev");
const nextButton = document.querySelector(".carousel-nav.next");
const indicators = document.querySelectorAll(".carousel-indicator");

let currentSlide = 0;

function updateCarousel() {
    const offset = -currentSlide * 100;
    carouselContainer.style.transform = `translateX(${offset}%)`;
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

prevButton.addEventListener("click", () => {
    currentSlide = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
    updateCarousel();
});

nextButton.addEventListener("click", () => {
    currentSlide = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
    updateCarousel();
});

indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
        currentSlide = index;
        updateCarousel();
    });
});
