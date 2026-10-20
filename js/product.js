const params = new URLSearchParams(window.location.search);

const id = Number(params.get("id"));

const allProducts = [
    ...weddingProducts,
    ...corporateProducts,
    ...celebrationProducts
];

const product = allProducts.find(p => p.id === id);

if (!product) {

    document.body.innerHTML = "<h2>Product not found.</h2>";

    throw new Error("Product not found.");

}

// ========================================
// GOOGLE ANALYTICS - PRODUCT VIEW
// ========================================

if (typeof gtag === "function") {

    gtag("event", "view_product", {
    product_id: product.id,
    product_name: product.name,
    product_category: product.category,
    price: product.price,
    currency: "PHP"
});

}

const productSlug = product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

    product.images = product.images.map(image => {

    if (!image.startsWith("/")) {
        return "/" + image;
    }

    return image;

});

const cleanUrl =
    `/product/${productSlug}?id=${product.id}`;

if (
    window.location.pathname === "/product"
) {

    window.history.replaceState(
        {},
        "",
        cleanUrl
    );

}

// ===============================
// PRODUCT PAGE METADATA
// ===============================

document.title = `${product.name} | Philia Gifts`;

document
    .querySelector('meta[property="og:title"]')
    ?.setAttribute(
        "content",
        `${product.name} | Philia Gifts`
    );

document
    .querySelector('meta[property="og:description"]')
    ?.setAttribute(
        "content",
        product.description
    );

document
    .querySelector('meta[property="og:image"]')
    ?.setAttribute(
        "content",
        new URL(
            product.images[0],
            window.location.origin
        ).href
    );



const mainImage =
document.getElementById("mainImage");

const thumbnailGallery =
document.getElementById("thumbnailGallery");

let currentImage = 0;

function loadGallery(){

    mainImage.classList.add("fade");

setTimeout(()=>{

    mainImage.src = product.images[currentImage];

    mainImage.classList.remove("fade");

},150);

    thumbnailGallery.innerHTML = "";

    product.images.forEach((image,index)=>{

        thumbnailGallery.innerHTML += `

        <img
            src="${image}"
            class="thumbnail-image ${index===currentImage ? "active" : ""}"
            data-index="${index}"
            loading="lazy"
            decoding="async"
        >

        `;

    });

    // ===============================
    // CLICK THUMBNAIL
    // ===============================



loadGallery();
document
.getElementById("nextImage")
.addEventListener("click",()=>{

    currentImage++;

    if(currentImage >= product.images.length){

        currentImage = 0;

    }

    loadGallery();

});

document
.getElementById("prevImage")
.addEventListener("click",()=>{

    currentImage--;

    if(currentImage < 0){

        currentImage =
        product.images.length-1;

    }

    loadGallery();

});


/* =========================================
   PRODUCT IMAGE LIGHTBOX
========================================= */

const productLightbox = document.getElementById("productLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const lightboxCounter = document.getElementById("lightboxCounter");

let lightboxWasOpen = false;

function updateLightbox() {
    if (!product.images.length) return;

    lightboxImage.src = product.images[currentImage];
    lightboxImage.alt = `${product.name} — image ${currentImage + 1}`;
    lightboxCounter.textContent =
        `${currentImage + 1} / ${product.images.length}`;
}

function openLightbox(index = currentImage) {
    if (!product.images.length) return;

    currentImage =
        (index + product.images.length) % product.images.length;

    loadGallery();

    lightboxImage.onload = () => {
        lightboxCounter.textContent =
            `${currentImage + 1} / ${product.images.length}`;
    };

    updateLightbox();

    productLightbox.classList.add("active");
    productLightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");

    lightboxWasOpen = true;
}
function closeLightbox() {
    productLightbox.classList.remove("active");
    productLightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");

    lightboxWasOpen = false;
    mainImage.focus?.();
}

function changeLightboxImage(direction) {
    currentImage =
        (currentImage + direction + product.images.length) %
        product.images.length;

    loadGallery();
    updateLightbox();
}

/* Open by clicking the main product image */
mainImage.style.cursor = "zoom-in";
mainImage.setAttribute("tabindex", "0");
mainImage.setAttribute("role", "button");
mainImage.setAttribute("aria-label", "Enlarge product image");

mainImage.addEventListener("click", () => {
    openLightbox(currentImage);
});

mainImage.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(currentImage);
    }
});

/* Open selected thumbnail — mobile and desktop */
let lastThumbnailTap = 0;

thumbnailGallery.addEventListener("click", event => {
    const thumbnail = event.target.closest(".thumbnail-image");
    if (!thumbnail) return;

    // Ignore the synthetic click after a mobile touch
    if (Date.now() - lastThumbnailTap < 500) return;

    openLightbox(Number(thumbnail.dataset.index));
});

thumbnailGallery.addEventListener("touchend", event => {
    const thumbnail = event.target.closest(".thumbnail-image");
    if (!thumbnail) return;

    lastThumbnailTap = Date.now();

    event.preventDefault();
    openLightbox(Number(thumbnail.dataset.index));
}, { passive: false });

/* Viewer controls */
lightboxClose.addEventListener("click", closeLightbox);

lightboxPrev.addEventListener("click", () => {
    changeLightboxImage(-1);
});

lightboxNext.addEventListener("click", () => {
    changeLightboxImage(1);
});

/* Close when clicking the dark backdrop */
productLightbox.addEventListener("click", event => {
    if (event.target === productLightbox) {
        closeLightbox();
    }
});

/* Keyboard navigation */
document.addEventListener("keydown", event => {
    if (!lightboxWasOpen) return;

    if (event.key === "Escape") {
        closeLightbox();
    } else if (event.key === "ArrowLeft") {
        changeLightboxImage(-1);
    } else if (event.key === "ArrowRight") {
        changeLightboxImage(1);
    }
});

/* Touch swipe for mobile */
let touchStartX = 0;
let touchStartY = 0;

lightboxImage.addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;
}, { passive: true });

lightboxImage.addEventListener("touchend", event => {
    const deltaX = event.changedTouches[0].clientX - touchStartX;
    const deltaY = event.changedTouches[0].clientY - touchStartY;

    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        changeLightboxImage(deltaX < 0 ? 1 : -1);
    }
}, { passive: true });


const minimumOrder = document.getElementById("minimumOrder");

if (product.minimumOrder > 1) {
    minimumOrder.textContent =
        `Minimum Order: ${product.minimumOrder} pcs`;
}

document.getElementById("productName").textContent = product.name;

document.getElementById("productPrice").textContent =
"₱" + product.price.toLocaleString();

document.getElementById("productDescription").textContent =
product.description;

const includedList = document.getElementById("includedList");

product.inclusions.forEach(item => {

    const li = document.createElement("li");

    li.textContent = item;

    includedList.appendChild(li);

});
const addonOptions = document.getElementById("addonOptions");

product.addons.forEach((addon, index) => {

    addonOptions.innerHTML += `

        <label class="addon-card">

    <input
        type="checkbox"
        class="addon-checkbox"
        data-price="${addon.price}"
        id="addon${index}"
    >

    <div class="addon-info">

        <h4>${addon.name}</h4>

        <p>

            +₱${addon.price.toLocaleString()}

        </p>

    </div>

</label>

    `;

});
// ========================================
// QUANTITY & TOTAL
// ========================================

const quantityInput = document.getElementById("quantity");
const plusBtn = document.getElementById("plusQty");
const minusBtn = document.getElementById("minusQty");
const totalElement = document.getElementById("quoteTotal");
const breakdown = document.querySelector("#quoteBreakdown");
const successModal =
document.getElementById("successModal");

const continueShoppingBtn =
document.getElementById("continueShoppingBtn");

const reviewQuoteBtn =
document.getElementById("reviewQuoteBtn");

function updateTotal(){

    const minQty = product.minimumOrder || 1;

let quantity = Number(quantityInput.value);

if (isNaN(quantity) || quantity < minQty) {
    quantity = minQty;
    quantityInput.value = minQty;
}
    console.log("Quantity:", quantity);

    let subtotal =
    product.price * quantity;

    let addonsTotal = 0;
    let subtotalOnly = subtotal;

    let addonHTML = "";

    document
    .querySelectorAll(".addon-checkbox")
    .forEach((checkbox,index)=>{

        if(checkbox.checked){

            const addon =
            product.addons[index];

            const total =
            addon.price * quantity;

            addonsTotal += total;

            addonHTML += `

<div class="summary-row">

    <span>

        ${addon.name}

        <br>

        <small>

            ₱${addon.price.toLocaleString()} × ${quantity}

        </small>

    </span>

    <strong>

        ₱${total.toLocaleString()}

    </strong>

</div>

`;

        }

    });

    const grandTotal =
    subtotal + addonsTotal;
    
    console.log("Subtotal:", subtotal);

console.log("Addons:", addonsTotal);

console.log("Grand Total:", grandTotal);
console.log("totalElement is:", totalElement);
    totalElement.textContent =
    "₱" + grandTotal.toLocaleString();



breakdown.innerHTML = `

<div class="summary-section">

    <div class="summary-title">

        Product

    </div>

    <div class="summary-row">

        <span>

            ${product.name}

            <br>

            <small>

                ₱${product.price.toLocaleString()} × ${quantity}

            </small>

        </span>

        <strong>

            ₱${subtotalOnly.toLocaleString()}

        </strong>

    </div>

    ${addonHTML ? `

    <div class="summary-title">

        Add-ons

    </div>

    ${addonHTML}

    ` : ""}

</div>

`;

}

// ========================================
// LOAD EDITED QUOTE
// ========================================

const editQuote = JSON.parse(

    localStorage.getItem("editQuote")

);

if (

    editQuote &&

    editQuote.id === product.id

) {

    quantityInput.value = editQuote.quantity;

    document
    .querySelectorAll(".addon-checkbox")
    .forEach((checkbox, index) => {

        const addon = product.addons[index];

        checkbox.checked =

            editQuote.selectedAddons.some(selected => {

                return selected.name === addon.name;

            });

    });

    updateTotal();

}

// Plus button

plusBtn.addEventListener("click", () => {

    quantityInput.value = Number(quantityInput.value) + 1;

    updateTotal();

});

// Minus button

minusBtn.addEventListener("click", () => {

    const minQty = product.minimumOrder || 1;

    if (Number(quantityInput.value) > minQty) {

        quantityInput.value = Number(quantityInput.value) - 1;

        updateTotal();

    }

});

// Typing quantity

quantityInput.addEventListener("change", updateTotal);
quantityInput.addEventListener("blur", updateTotal);

// Add-ons

document.querySelectorAll(".addon-checkbox").forEach(addon => {

    addon.addEventListener("change", updateTotal);

});

// Initial quantity

quantityInput.value = product.minimumOrder || 1;

// Initial load

updateTotal();
// ========================================
// ADD TO QUOTE REQUEST
// ========================================

const addQuoteBtn =
document.getElementById("addQuoteBtn");

addQuoteBtn.addEventListener("click", () => {

    const selectedAddons = [];

    document
    .querySelectorAll(".addon-checkbox")
    .forEach((checkbox,index)=>{

        if(checkbox.checked){

            selectedAddons.push({

                name: product.addons[index].name,

                price: product.addons[index].price

            });

        }

    });

const minQty = product.minimumOrder || 1;

let quantity = Number(quantityInput.value);

if (isNaN(quantity) || quantity < minQty) {
    quantity = minQty;
    quantityInput.value = minQty;
}

const addonsTotal = selectedAddons.reduce(

    (sum, addon) => sum + addon.price,

    0

);

const total = (product.price + addonsTotal) * quantity;

console.log("quantity =", quantity);
console.log("addonsTotal =", addonsTotal);
console.log("total =", total);

const quoteItem = {

    quoteId: crypto.randomUUID(),

    id: product.id,

    category: product.category,

    name: product.name,

    image: product.images[0],

    quantity: quantity,

    selectedAddons,

    total: total

};

    let quoteRequest = JSON.parse(

    localStorage.getItem("quoteRequest")

) || [];

const editing = editQuote !== null;

if (editing) {

    const index = quoteRequest.findIndex(item => {

        return item.quoteId === editQuote.quoteId;

    });

    if (index !== -1) {

        quoteItem.quoteId = editQuote.quoteId;

        quoteRequest[index] = quoteItem;

    }

    localStorage.removeItem("editQuote");

    } else {

    const existingItem = quoteRequest.find(item => {

        return (

            item.id === quoteItem.id &&

            JSON.stringify(item.selectedAddons) ===
            JSON.stringify(quoteItem.selectedAddons)

        );

    });

    if (existingItem) {

        existingItem.quantity += quoteItem.quantity;

        existingItem.total += quoteItem.total;

    } else {

        quoteRequest.push(quoteItem);

    }

}

localStorage.setItem(

    "quoteRequest",

    JSON.stringify(quoteRequest)

);

// ========================================
// GOOGLE ANALYTICS - ADD TO QUOTE
// ========================================

if (typeof gtag === "function") {

    gtag("event", "add_to_quote", {
        product_id: product.id,
        product_name: product.name,
        product_category: product.category,
        quantity: quantity,
        value: total,
        currency: "PHP",
        addon_count: selectedAddons.length
    });

}

// Show success modal
successModal.classList.add("active");

});
// ========================================
// SUCCESS MODAL BUTTONS
// ========================================

continueShoppingBtn.addEventListener("click", () => {

    successModal.classList.remove("active");

});

reviewQuoteBtn.addEventListener("click", () => {

    window.location.href =
    "quote.html";

});