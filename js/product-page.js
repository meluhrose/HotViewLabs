// Add product to cart functionality
function addProductToCart(product) {
  try {
    // Get existing cart//
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex > -1) {
      // Increase quantity if product already exists
      cart[existingItemIndex].quantity += 1;
    } else {
      // Add new product to cart
      const hasDiscount = product.discountedPrice && product.discountedPrice < product.price;
      cart.push({
        id: product.id,
        title: product.title,
        price: product.discountedPrice || product.price,
        originalPrice: hasDiscount ? product.price : null,
        image: product.image,
        quantity: 1
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    alert(`${product.title} has been added to your cart!`);
  } catch (error) {
    console.error("Error adding product to cart:", error);
    alert("Failed to add product to cart. Please try again.");
  }
}

// Display star ratings based on customer reviews//
function displayStarRatings() {
  const starElements = document.querySelectorAll('.stars[data-rating]');
  
  starElements.forEach(starElement => {
    const rating = parseFloat(starElement.getAttribute('data-rating'));
    const ratingPercent = (rating / 5) * 100;
    starElement.style.setProperty('--rating-percent', `${ratingPercent}%`);
  });
}

function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function fetchSingleProduct() {
  try {
    const productContainer = document.querySelector(".product-detail-section");
    const productId = getProductIdFromUrl();

    if (!productId) {
      productContainer.innerHTML = "<p>Product not found.</p>";
      return;
    }

    const response = await fetch(`${API_URL}/${productId}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();
    const product = result.data;

    // Calculate discount
    const hasDiscount = product.discountedPrice && product.discountedPrice < product.price;
    const discountPercentage = hasDiscount
      ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
      : 0;

    // Product detail to show discount if available
    productContainer.innerHTML = `
      <img src="${product.image?.url || product.image}" 
           alt="${product.image?.alt || product.title}">
      <div class="product-info">
        <div class="product-info__header">
          <h2>${product.title}</h2>
          <button class="share-btn">
            <i class="fa-solid fa-arrow-up-from-bracket" style="color: #735149;"></i> <p>Share</p>
          </button>
        </div>
        <p class="product-description">${product.description || "No description available."}</p>
        <div class="product-price-container">
          ${
            hasDiscount
              ? `
                <p class="product-price">
                  <span class="original-price" style="text-decoration: line-through; color: #0C0C20;">
                    $${product.price.toFixed(2)}
                  </span>
                  <span class="discounted-price">$${product.discountedPrice.toFixed(2)}</span>
                </p>
              `
              : `<p class="product-price">$${product.price.toFixed(2)}</p>`
          }
        </div>
        <div class="add-to-cart-btn-container">
          <button class="add-to-cart-btn cta">Add to Cart</button>
        </div>
      </div>
    `;

    // Share button functionality
    const shareButton = productContainer.querySelector(".share-btn");
    if (!shareButton) return;
    const shareURL = `${window.location.origin}/product.html?id=${product.id}`;

    shareButton.addEventListener("click", async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: product.title,
            text: `You would love this! Check out "${product.title}" on HotViewLabs. ${shareURL}`,
            url: shareURL,
          });
        } catch (error) {
          console.error("Error sharing:", error);
        }
      } else if (navigator.clipboard) {
        try {
          alert("Link copied to clipboard!");
        } catch (error) {
          console.error("Error copying to clipboard:", error);
        }
      }
    });

    //Add to cart button visible when logged in//
    const addToCartBtn = productContainer.querySelector(".add-to-cart-btn");

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        if (addToCartBtn) {
            addToCartBtn.style.display = "none";
        }
    } else {
        if (addToCartBtn) {
            addToCartBtn.style.display = "block";
            addToCartBtn.addEventListener("click", () => addProductToCart(product));
        }
    }

    //Customer Reviews
    const reviewsContainer = document.getElementById("customer-review-container");
    if (product.reviews && product.reviews.length > 0) {
      reviewsContainer.innerHTML = `
        <h2>Customer Reviews</h2>
        ${product.reviews
          .map(
            (review) => `
              <div class="customer-review">
                <p class="review-user">${review.username || "Anonymous"} <span class="stars" data-rating="${review.rating || 0}"></span></p>
                <p class="review-description">${review.description || ""}</p>
              </div>
            `
          )
          .join("")}
      `;
      
      // Display star ratings 
      displayStarRatings();
    } else {
      reviewsContainer.innerHTML = "<p>No reviews yet. Be the first to review!</p>";
    }

    return product;
  } catch (error) {
    const productContainer = document.querySelector(".product-detail-section");
    if (productContainer) {
      productContainer.innerHTML = "<p>Failed to load product.</p>";
    }
    console.error("Fetch error:", error);
  }
}
