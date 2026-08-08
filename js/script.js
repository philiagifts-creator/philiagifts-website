const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const button = item.querySelector(".faq-question");

    button.addEventListener("click", () => {

        faqItems.forEach(other => {

            if(other !== item){
                other.classList.remove("active");
            }

        });

        item.classList.toggle("active");

    });

    });

const cartCount = document.getElementById("cartCount");

if (cartCount) {

    const quote = JSON.parse(
        localStorage.getItem("quoteRequest")
    ) || [];

    if (quote.length === 0) {

        cartCount.style.display = "none";

    } else {

        cartCount.style.display = "flex";

const totalItems = quote.reduce((sum, item) => {

    return sum + item.quantity;

}, 0);

cartCount.textContent = totalItems;

    }

}

/* ==========================
   LIVE SEARCH
========================== */


const searchInput = document.getElementById("siteSearch");
const searchResults = document.getElementById("searchResults");

if (searchInput && searchResults) {

    searchInput.addEventListener("input", function () {

        const keyword = this.value.toLowerCase().trim();

        console.log("Typing:", keyword);

        searchResults.innerHTML = "";

        if (keyword === "") {

            searchResults.style.display = "none";

            return;

        }

    const results = allProducts.filter(product => {

    const name = (product.name || "").toLowerCase();

    const category = (product.category || "").toLowerCase();

    const section = (
        Array.isArray(product.section)
            ? product.section.join(" ")
            : (product.section || "")
    ).toLowerCase();

    const keywords = (product.keywords || []).map(word =>
        (word || "").toLowerCase()
    );

    return (
        name.includes(keyword) ||
        category.includes(keyword) ||
        section.includes(keyword) ||
        keywords.some(word => word.includes(keyword))
    );

});

        console.log("Results:", results);

        if (results.length === 0) {

            searchResults.innerHTML = `
                <div class="search-item">
                    No products found
                </div>
            `;

        } else {

            results.forEach(product => {

                searchResults.innerHTML += `
    <a href="${product.page}" class="search-item">

        <img
            src="${product.images[0]}"
            class="search-thumb"
            loading="lazy"
            decoding="async"
        >

        <div class="search-info">

            <div class="search-title">
                ${product.name}
            </div>

        </div>

    </a>
`;

            });

        }

        console.log("Generated HTML:");
        console.log(searchResults.innerHTML);

        searchResults.style.display = "block";

    });

    document.addEventListener("click", function(e){

        if(!e.target.closest(".header-search")){

            searchResults.style.display = "none";

        }

    });

}

const searchBtn = document.getElementById("searchBtn");

if (searchBtn && searchInput) {

    searchBtn.addEventListener("click", function () {

        searchInput.dispatchEvent(new Event("input"));

    });

}
if (searchInput) {

    searchInput.addEventListener("keydown", function(e){

        if(e.key === "Enter"){

            searchInput.dispatchEvent(new Event("input"));

        }

    });

}
/*=====================================
MOBILE MENU
=====================================*/

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const closeMenu = document.querySelector(".close-menu");

menuToggle.addEventListener("click", () => {

    mobileMenu.classList.add("active");

    document.body.classList.add("menu-open");

});

closeMenu.addEventListener("click", () => {

    mobileMenu.classList.remove("active");

    document.body.classList.remove("menu-open");

});

const mobileSearch = document.getElementById("mobileSearch");
const mobileSearchBtn = document.getElementById("mobileSearchBtn");

if (mobileSearchBtn) {

    mobileSearchBtn.addEventListener("click", () => {

        console.log("Button clicked!");

    });

}

/*=====================================
MOBILE DROPDOWN
=====================================*/

const dropdownBtn = document.querySelector(".mobile-dropdown-btn");
const dropdownMenu = document.querySelector(".mobile-dropdown-menu");

dropdownBtn.addEventListener("click", () => {

    dropdownMenu.classList.toggle("show");

    dropdownBtn.classList.toggle("rotate");

});
document.querySelectorAll(".mobile-nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        mobileMenu.classList.remove("active");

        document.body.style.overflow = "";

    });

});

document.querySelectorAll(".footer-links").forEach(section=>{

    const heading=section.querySelector("h4");

    heading.addEventListener("click",()=>{

        section.classList.toggle("active");

    });

});


const form = document.getElementById("contactForm");

if (form) {

    form.addEventListener("submit", function(e){

        console.log("Form submitted"); // <-- Add this line

        e.preventDefault();

        emailjs.sendForm(

            "service_3e3ibmz",

            "template_9tc23lo",

            this

        ).then(function(){

            alert("Thank you! Your message has been sent.");

            form.reset();

        }).catch(function(error){

            console.log(error);

            alert("Something went wrong. Please try again.");

        });

    });

}
