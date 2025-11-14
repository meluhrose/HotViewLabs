let cart = JSON.parse(localStorage.getItem("cart")) || [];
console.log(cart);

const cartContainer = document.getElementById("cart-item");
const cartContainerSummary = document.getElementById("checkout-summary-container");


function updateCartDisplay(){
    cartContainer.innerHTML = "";

    const checkoutBtn = document.querySelector(".checkout-btn");

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is currently empty.</p><p>Start adding products to your cart!</p>";
        
        if (checkoutBtn) checkoutBtn.style.display = "none";

        updateSubtotal();
        return;

    }
    cart.forEach(item => {
        const itemElement = document.createElement("div");
        
        itemElement.classList.add("cart-item-card");

        const hasDiscount = item.originalPrice && item.originalPrice > item.price;
        
        itemElement.innerHTML = `
            <div class="item-details" data-id="${item.id}">
                <img src="${item.image.url}" alt="${item.title}">
                <p>${item.title}</p>
            </div>
            <div class="item-price">
                ${hasDiscount ? 
                    `<span class="original-price">$${item.originalPrice.toFixed(2)}</span>
                     <span class="discounted-price">$${item.price.toFixed(2)}</span>` : 
                    `$${item.price.toFixed(2)}`
                }
            </div>
            <div class="quantity-selector">
                <button class="quantity-btn minus" aria-label="Decrease quantity">−</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                <button class="quantity-btn plus" aria-label="Increase quantity">+</button>
            </div>
            <div class="item-total">$<span class="item-total-amount">${(item.price * item.quantity).toFixed(2)}</span></div>
            <button class="remove-item-btn">x</button>
        `;
        cartContainer.appendChild(itemElement);



    });

    if (checkoutBtn) checkoutBtn.style.display = "block";
    updateSubtotal();
}
updateCartDisplay();

//Event listeners for remove and quantity buttons//

cartContainer.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-item-btn")) {
        const cartItemElement = event.target.closest(".cart-item-card");
        if (cartItemElement) {
            cartItemElement.remove();
            const productTitle = cartItemElement.querySelector("p").textContent;
            const productIndex = cart.findIndex(item => item.title === productTitle);
            if (productIndex !== -1) {
                cart.splice(productIndex, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartDisplay();
            }
        }
    }
});

cartContainer.addEventListener("click", function(event) {
    if (event.target.classList.contains("quantity-btn")) {
        const isPlus = event.target.classList.contains("plus");
        const cartItemElement = event.target.closest(".cart-item-card");
        if (cartItemElement) {
            const productTitle = cartItemElement.querySelector("p").textContent;
            const productIndex = cart.findIndex(item => item.title === productTitle);
            if (productIndex !== -1) {
                let currentQuantity = cart[productIndex].quantity;
                currentQuantity = isPlus ? currentQuantity + 1 : Math.max(1, currentQuantity - 1);
                cart[productIndex].quantity = currentQuantity;
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartDisplay();
            }
        }
    }
});

//Updates subtotal amount//

function updateSubtotal() {
    const totalAmountElement = document.getElementById("total-amount");
    if (!totalAmountElement) return;
    
    if (cart.length === 0) {
        totalAmountElement.textContent = "0.00";
        return;
    }

    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    totalAmountElement.textContent = subtotal.toFixed(2);
}

updateSubtotal();
