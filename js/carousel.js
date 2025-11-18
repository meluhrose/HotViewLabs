//Infinite Carousel Loop 
const carouselTrack = document.querySelector(".carousel-container");
let slidesArray = [...document.querySelectorAll(".carousel-slide")];

const firstClone = slidesArray[0].cloneNode(true);
const lastClone = slidesArray[slidesArray.length - 1].cloneNode(true);

firstClone.classList.add("clone");
lastClone.classList.add("clone");

carouselTrack.appendChild(firstClone);
carouselTrack.insertBefore(lastClone, slidesArray[0]);

slidesArray = [...document.querySelectorAll(".carousel-slide")];

//Fetch products for carousel
async function singleCarouselProduct() {
    try {
        const res = await fetch("https://v2.api.noroff.dev/online-shop");
        const { data } = await res.json();

        //Specific products for carousel
        const selectedProducts = [
            data[6],
            data[22],
            data[1]
        ];

        const allSlides = document.querySelectorAll(".carousel-slide");

        allSlides.forEach((slide, slideIndex) => {
            const productIndex = (slideIndex - 1 + selectedProducts.length) % selectedProducts.length;

            slide.dataset.productId = selectedProducts[productIndex].id;
        });
    } catch (error) {
        console.error("Error loading carousel products:", error);
    }
}

singleCarouselProduct();

let currentSlide = 1;
let isTransitioning = false;

const totalRealSlides = 3;
const slideWidth = 100 / 3;


//Show slide function
function showSlide(index) {
    const translateX = -(index * slideWidth);

    carouselTrack.style.transition = "transform 0.5s ease-in-out";
    carouselTrack.style.transform = `translateX(${translateX}%)`;

    isTransitioning = true;
}

//Handles snapback after clones
carouselTrack.addEventListener("transitionend", () => {
    if (!isTransitioning) return;

    if (currentSlide === 0) {
        carouselTrack.style.transition = "none";
        currentSlide = totalRealSlides;
        carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
    }

    if (currentSlide === totalRealSlides + 1) {
        carouselTrack.style.transition = "none";
        currentSlide = 1;
        carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
    }
    isTransitioning = false;
});

//Navigation functions
function nextSlide() {
    if (isTransitioning) return;
    currentSlide++;
    showSlide(currentSlide);
    updateActiveIndicator();
}

function prevSlide() {
    if (isTransitioning) return;
    currentSlide--;
    showSlide(currentSlide);
    updateActiveIndicator();
}


// Previous and Next Button
const nextBtn = document.querySelector(".carousel-nav__next");
const prevBtn = document.querySelector(".carousel-nav__prev");

if (nextBtn) nextBtn.addEventListener("click", nextSlide);
if (prevBtn) prevBtn.addEventListener("click", prevSlide);

// Indicator event listeners
const indicators = document.querySelectorAll(".carousel-indicator");

indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
        currentSlide = index + 1;
        showSlide(currentSlide);
        updateActiveIndicator();
    });
});

function updateActiveIndicator() {
    indicators.forEach((indicator, index) => {
        const realIndex = (currentSlide - 1 + totalRealSlides) % totalRealSlides;
        indicator.classList.toggle("active", index === realIndex);
    });
}

document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("shop-now")) return;

    e.preventDefault();

    const slide = e.target.closest(".carousel-slide");
    const productId = slide.dataset.productId;
    
    if (productId) {
        window.location.href = `product.html?id=${productId}`;
    }
});

// Initialize carousel
showSlide(currentSlide);
updateActiveIndicator();


setInterval(() => {
    nextSlide();
}, 5000);
