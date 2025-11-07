//customer reviews for Product Page//

import { fetchSingleProduct, getProductIdFromUrl } from "./api.js";

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


  const reviewsContainer = document.getElementById("customer-reviews");
  if (product.reviews?.length) {
    reviewsContainer.innerHTML = product.reviews
      .map(
        (r) => `
          <section class="customer-reviews">
          <h2>Customer Reviews</h2>
            <div id="customer-review">
            <p class="review-user">${r.username || "Anonymous"} ${"★".repeat(r.rating || 0)}</p>
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