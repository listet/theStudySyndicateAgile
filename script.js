async function getApi(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data; 
    } catch (error) { 
        console.log(error);
    }
}

import { adminCoffee } from './admin.js';

async function showCoffee() {
    
    const storedCoffees = await adminCoffee();
    const menyRef = document.querySelector('.meny__overview');

    menyRef.innerHTML = '';

    if(menyRef) {
        menyRef.innerHTML = '';
    } else {
        console.error('Element med class meny__overview hittades inte.');
    }
    
    
    storedCoffees.forEach(coffee => {
        const coffeeArticle = document.createElement('article');
        coffeeArticle.classList.add('meny__article');
        const coffeeSection = document.createElement('section');
        coffeeSection.classList.add('meny_info-section');
        const button = document.createElement('button');
        button.classList.add('meny__button');
        button.innerHTML = '<img src="/Assets/add.svg" alt="an image of a plus sign">';
        button.setAttribute('id', coffee.id);
        // Spara produkten till localstorage
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const existingCoffee = JSON.parse(localStorage.getItem('selectedCoffee'));
            if (existingCoffee && existingCoffee.id === coffee.id) {
                console.log('Detta kaffe ligger redan i varukorgen!');
            } else {
                saveToLocalStorage(coffee);
                renderProductsFromLocalStorage();
            }
        });

        const detailSection = document.createElement('section');
        detailSection.classList.add('detail-section');
        const title = document.createElement('h2');
        title.classList.add('meny__subtitle');
        const pRef = document.createElement('p');
        pRef.classList.add('meny__info');
        const price = document.createElement('h2');
        price.classList.add('meny__subtitle');
        const img = document.createElement('img');
        img.src = coffee.image;
        img.alt = coffee.title;
        img.classList.add('meny__img');

        title.innerHTML = coffee.title;
        pRef.innerHTML = coffee.desc;
        price.innerHTML = coffee.price + ' kr';

        coffeeSection.appendChild(img);
        console.log(coffeeSection);
        coffeeSection.appendChild(button);
        detailSection.appendChild(title);
        detailSection.appendChild(pRef);
        coffeeSection.appendChild(detailSection);
        coffeeSection.appendChild(price);
        
        coffeeArticle.appendChild(coffeeSection);
        menyRef.appendChild(coffeeArticle);
    });
}
// Spara produkten till localstorage
function saveToLocalStorage(coffee) {
   
    if (typeof(Storage) !== "undefined") {

        localStorage.setItem('selectedCoffee', JSON.stringify(coffee));
        console.log('Kaffet har sparats till localStorage!');
    } else {
        console.log('Något gick fel!');
    }
}

showCoffee();

// VARUKORG
// Open/close varukorgen
const basketBtn = document.getElementById('basketBtn');
const varukorg = document.querySelector('.varukorg-section');

basketBtn.addEventListener('click', () => {
    varukorg.classList.toggle('d-none');
});

varukorg.addEventListener('click', (event) => {
    if (event.target === varukorg) {
    varukorg.classList.add('d-none');
    }
});



// Render produkt i varukorg från localstorage
function renderProductsFromLocalStorage() {
    // Kontrollera om din webbläsare stöder localStorage
    if (typeof(Storage) !== "undefined") {
        // Kontrollera om det finns en sparad produkt i localStorage
        if (localStorage.getItem('selectedCoffee')) {

            const coffee = JSON.parse(localStorage.getItem('selectedCoffee'));

            const varukorgList = document.querySelector('.varukorg__list');
            const li = document.createElement('li');
            const name = document.createElement('h3');
            const price = document.createElement('p');
            const quantityContainer = document.createElement('div');
            const quantityValue = document.createElement('p');
            const decreaseIcon = document.createElement('span');
            const increaseIcon = document.createElement('span');

            li.classList.add('varukorg__list-item');
            name.classList.add('varukorg__item-name');
            price.classList.add('varukorg__undertext');
            quantityContainer.classList.add('varukorg__quantity-container');
            decreaseIcon.classList.add('material-symbols-outlined');
            increaseIcon.classList.add('material-symbols-outlined');

            // Vi kontrollerar om det redan finns ett belopp sparat i localStorage, om inte sätter vi ett standardvärde
            const quantity = localStorage.getItem('quantity') ? localStorage.getItem('quantity') : 1;
            quantityValue.textContent = quantity;

            // Läs aktuellt pris från localStorage om det är sparat
            const currentPrice = localStorage.getItem('price') ? localStorage.getItem('price') : coffee.price;
            price.textContent = currentPrice + ' kr';


            name.textContent = coffee.title;
            price.textContent = coffee.price + ' kr';
            quantityValue.textContent = '1';
            decreaseIcon.innerHTML = 'expand_less';
            increaseIcon.innerHTML = 'expand_more';

            li.appendChild(name);
            li.appendChild(price);
            li.appendChild(quantityContainer);
            quantityContainer.appendChild(decreaseIcon);
            quantityContainer.appendChild(quantityValue);
            quantityContainer.appendChild(increaseIcon);
            varukorgList.appendChild(li);

            // Lägg till evenemangslyssnare till ikoner
            decreaseIcon.addEventListener('click', function() {
                increaseQuantity(quantityValue);
            });

            increaseIcon.addEventListener('click', function() {
                decreaseQuantity(quantityValue, li, coffee);
            });
            // Anropa funktionen för att beräkna och visa totalpriset direkt när sidan laddas
            calculateTotalPrice();

        }
    } else {
        console.log('Något gick fel!');
    }
}


function increaseQuantity(quantityValue, coffee) {
    let quantity = parseInt(quantityValue.textContent);
    quantity++;
    quantityValue.textContent = quantity;
    
    // Beräkna och uppdatera det nya priset i localStorage
    let currentPrice = localStorage.getItem(`${coffee.id}_price`) || coffee.price;
    currentPrice = parseInt(currentPrice);
    const newPrice = currentPrice + coffee.price;
    localStorage.setItem(`${coffee.id}_quantity`, quantity);
    localStorage.setItem(`${coffee.id}_price`, newPrice);
}

function decreaseQuantity(quantityValue, li, coffee) {
    let quantity = parseInt(quantityValue.textContent);
    if (quantity > 1) {
        quantity--;
        quantityValue.textContent = quantity;
        
        // Beräkna och uppdatera det nya priset i localStorage
        let currentPrice = localStorage.getItem(`${coffee.id}_price`) || coffee.price;
        currentPrice = parseInt(currentPrice);
        const newPrice = currentPrice - coffee.price;
        localStorage.setItem(`${coffee.id}_quantity`, quantity);
        localStorage.setItem(`${coffee.id}_price`, newPrice);
    } else {
        localStorage.removeItem(`${coffee.id}_quantity`);
        localStorage.removeItem(`${coffee.id}_price`);
        localStorage.removeItem('selectedCoffee');
        li.remove();
        console.log('Produkten har raderats från varukorgen och från localStorage!');
    }
}

function calculateTotalPrice() {
    let totalPrice = 0;
    const varukorgListItems = document.querySelectorAll('.varukorg__list-item');
    
    varukorgListItems.forEach(item => {
        const priceText = item.querySelector('.varukorg__undertext').textContent;
        const price = parseFloat(priceText.replace(' kr', ''));
        totalPrice += price;
    });

    const totalPriceElement = document.getElementById('totalPrice');
    totalPriceElement.textContent = `${totalPrice.toFixed(2)} kr`;
}

// Anropa funktionen för att visa produkten direkt vid laddning
renderProductsFromLocalStorage();

const takeMyMoneyBtn = document.querySelector('.varukorg__btn');
takeMyMoneyBtn.addEventListener('click', generateOrdernumber);
// VARUKORG



let ordernumbers = JSON.parse(localStorage.getItem('ordernumbers')) || [];

function generateOrdernumber() {
    let ordernumber;
    let isUnique = false;

    while (!isUnique) { 
        ordernumber = Date.now() + (Math.floor(Math.random() * 10000));
        if (!ordernumbers.includes(ordernumber)) {
            isUnique = true;
        }
    }
    ordernumbers.push(ordernumber);
    localStorage.setItem('ordernumbers', JSON.stringify(ordernumbers));

    console.log(ordernumber);
    return ordernumber;
}

// Behöver kalla på funktionen generateOrdernumber(); när man klickar på beställknappen
/*async function getApi(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data; 
    } catch (error) { 
        console.log(error);
    }
}*/
/*const kaffe = await getApi('https://santosnr6.github.io/Data/airbeanproducts.json');*/
/*kaffe.menu.forEach(coffee => {*/