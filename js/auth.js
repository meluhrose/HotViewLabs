const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';

document.addEventListener('DOMContentLoaded', () => {
    const addToCartBtn = document.getElementById('add-to-cart-btn');

    if (isLoggedIn) {
        addToCartBtn.style.display = 'inline-block';
    } else {
        addToCartBtn.style.display = 'none';
    }
});