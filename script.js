// GET PRODUCTS FROM LOCAL STORAGE

let products = JSON.parse(localStorage.getItem("products")) || [];

let selectedProductId = null;


// SAVE PRODUCTS

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}


// CHANGE PAGES

function showPage(pageName) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.add("hidden");
    });

    document.getElementById(pageName).classList.remove("hidden");

    if (pageName === "buy") {
        displayProducts();
    }

    window.scrollTo(0, 0);
}


// DISPLAY PRODUCTS

function displayProducts() {

    const productList = document.getElementById("productList");

    const search = document.getElementById("searchInput").value.toLowerCase();

    const category = document.getElementById("categoryFilter").value;

    productList.innerHTML = "";

    const filteredProducts = products.filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(search);

        const matchesCategory =
            category === "All" || product.category === category;

        return matchesSearch && matchesCategory;

    });

    if (filteredProducts.length === 0) {

        productList.innerHTML =
            `<p class="no-products">No products available.</p>`;

        return;
    }

    filteredProducts.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        const image = document.createElement("img");
        image.src = product.image || "https://placehold.co/300x170?text=No+Image";
        image.alt = product.name;

        image.onerror = function () {
            this.src = "https://placehold.co/300x170?text=No+Image";
        };

        const name = document.createElement("h3");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.className = "price";
        price.textContent = "₹" + product.price;

        const categoryText = document.createElement("p");
        categoryText.textContent = "Category: " + product.category;

        const description = document.createElement("p");
        description.textContent = product.description;

        const seller = document.createElement("p");
        seller.textContent = "Seller: " + product.seller;

        const buyButton = document.createElement("button");
        buyButton.className = "buy-btn";
        buyButton.textContent = "Buy Now";

        buyButton.addEventListener("click", function () {
            openCheckout(product.id);
        });

        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(price);
        card.appendChild(categoryText);
        card.appendChild(description);
        card.appendChild(seller);
        card.appendChild(buyButton);

        productList.appendChild(card);

    });

}


// SELL PRODUCT

document.getElementById("sellForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const product = {

        id: Date.now(),

        name: document.getElementById("productName").value.trim(),

        price: Number(document.getElementById("productPrice").value),

        category: document.getElementById("productCategory").value,

        description: document.getElementById("productDescription").value.trim(),

        seller: document.getElementById("sellerName").value.trim(),

        image: document.getElementById("productImage").value.trim()

    };

    products.push(product);

    saveProducts();

    document.getElementById("sellMessage").textContent =
        "Product posted successfully!";

    document.getElementById("sellForm").reset();

});


// OPEN CHECKOUT

function openCheckout(productId) {

    const product = products.find(p => p.id === productId);

    if (!product) {
        alert("Product not found.");
        return;
    }

    selectedProductId = productId;

    document.getElementById("checkoutProduct").innerHTML = `
        <h3>${escapeHTML(product.name)}</h3>
        <p>Price: ₹${product.price}</p>
        <p>Seller: ${escapeHTML(product.seller)}</p>
    `;

    showPage("checkout");

}


// ESCAPE HTML TEXT

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];

    });

}


// CONFIRM PURCHASE

document.getElementById("checkoutForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const product = products.find(p => p.id === selectedProductId);

    if (!product) {
        alert("This product is no longer available.");
        showPage("buy");
        return;
    }

    const order = {

        productName: product.name,

        price: product.price,

        buyerName: document.getElementById("buyerName").value,

        buyerPhone: document.getElementById("buyerPhone").value,

        buyerAddress: document.getElementById("buyerAddress").value,

        purchaseDate: new Date().toLocaleString()

    };

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders.push(order);

    localStorage.setItem("orders", JSON.stringify(orders));

    // REMOVE PURCHASED PRODUCT

    products = products.filter(p => p.id !== selectedProductId);

    saveProducts();

    alert("Purchase successful!");

    document.getElementById("checkoutForm").reset();

    selectedProductId = null;

    showPage("buy");

});


// SEARCH PRODUCTS

document.getElementById("searchInput").addEventListener("input", displayProducts);


// FILTER PRODUCTS

document.getElementById("categoryFilter").addEventListener("change", displayProducts);


// INITIAL PAGE

showPage("home");
