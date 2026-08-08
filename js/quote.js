const quoteItems =
JSON.parse(localStorage.getItem("quoteRequest")) || [];

const quoteContainer =
document.getElementById("quoteItems");

const cartTotal =
document.getElementById("cartTotal");

let grandTotal = 0;

quoteItems.forEach(item => {

    let addonsHTML = "";

    item.selectedAddons.forEach(addon => {

        addonsHTML += `
            <li>
                ${addon.name}
                (+₱${addon.price.toLocaleString()})
            </li>
        `;

    });

    grandTotal += item.total;

    quoteContainer.innerHTML += `

<div class="quote-item">

    <img
        src="${item.image}"
        class="quote-image"
    >

    <div class="quote-info">

        <h3>

            ${item.name}

        </h3>

            <div class="quote-price">


        <strong>

            ₱${item.total.toLocaleString()}

        </strong>

    </div>

        <span class="qty-badge">

            Qty ${item.quantity}

        </span>

        ${
            item.selectedAddons.length
            ?

            `
            <div class="addon-title">

                Selected Add-ons

            </div>

            <ul class="addon-list">

                ${addonsHTML}

            </ul>
            `

            :

            ""

        }

        <div class="quote-actions">

            <button
    class="edit-btn"
    data-id="${item.quoteId}"
>
    ✏ Edit
</button>

            <button
    class="remove-btn"
    data-id="${item.quoteId}"
>

    🗑 Remove

</button>

        </div>

    </div>

</div>

`;

});

cartTotal.textContent =
"₱" + grandTotal.toLocaleString();

// ========================================
// REMOVE PRODUCT
// ========================================

document
.querySelectorAll(".remove-btn")
.forEach(button => {

    button.addEventListener("click", () => {

        console.log("Clicked:", button.dataset.id);

        const quoteId = button.dataset.id;

        let quoteRequest = JSON.parse(

            localStorage.getItem("quoteRequest")

        ) || [];

        console.log(quoteRequest);

        quoteRequest = quoteRequest.filter(item => {

            return item.quoteId !== quoteId;

        });

        localStorage.setItem(

            "quoteRequest",

            JSON.stringify(quoteRequest)

        );

        location.reload();

    });

});

// ========================================
// EDIT PRODUCT
// ========================================

document
.querySelectorAll(".edit-btn")
.forEach(button => {

    button.addEventListener("click", () => {

        const quoteId = button.dataset.id;

        const quoteRequest = JSON.parse(

            localStorage.getItem("quoteRequest")

        ) || [];

        const editQuote = JSON.parse(
    localStorage.getItem("editQuote")
);

const editing = editQuote !== null;

        const selectedItem = quoteRequest.find(item => {

            return item.quoteId === quoteId;

        });

        localStorage.setItem(

            "editQuote",

            JSON.stringify(selectedItem)

        );

        window.location.href =
        `product.html?id=${selectedItem.id}`;

    });

});

// ========================================
// REQUEST OFFICIAL QUOTATION
// ========================================

document
.getElementById("sendQuoteBtn")
.addEventListener("click", () => {

    window.location.href =
    "customer-info.html";

});

// ========================================
// CLEAR QUOTE
// ========================================


const clearModal =
document.getElementById("clearModal");

const cancelClearBtn =
document.getElementById("cancelClearBtn");

const confirmClearBtn =
document.getElementById("confirmClearBtn");

clearQuoteBtn.addEventListener("click", () => {

    clearModal.classList.add("active");

});

cancelClearBtn.addEventListener("click", () => {

    clearModal.classList.remove("active");

});

confirmClearBtn.addEventListener("click", () => {

    localStorage.removeItem("quoteRequest");

    location.reload();

});