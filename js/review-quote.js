const customer = JSON.parse(

    localStorage.getItem("customerInformation")

);

const quoteItems = JSON.parse(

    localStorage.getItem("quoteRequest")

) || [];

// ========================================
// SEND MODAL
// ========================================

const sendModal =
document.getElementById("sendModal");

const openAppBtn =
document.getElementById("openAppBtn");

const step1 =
document.getElementById("step1");

const cancelModalBtn =
document.getElementById("cancelModalBtn");

let appLink = "";
let appName = "";   

const customerSummary =
document.getElementById("customerSummary");

const quoteSummary =
document.getElementById("quoteSummary");

customerSummary.innerHTML = `

<div class="customer-card">

    <h2>Customer Information</h2>

    <div class="customer-grid">

        <div>
            <strong>Name</strong>
            <span>${customer.fullName}</span>
        </div>

        <div>
            <strong>Facebook</strong>
            <span>${customer.facebookName}</span>
        </div>

        <div>
            <strong>Phone</strong>
            <span>${customer.phone}</span>
        </div>

        <div>
            <strong>Email</strong>
            <span>${customer.email || "N/A"}</span>
        </div>

        <div>
            <strong>Company</strong>
            <span>${customer.company || "N/A"}</span>
        </div>

        <div>
            <strong>Event</strong>
            <span>${customer.eventType}</span>
        </div>

        <div>
            <strong>Event Date</strong>
            <span>${customer.eventDate || "N/A"}</span>
        </div>

        <div>
            <strong>Preferred Delivery</strong>
            <span>${customer.deliveryDate || "N/A"}</span>
        </div>

    </div>

    <div class="customer-bottom">

    <div class="customer-address">

        <strong>Address</strong>

        <p>${customer.address || "N/A"}</p>

    </div>

    <div class="customer-notes">

        <strong>Additional Notes</strong>

        <p>${customer.notes || "None"}</p>

    </div>

</div>

`;

let grandTotal = 0;

quoteItems.forEach(item => {

    let addonsHTML = "";

    item.selectedAddons.forEach(addon => {

        addonsHTML += `
<div class="addon-item">
    ${addon.name}
    (+₱${addon.price.toLocaleString()})
</div>
`;

    });

    grandTotal += item.total;

    quoteSummary.innerHTML += `

<div class="review-card">

    <img
        src="${item.image}"
        class="review-image"
    >

    <div class="review-info">

        <h3>${item.name}</h3>

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

           <div class="addon-list">
    ${addonsHTML}
</div>

            `

            :

            ""

        }

    </div>

    <div class="review-price">

        ₱${item.total.toLocaleString()}

    </div>

</div>
</div>

`;

});

quoteSummary.innerHTML += `

<div class="summary-card">

    <div class="summary-total">

        <span>Estimated Total</span>

        <span class="summary-price">

            ₱${grandTotal.toLocaleString()}

        </span>

    </div>

</div>

`;
// ========================================
// BUILD QUOTATION MESSAGE
// ========================================

function buildQuoteMessage(){

    let message =

`Hello Philia Gifts! 👋

I would like to request an official quotation.

━━━━━━━━━━━━━━━━━━
CUSTOMER INFORMATION
━━━━━━━━━━━━━━━━━━

Name: ${customer.fullName}
Facebook: ${customer.facebookName}
Company: ${customer.company || "N/A"}
Phone: ${customer.phone}
Email: ${customer.email || "N/A"}

Event: ${customer.eventType}
Event Date: ${customer.eventDate || "N/A"}
Preferred Delivery:
${customer.deliveryDate || "N/A"}

Address:
${customer.address || "N/A"}

Notes:
${customer.notes || "None"}

━━━━━━━━━━━━━━━━━━
PRODUCTS
━━━━━━━━━━━━━━━━━━

`;

    quoteItems.forEach(item=>{

        message +=

`• ${item.name}

Qty: ${item.quantity}
`;

        if(item.selectedAddons.length){

            message += "Add-ons:\n";

            item.selectedAddons.forEach(addon=>{

                message +=
`- ${addon.name}
`;

            });

        }

        message +=

`Estimated:

₱${item.total.toLocaleString()}

----------------------------

`;

    });

    message +=

`Estimated Total

₱${grandTotal.toLocaleString()}

Thank you!`;

    return message;

}
// ========================================
// MESSENGER
// ========================================

document
.getElementById("messengerBtn")
.addEventListener("click", () => {

    const message =
    buildQuoteMessage();

    navigator.clipboard.writeText(message);

    appName = "Messenger";
   step1.textContent = "✔ Open Messenger";

    appLink =
    "https://m.me/philiagiftsph";

    openAppBtn.textContent =
    "Continue to Messenger →";

    sendModal.classList.add("active");

});


// ========================================
// VIBER
// ========================================

document
.getElementById("viberBtn")
.addEventListener("click", () => {

    const message =
    buildQuoteMessage();

    navigator.clipboard.writeText(message);

    appName = "Viber";
    step1.textContent = "✔ Open Viber";

    appLink =
    "viber://chat?number=639707715101";

    openAppBtn.textContent =
    "Continue to Viber →";

    sendModal.classList.add("active");

});

// ========================================
// OPEN APP
// ========================================

openAppBtn.addEventListener("click", () => {

    // Open Messenger or Viber
    window.open(appLink, "_blank");

    // Close modal
    sendModal.classList.remove("active");

    // Clear saved quotation
    localStorage.removeItem("quoteRequest");
    localStorage.removeItem("customerInformation");
    localStorage.removeItem("editQuote");

    // Go to Thank You page
    setTimeout(() => {

        window.location.href = "thank-you.html";

    }, 500);

});

// ========================================
// CLOSE MODAL
// ========================================

cancelModalBtn.addEventListener("click", () => {

    sendModal.classList.remove("active");

});