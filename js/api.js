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
    const productContainer = document.querySelector(".product-details"); 
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
        <img src="${product.image?.url || product.image}" 
             alt="${product.image?.alt || product.title}">
        <div class="product-info">
            <div class="product-info__header">
                <h2>${product.title}</h2>
                <button class="share-btn"><i class="fa-solid fa-arrow-up-from-bracket" style="color: #735149;"></i></button>
            </div>
          <p class="product-description">${product.description || "No description available."}</p>
          <p class="product-price">$${product.price?.toFixed(2) || "0.00"}</p>
          <div class="add-to-cart-btn-container">
              <button class="add-to-cart-btn cta">Add to Cart</button>
          </div>
        </div>
        `;

    //Share button functionality//

    const shareButton = productContainer.querySelector(".share-btn");
    const shareURL = `${window.location.origin}/product.html?id=${product.id}`;

      shareButton.addEventListener("click", async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.title,
                    text: `Check out this product: ${product.title}`,
                    url: shareURL,
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareURL);
                alert("Product URL has been copied!");
            } catch (error) {
                console.error("Error copying to clipboard:", error);
                alert("Failed to copy product URL.");
            }
        }
        
    });
    }

    document.addEventListener("DOMContentLoaded", async () => {
      const productId = getProductIdFromUrl();
      if (!productId) return;
    
      const product = await fetchSingleProduct(productId);
    
      const productContainer = document.querySelector(".product-details");
      productContainer.innerHTML = `
        <img src="${product.image.url}" alt="${product.title}">
        <h2>${product.title}</h2>
        <p>${product.description}</p>
        <p>$${product.price}</p>
      `;
    
    
      const reviewsContainer = document.getElementById("customer-review");
      if (product.reviews?.length) {
        reviewsContainer.innerHTML = product.reviews
          .map(
            (r) => `
              <section class="customer-reviews-container">
              <h2>Customer Reviews</h2>
                <div id="customer-review">
                <p class="review-user">${reviews.username || "Anonymous"} ${"★".repeat(r.rating || 0)}</p>
                <p class="review-description">${r.description || ""}</p>
                </div>
              </section>
            `
          )
          .join("");
      } else {
        reviewsContainer.innerHTML = "<p>No reviews yet.</p>";
      }
    });

    return product;
  } catch (error) {
    const productContainer = document.querySelector(".product-details");
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