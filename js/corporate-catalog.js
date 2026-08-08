const catalogSearchInput = document.getElementById("productSearch");
const catalogSortSelect = document.getElementById("sortProducts");
const corporateGrid = document.getElementById("corporateGrid");
const noResults = document.getElementById("noResults");
const bestSellersBtn = document.getElementById("bestSellersBtn");

let currentProducts = [...corporateProducts];

function displayProducts(productList) {

    corporateGrid.innerHTML = "";

    if (productList.length === 0) {

        if (noResults) noResults.style.display = "block";
        return;

    }

    if (noResults) noResults.style.display = "none";

    productList.forEach(product => {

        corporateGrid.innerHTML += `
            <a href="product.html?id=${product.id}" class="product-card">

                <img
                    src="${product.images[0]}"
                    alt="${product.name}"
                    loading="lazy"
                >

                <div class="product-info">

                    <h3>${product.name}</h3>

                    <p class="product-price">
                        ₱${product.price.toLocaleString()}
                    </p>

                </div>

            </a>
        `;

    });

}

displayProducts(currentProducts);

/* ==========================
   SEARCH
========================== */

if (catalogSearchInput) {

    catalogSearchInput.addEventListener("input", () => {

        const keyword = catalogSearchInput.value
            .toLowerCase()
            .trim();

        const filtered = currentProducts.filter(product =>

            product.name.toLowerCase().includes(keyword) ||

            product.keywords.some(keywordItem =>
                keywordItem.toLowerCase().includes(keyword)
            )

        );

        displayProducts(filtered);

    });

}

/* ==========================
   SORT
========================== */

if (catalogSortSelect) {

    catalogSortSelect.addEventListener("change", () => {

        let sorted = [...currentProducts];

        switch (catalogSortSelect.value) {

            case "price-low":
                sorted.sort((a, b) => a.price - b.price);
                break;

            case "price-high":
                sorted.sort((a, b) => b.price - a.price);
                break;

            default:
                sorted = [...currentProducts];
                break;

        }

        displayProducts(sorted);

    });

}

/* ==========================
   BEST SELLERS
========================== */

if (bestSellersBtn) {

    bestSellersBtn.addEventListener("click", () => {

        displayProducts(
            currentProducts.filter(product => product.bestseller)
        );

    });

}