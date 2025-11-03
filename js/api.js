const API_URL = "https://v2.api.noroff.dev/online-shop";

async function fetchProducts() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }
    return response.json();
}

export { fetchProducts };
