document.addEventListener("DOMContentLoaded", () => {

//Cart Summary Update
const cartSummaryContainer = document.getElementById("checkout-cart-item");
const subtotalElement = document.getElementById("subtotal-amount");

const cart = JSON.parse(localStorage.getItem("cart")) || [];

cartSummaryContainer.innerHTML = "";

if (cart.length === 0) {
    cartSummaryContainer.innerHTML = "<p>Your cart is empty.</p>";
    subtotalElement.textContent = "0.00";
}else {
    let subtotal = 0;

    cart.forEach(item => {
        const itemEl = document.createElement("div");
        itemEl.classList.add("checkout-item");
        
        itemEl.innerHTML = `
            <div class="checkout-item-details">
                <img src="${item.image.url}" alt="${item.title}" class="checkout-item-img">
                <div class="checkout-item-info">
                    <p class="product-name">${item.title}</p>
                    <p class="product-quantity">Qty: ${item.quantity}</p>
                </div>
            </div>
            <p class="product-price">$${(item.price * item.quantity).toFixed(2)}</p>
        `;
        cartSummaryContainer.appendChild(itemEl);

        subtotal += item.price * item.quantity;
    });

    subtotalElement.textContent = subtotal.toFixed(2);
}


//Shpping and Payment form validation
    const placeOrderBtn = document.querySelector(".place-order-btn");
    
    if (!placeOrderBtn) return;
    
    const validationPatterns = {
        firstName: {
            pattern: /^[a-zA-ZÀ-ÿ\s]{2,30}$/,
            message: "First name must be 2-30 characters and contain only letters"
        },
        lastName: {
            pattern: /^[a-zA-ZÀ-ÿ\s]{2,30}$/,
            message: "Last name must be 2-30 characters and contain only letters"
        },
        address: {
            pattern: /^.{5,100}$/,
            message: "Address must be between 5-100 characters"
        },
        postNumber: {
            pattern: /^\d{4}$/,
            message: "Post number must be 4 digits"
        },
        city: {
            pattern: /^[a-zA-ZÀ-ÿ\s]{2,50}$/,
            message: "City must be 2-50 characters and contain only letters"
        },
        phoneNumber: {
            pattern: /^[\d\s+()-]{8,15}$/,
            message: "Please enter a valid phone number"
        },
        "name-on-card": {
            pattern: /^[a-zA-ZÀ-ÿ\s]{2,50}$/,
            message: "Name on card must be 2-50 characters and contain only letters"
        },
        "card-number": {
            pattern: /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/,
            message: "Card number must be in format: 1234 5678 9101 1121"
        },
        expiry: {
            pattern: /^(0[1-9]|1[0-2])\/\d{2}$/,
            message: "Expiry date must be in MM/YY format"
        },
        cvv: {
            pattern: /^\d{3,4}$/,
            message: "CVV must be 3-4 digits"
        }
    };

    // Payment Option Selection
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    const cardFields = document.getElementById("credit-card-fields");
    const klarnaSection = document.getElementById("klarna-section");
    const vippsSection = document.getElementById("vipps-section");

    function getSelectedPaymentMethod() {
        const selected = document.querySelector('input[name="payment"]:checked');
        return selected ? selected.value : "card";
    }

    paymentOptions.forEach(radio => {
        radio.addEventListener("change", () => {
            const method = radio.value;
            
            if (method === "card") {
                cardFields.style.display = "block";
                klarnaSection.style.display = "none";
                vippsSection.style.display = "none";
            } else if (method === "klarna") {
                cardFields.style.display = "none";
                klarnaSection.style.display = "block";
                vippsSection.style.display = "none";
            } else if (method === "vipps") {
                cardFields.style.display = "none";
                klarnaSection.style.display = "none";
                vippsSection.style.display = "block";
            }
        });
    });

    //Display error message
    function showError(input, message) {

        const existingError = input.parentNode.querySelector(".error-message");
        if (existingError) {
            existingError.remove();
        }

        
        input.classList.add("error");

        const errorDiv = document.createElement("div");
        errorDiv.className = "error-message";
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    }

    function clearError(input) {
        input.classList.remove("error");
        const errorMessage = input.parentNode.querySelector(".error-message");
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    function validateField(fieldId) {
        const input = document.getElementById(fieldId);
        if (!input) return false;

        const value = input.value.trim();
        const rule = validationPatterns[fieldId];

        clearError(input);


        if (!value) {
            showError(input, "Missing required field");
            return false;
        }

        if (rule && rule.pattern && !rule.pattern.test(value)) {
            showError(input, rule.message);
            return false;
        }

        if (fieldId === "expiry") {
            const [month, year] = value.split('/').map(num => parseInt(num));
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100;
            const currentMonth = currentDate.getMonth() + 1;
            
            if (year < currentYear || (year === currentYear && month < currentMonth)) {
                showError(input, "Card has expired");
                return false;
            }
        }

        return true;
    }


    const allFields = Object.keys(validationPatterns);
    allFields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (input) {
            input.addEventListener("blur", () => validateField(fieldId));
            input.addEventListener("input", () => {
                if (input.classList.contains("error")) {
                    setTimeout(() => validateField(fieldId), 500);
                }
            });
        }
    });

    //Format card number input 
    const cardNumberInput = document.getElementById("card-number")
    
    if (cardNumberInput) {
        cardNumberInput.addEventListener("input", function () {
            
            let value = this.value;
            value = value.replace(/\s/g, ""); 
            value = value.replace(/[^0-9]/g, ""); 
            
            let formatted = "";
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formatted += " ";
                }
                formatted += value[i]
            }
            
            formatted = formatted.substring(0, 19);
            this.value = formatted;
        });
    }

    //Format expiry date input
    const expiryInput = document.getElementById("expiry");
    if (expiryInput) {
        expiryInput.addEventListener("input", function () {

            let value = this.value.replace(/\D/g, "");
            if (value.length >= 2) {
                value = value.substring(0,2) + '/' + value.substring(2,4);
            }
            this.value = value;
        });
    }

    //Shipping and Payment form submission
    placeOrderBtn.addEventListener("click", (e) => {
        e.preventDefault();
        
        const method = getSelectedPaymentMethod();
        let isValid = true;

        const shippingFieldsIds = ["firstName", "lastName", "address", "postNumber", "city", "phoneNumber"];
        const cardFieldsIds = ["name-on-card", "card-number", "expiry", "cvv"];

        // Always validate shipping fields
        for (const fieldId of shippingFieldsIds) {
            if (!validateField(fieldId)) {
                isValid = false;
            }
        }

        // Validate card fields only for card payment method
        if (method === "card") {
            for (const fieldId of cardFieldsIds) {
                if (!validateField(fieldId)) {
                    isValid = false;
                }
            }
        }

        if (!isValid) {
            const firstErrorField = document.querySelector(".error");
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
                firstErrorField.focus();
            }
            return;
        }

        localStorage.removeItem("cart");
        window.location.href = "success.html";
    });
});