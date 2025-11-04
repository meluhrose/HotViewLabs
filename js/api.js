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

async function fetchSingleProduct() {
    try {
        const productContainer = document.getElementById("product-container");
        const productId = getProductIdFromUrl();

        if (!productId) {
            if (productContainer) {
                productContainer.innerHTML = "<p>Product not found.</p>";
            }
            return;
        }

        const response = await fetch(`${API_URL}/${productId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        const product = result.data;

        if (productContainer) {
            productContainer.innerHTML = `
                <div class="product-details">
                    <img src="${product.image?.url || product.image}" 
                         alt="${product.image?.alt || product.title}">
                    <h1>${product.title}</h1>
                    <p class="product-price">$${product.price || '0.00'}</p>
                    <p class="product-rating">Rating: ${product.rating || 'N/A'}</p>
                </div>`;
        }

        return product;
    } catch (error) {
        const productContainer = document.getElementById("product-container");
        if (productContainer) {
            productContainer.innerHTML = "<p>Failed to load product.</p>";
        }
        console.error("Fetch error:", error);
    }
}

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
                    <img src="${product.image?.url || product.image}" 
                         alt="${product.image?.alt || product.title}">
                    <h3>${product.title || 'Product Name'}</h3>
                    <p class="product-card_rating">${product.rating || 'N/A'} ⭐</p>
                    <p class="product-price">$${product.price || 'N/A'}</p>
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
                    <button class="shop-now">Shop Now</button>
                </a>
            </div>
        </div>
    `).join('');

    carouselContainer.innerHTML = newCarouselHTML;
}

// Update carousel with product data (legacy function for compatibility)
function updateCarouselWithProducts(products) {
    const carouselSlides = document.querySelectorAll(".carousel-slide");
    
    products.forEach((product, index) => {
        if (carouselSlides[index]) {
            const slide = carouselSlides[index];
            const link = slide.querySelector("a");
            const img = slide.querySelector("img");
            const shopNowButton = slide.querySelector(".shop-now");

            // Update image
            if (img && product.image) {
                img.src = product.image.url || product.image;
                img.alt = product.image.alt || product.title;
            }
            
            // Update Shop Now button link
            if (link) {
                link.href = `product.html?id=${product.id}`;
            }

            // Add click event to Shop Now button for extra safety
            if (shopNowButton) {
                shopNowButton.addEventListener("click", (e) => {
                    e.preventDefault();
                    window.location.href = `product.html?id=${product.id}`;
                });
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("product.html")) {
        fetchSingleProduct();
    } else if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
        loadFeaturedProducts();
        loadCarouselProducts();
    }
});