const API_URL = "https://v2.api.noroff.dev/online-shop";

// Fetch all products from API
async function fetchAllProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("All products fetched:", result);
        return result.data || result;
    } catch (error) {
        console.error("Error fetching all products:", error);
        throw error;
    }
}

// Fetch single product by ID (for product pages)
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

// Single product fetching is handled by product-page.js

//async function fetchSingleProduct() {

    //console.warn("fetchSingleProduct should be called from product-page.js");
    //return null;
//}

// Load featured products for homepage
async function loadFeaturedProducts() {
    try {
        const productGrid = document.querySelector(".product-grid");
        if (!productGrid) {
            console.log("Product grid not found on this page");
            return;
        }

        // Show loading state
        productGrid.innerHTML = '<div class="loading">Loading products...</div>';

        const products = await fetchAllProducts();
        
        if (products && products.length > 0) {
            // Take first 12 products as featured
            const featuredProducts = products.slice(0, 12);
            
            productGrid.innerHTML = featuredProducts.map(product => `
                <a href="product.html?id=${product.id}" class="product-card">
                <div class="product-info">
                    <img src="${product.image?.url || product.image}" 
                         alt="${product.image?.alt || product.title}">
            <div class="product-header">
                         <h3>${product.title || 'Product Name'}</h3>
                    <p class="product-card_rating">${product.rating || 'N/A'}<i class="fa-solid fa-star" style="color: #735149;"></i></p>
                    </div>
                    <p class="product-price">$${product.price || 'N/A'}</p>
                </div>
                </a>
            `).join('');
        } else {
            productGrid.innerHTML = '<p>No products available</p>';
        }
    } catch (error) {
        console.error("Error loading featured products:", error);
        const productGrid = document.querySelector(".product-grid");
        if (productGrid) {
            productGrid.innerHTML = '<p>Failed to load products</p>';
        }
    }
}

// Load latest products for carousel
async function loadCarouselProducts() {
    try {
        const products = await fetchAllProducts();
        
        if (products && products.length >= 3) {
            const carouselProducts = products.slice(0, 3);
            replaceCarouselContent(carouselProducts);
        }
    } catch (error) {
        console.error("Error loading carousel products:", error);
    }
}


// Replace carousel content with dynamic product data
function replaceCarouselContent(products) {
    const carouselContainer = document.querySelector(".carousel-container");
    if (!carouselContainer) return;

    const carouselTexts = [
        "Elevate Your Hair Game",
        "New Arrivals", 
        "Latest In Tech"
    ];

    // Create new carousel slides with product data
    const newCarouselHTML = products.map((product, index) => `
        <div class="carousel-slide">
            <img src="${product.image?.url || product.image || `assets/carousel-image-${index + 1}.jpg`}" 
                 alt="${product.image?.alt || product.title || 'Product Image'}">
            <div class="carousel-content">
                <p class="carousel-image_text-${index + 1}">${carouselTexts[index] || 'Featured Product'}</p>
                <a href="product.html?id=${product.id}">
                    <button class="shop-now cta">Shop Now</button>
                </a>
            </div>
        </div>
    `).join('');

    carouselContainer.innerHTML = newCarouselHTML;
}


document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("product.html")) {
        fetchSingleProduct();
    } else if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
        loadFeaturedProducts();
        loadCarouselProducts();
    }
});