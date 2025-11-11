document.addEventListener("DOMContentLoaded", () => {
    const placeOrderBtn = document.getElementByClassName("place-order-btn");

    if (!placeOrderBtn) return;

    placeOrderBtn.addEventListener("click", () => {

        const shippingFields = ["firstName", "lastName", "address", "postNumber", "city", "phoneNumber"];
        for (const field of shippingFields) {
            const input = document.getElementById(field);
            if (!input || !input.value.trim()) {
                alert("Please fill out all shipping information fields.");
                input.focus();
                return;
            }
        }

        const paymentFields = ["name-on-card", "card-number", "expiry", "cvv"];
        for (const field of paymentFields) {
            const input = document.getElementById(field);
            if (!input || !input.value.trim()) {
                alert("Please fill out all payment information fields.");
                input.focus();
                return;
            }
        }


        alert("Payment successful! Redirecting...");
        localStorage.removeItem("cart");
        window.location.href = "success.html";
    });
});
