const bestSection = document.getElementById("best-sellers");

const sponsorsSection = document.getElementById("gift-sets");

const guestsSection = document.getElementById("guest-giveaways");

const noResults = document.getElementById("noResults");
const invitationsGrid = document.getElementById("invitationsGrid");
const invitationsSection = document.getElementById("invitations");

function displayProducts(productList = weddingProducts){

sponsorsGrid.innerHTML = "";
guestsGrid.innerHTML = "";
invitationsGrid.innerHTML = "";
    noResults.style.display = "none";
let hasBest = false;
let hasSponsors = false;
let hasGuests = false;
let hasInvitations = false;


   productList.forEach(product =>{

        const card = `

        <a href="product.html?id=${product.id}" class="product-card">

            <img
                src="${product.images[0]}"
                alt="${product.name}"
                loading="lazy"
                decoding="async"
            >

            <div class="product-info">

                <h3>${product.name}</h3>

                <p class="product-price">

                    ₱${product.price}

                </p>

            </div>

        </a>

        `;

        // ==========================
        // Best Sellers
        // ==========================

        if(product.bestseller){

    hasBest = true;

    bestSellersGrid.innerHTML += card;

}

        // ==========================
        // Sponsor Gift Sets
        // ==========================

      if(product.section.includes("gift-set")){

    hasSponsors = true;

    sponsorsGrid.innerHTML += card;

}

        // ==========================
        // Guest Giveaways
        // ==========================

        if(product.section.includes("guest")){

    hasGuests = true;

    guestsGrid.innerHTML += card;

}

if (
    typeof product.section === "string" &&
    product.section.includes("invitation")
) {
    hasInvitations = true;
    invitationsGrid.innerHTML += card;
}

    });

bestSection.style.display = hasBest ? "block" : "none";

sponsorsSection.style.display = hasSponsors ? "block" : "none";

guestsSection.style.display = hasGuests ? "block" : "none";
invitationsSection.style.display = hasInvitations ? "block" : "none";

if(!hasBest && !hasSponsors && !hasGuests){

}


}
displayProducts();

const productSearch = document.getElementById("productSearch");

productSearch.addEventListener("input", () => {

    const keyword = productSearch.value.toLowerCase().trim();

    const filteredProducts = weddingProducts.filter(product => {

        const searchText = [

            product.name,

            product.description,

            product.category,

            product.section,

            ...(product.inclusions || []),

            ...(product.colors || []),  

            ...(product.keywords || [])

        ]
        .join(" ")
        .toLowerCase();

        return searchText.includes(keyword);
    
    });

    displayProducts(filteredProducts);
if(productSearch.value.trim() === ""){

    noResults.style.display = "none";

}else{

    noResults.style.display =
        filteredProducts.length === 0 ? "block" : "none";

}

});

const sponsorsBtn = document.getElementById("sponsorsBtn");

const guestsBtn = document.getElementById("guestsBtn");

const invitationsBtn = document.getElementById("invitationsBtn");

const buttons = [
    sponsorsBtn,
    guestsBtn,
    invitationsBtn
];

function setActiveButton(button) {
    buttons.forEach(btn => {
        btn.classList.remove("active");
    });
}


function scrollToSection(id, button) {

    const section = document.getElementById(id);

    if (!section) {
        console.error("Section not found:", id);
        return;
    }

    // If search is active, clear it first
    productSearch.value = "";

    // Restore all products/sections
    displayProducts(weddingProducts);

    // Set active button
    setActiveButton(button);

    // Wait for products to render before scrolling
    requestAnimationFrame(() => {

        const headerOffset = 110;

        const sectionPosition =
            section.getBoundingClientRect().top +
            window.scrollY;

        window.scrollTo({
            top: sectionPosition - headerOffset,
            behavior: "smooth"
        });

    });

}



sponsorsBtn.addEventListener("click",()=>{

    scrollToSection(

        "gift-sets",

        sponsorsBtn

    );

});

guestsBtn.addEventListener("click",()=>{

    scrollToSection(

        "guest-giveaways",

        guestsBtn

    );

});

invitationsBtn.addEventListener("click", () => {
    scrollToSection("invitations", invitationsBtn);
});

const sections = [
    { id: "gift-sets", button: sponsorsBtn },
    { id: "guest-giveaways", button: guestsBtn },
    { id: "invitations", button: invitationsBtn }
];


const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        if (entry.target.id === "gift-sets") {
            setActiveButton(sponsorsBtn);
        } else if (entry.target.id === "guest-giveaways") {
            setActiveButton(guestsBtn);
        } else if (entry.target.id === "invitations") {
    setActiveButton(invitationsBtn);
}
    });
}, {
    rootMargin: "-180px 0px -60% 0px",
    threshold: 0
});

document.querySelectorAll(
    "#gift-sets, #guest-giveaways, #invitations"
).forEach(section => sectionObserver.observe(section));


