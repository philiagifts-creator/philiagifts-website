const bestSection = document.getElementById("best-sellers");

const sponsorsSection = document.getElementById("gift-sets");

const guestsSection = document.getElementById("guest-giveaways");

const noResults = document.getElementById("noResults");

function displayProducts(productList = weddingProducts){

    bestSellersGrid.innerHTML = "";

    sponsorsGrid.innerHTML = "";

    guestsGrid.innerHTML = "";
    noResults.style.display = "none";
    let hasBest = false;

let hasSponsors = false;

let hasGuests = false;


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

    });

bestSection.style.display = hasBest ? "block" : "none";

sponsorsSection.style.display = hasSponsors ? "block" : "none";

guestsSection.style.display = hasGuests ? "block" : "none";

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

            ...(product.tags || [])

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

const bestBtn = document.getElementById("bestBtn");

const sponsorsBtn = document.getElementById("sponsorsBtn");

const guestsBtn = document.getElementById("guestsBtn");

const buttons = [

    bestBtn,

    sponsorsBtn,

    guestsBtn

];

function setActiveButton(button){

    buttons.forEach(btn=>{

        btn.classList.remove("active");

    });

    button.classList.add("active");

}


function scrollToSection(id,button){

    const section=document.getElementById(id);

    if(!section) return;

    setActiveButton(button);

    const y=

        section.getBoundingClientRect().top+

        window.pageYOffset-

        120;

    window.scrollTo({

        top:y,

        behavior:"smooth"

    });

}

bestBtn.addEventListener("click",()=>{

    scrollToSection(

        "best-sellers",

        bestBtn

    );

});

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

const sections=[

    {

        id:"best-sellers",

        button:bestBtn

    },

    {

        id:"gift-sets",

        button:sponsorsBtn

    },

    {

        id:"guest-giveaways",

        button:guestsBtn

    }

];

window.addEventListener("scroll",()=>{

    const scrollPosition=

        window.scrollY+180;

    sections.forEach(section=>{

        const el=document.getElementById(section.id);

        if(!el) return;

        if(

            scrollPosition>=el.offsetTop &&

            scrollPosition<

            el.offsetTop+

            el.offsetHeight

        ){

            setActiveButton(section.button);

        }

    });

});

setActiveButton(bestBtn);
