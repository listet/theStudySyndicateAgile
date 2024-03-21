
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

    console.log(kaffe);
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

showCoffee();

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