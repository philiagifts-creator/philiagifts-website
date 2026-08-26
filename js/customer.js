// ========================================
// CUSTOMER INFORMATION
// ========================================

const form = document.getElementById("customerForm");

const backBtn = document.getElementById("backBtn");
const messengerBtn = document.getElementById("messengerBtn");
const viberBtn = document.getElementById("viberBtn");


// ========================================
// BACK BUTTON
// ========================================

backBtn.addEventListener("click", () => {

    window.location.href = "quote.html";

});

// ========================================
// OPEN MESSENGER
// ========================================

document
.getElementById("modalOpen")
.addEventListener("click", () => {

    window.open(
        MESSENGER_URL,
        "_blank"
    );

});
// ========================================
// SAVE CUSTOMER INFO
// ========================================

function saveCustomerInformation() {

    const customer = {

        fullName: document.getElementById("fullName").value,
        facebookName: document.getElementById("facebookName").value,
        phone: document.getElementById("phone").value,
        company: document.getElementById("company").value,
        email: document.getElementById("email").value,
        eventType: document.getElementById("eventType").value,
        eventDate: document.getElementById("eventDate").value,
        deliveryDate: document.getElementById("deliveryDate").value,
        address: document.getElementById("address").value,
        notes: document.getElementById("notes").value

    };

    localStorage.setItem(
        "customerInformation",
        JSON.stringify(customer)
    );

}


// ========================================
// BUILD QUOTATION MESSAGE
// ========================================

function buildQuoteMessage() {

    const customer = JSON.parse(
        localStorage.getItem("customerInformation")
    );

const quoteItems = JSON.parse(
    localStorage.getItem("quoteRequest")
) || [];

    let message =
`Hello Philia Gifts! 👋

I would like to request an official quotation.

━━━━━━━━━━━━━━━━━━
CUSTOMER INFORMATION
━━━━━━━━━━━━━━━━━━

Name: ${customer.fullName}
Facebook: ${customer.facebookName}
Phone: ${customer.phone}
Email: ${customer.email || "N/A"}

Company:
${customer.company || "N/A"}

Event:
${customer.eventType}

Event Date:
${customer.eventDate || "N/A"}

Preferred Delivery:
${customer.deliveryDate || "N/A"}

Delivery Address:
${customer.address || "N/A"}

Additional Notes:
${customer.notes || "None"}

━━━━━━━━━━━━━━━━━━
REQUESTED ITEMS
━━━━━━━━━━━━━━━━━━

`;

let grandTotal = 0;

quoteItems.forEach((item, index) => {

    grandTotal += item.total;

    message +=
`${index + 1}. ${item.name}

   • Quantity: ${item.quantity}
`;

    if (item.selectedAddons.length > 0) {

        message += "   • Add-ons:\n";

        item.selectedAddons.forEach(addon => {

            message += `      - ${addon.name} (+₱${addon.price.toLocaleString()})\n`;

        });

    }

    message +=
`   • Total: ₱${item.total.toLocaleString()}

────────────────────

`;

});

    message +=
`━━━━━━━━━━━━━━━━━━
GRAND TOTAL

₱${grandTotal.toLocaleString()}

Thank you!`;

    return encodeURIComponent(message);

}


// ========================================
// SEND TO MESSENGER
// ========================================

messengerBtn.addEventListener("click", () => {

    if (!form.reportValidity()) return;

    saveCustomerInformation();

    // Google Analytics
    if (typeof gtag === "function") {

        const quoteItems = JSON.parse(
            localStorage.getItem("quoteRequest")
        ) || [];

        const quoteValue = quoteItems.reduce(
            (total, item) => total + item.total,
            0
        );

        gtag("event", "submit_quote_details", {
            platform: "messenger",
            item_count: quoteItems.length,
            quote_value: quoteValue
        });

    }

    const message = buildQuoteMessage();

    navigator.clipboard.writeText(
        decodeURIComponent(message)
    );

    showSendModal(
        "Messenger",
        `https://m.me/102160075444175`
    );

});

// ========================================
// SEND MODAL
// ========================================

const modal = document.getElementById("sendModal");

const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");

const modalOpen = document.getElementById("modalOpen");
const modalClose = document.getElementById("modalClose");

function showSendModal(platform, url){

    modalTitle.textContent = "Ready to Send";

    modalMessage.innerHTML = `
        Your request has been copied to your clipboard.<br><br>
         1. Open <strong>${platform}</strong><br>
         2. <strong>Paste</strong> the message<br>
         3. Click <strong>Send</strong>.<br><br>
         
         We'll review your request and prepare a personalized quotation.<br>
    `;

    modalOpen.textContent = `Open ${platform}`;

    modal.classList.add("active");

    modalOpen.onclick = () => {

    // Google Analytics
    if (typeof gtag === "function") {

        gtag("event", "quote_platform_open", {
            platform: platform.toLowerCase()
        });

    }

    window.open(url, "_blank");

    modal.classList.remove("active");

};

    modalClose.onclick = () => {

        modal.classList.remove("active");

    };

}


// ========================================
// SEND TO VIBER
// ========================================

viberBtn.addEventListener("click", () => {

    if (!form.reportValidity()) return;

    saveCustomerInformation();

    // Google Analytics
    if (typeof gtag === "function") {

        const quoteItems = JSON.parse(
            localStorage.getItem("quoteRequest")
        ) || [];

        const quoteValue = quoteItems.reduce(
            (total, item) => total + item.total,
            0
        );

        gtag("event", "submit_quote_details", {
            platform: "viber",
            item_count: quoteItems.length,
            quote_value: quoteValue
        });

    }

    const message = buildQuoteMessage();

    navigator.clipboard.writeText(
        decodeURIComponent(message)
    );

    showSendModal(
        "Viber",
        `viber://chat?number=%2B639707715101`
    );

});
