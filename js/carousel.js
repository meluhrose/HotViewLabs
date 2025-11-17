async function singleCarouselProduct() {
    try {
        const res = await fetch("https://v2.api.noroff.dev/online-shop");
        const { data } = await res.json();
        
        const latest = data.slice(0, 3);
        const slides = document.querySelectorAll(".carousel-slide");

        latest.forEach((product, index) => {
            if (!slides[index]) return;

            const btn = slides[index].querySelector(".shop-now");
            if (btn && !btn.dataset.productLinked) {
                
                btn.dataset.productLinked = "true";
                // Click event to navigate to product page
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    window.location.href = `product.html?id=${product.id}`;
                });
            }
        });
    } catch (error) {
        console.error("Error loading carousel products:", error);
    }
}

singleCarouselProduct();

// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll(".carousel-slide");
const totalSlides = slides.length;
const carouselContainer = document.querySelector(".carousel-container");

function showSlide(index) {
    if (carouselContainer) {

        const slideWidth = 33.333; 
        const translateX = -(index * slideWidth);
        carouselContainer.style.transform = `translateX(${translateX}%)`;
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
    updateActiveIndicator();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
    updateActiveIndicator();
}



// Navigation button event listeners
const nextBtn = document.querySelector(".carousel-nav__next");
const prevBtn = document.querySelector(".carousel-nav__prev");

if (nextBtn) nextBtn.addEventListener("click", nextSlide);
if (prevBtn) prevBtn.addEventListener("click", prevSlide);

// Indicator event listeners
const indicators = document.querySelectorAll(".carousel-indicator");
indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
        currentSlide = index;
        showSlide(currentSlide);
        updateActiveIndicator();
    });
});

// Function to update active indicator
function updateActiveIndicator() {
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle("active", index === currentSlide);
    });
}

// Initialize carousel
showSlide(currentSlide);
updateActiveIndicator();


setInterval(() => {
    nextSlide();
    updateActiveIndicator();
}, 30000); //Change to 5000 for 5 seconds
