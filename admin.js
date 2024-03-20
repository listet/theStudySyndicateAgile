'use strict'

document.addEventListener('DOMContentLoaded', function () {
    initializeAdminCoffee();
});

console.log('Initial localStorage data:', localStorage.getItem('adminCoffee'));

async function getApi(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

//get coffees from api and save as data
async function initializeAdminCoffee() {
    try {
        const url = 'https://santosnr6.github.io/Data/airbeanproducts.json';
        const data = await getApi(url);
        console.log('Datan från APIn:', data);
        updateAdminCoffee(data.menu);
    } catch (error) {
        console.log(error);
    }
}

//get all coffees stored in localstorage
export function adminCoffee() {
    const storedCoffees = localStorage.getItem('adminCoffee');
    return storedCoffees ? JSON.parse(storedCoffees) : [];
}

//update adminCoffee with new data
function updateAdminCoffee(products) {
    console.log('Updating admin coffee in localStorage:', products);
    localStorage.setItem('adminCoffee', JSON.stringify(products));
    console.log('Admin coffee updated in localStorage.', products);
}

//add a new product
function addNewProduct(event) {
    event.preventDefault();

    console.log('Add new product function called');

    const id = parseInt(document.getElementById('id').value);
    console.log('ID:', id);
    const title = document.getElementById('title').value;
    console.log('title:', title);
    const desc = document.getElementById('desc').value;
    console.log('desc:', desc);
    const longerDesc = document.getElementById('longerDesc').value;
    console.log('longerdesc:', longerDesc);
    const price = parseFloat(document.getElementById('price').value);
    console.log('price:', price);
    const rating = parseFloat(document.getElementById('rating').value);
    console.log('rating:', rating);
    const image = document.getElementById('image').value;
    console.log('image:', image);
    const newProduct = {
        id: id,
        title: title,
        desc: desc,
        longer_desc: longerDesc,
        price: price,
        rating: rating,
        image: image
    };
    console.log('New Product:', newProduct);
    addProductToList(newProduct);

    updateAdminCoffee(adminCoffee()); //uppdatera adminCoffee in localstorage

    event.target.reset();
}


function addProductToList(newProduct) {
    let products = adminCoffee();

    products.push(newProduct);

    localStorage.setItem('adminCoffee', JSON.stringify(products));
}
//lägg till ny produkt, localstorage uppdateras i adNewProduct
/*function addProductToList(product) {
    console.log('Adding product to list:', product);
    const products = adminCoffee();
    console.log('Existing products:', products);
    products.push(product);
    console.log('Updated products:', products);
    updateAdminCoffee(products);
}*/

//ta bort en produkt
function removeProduct(event) {
    event.preventDefault();

    const productId = parseInt(document.getElementById('removeProductId').value);

    removeProductById(productId);

    event.target.reset();
}

//tar bort en produkt från localstorage
function removeProductById(id) {
    const products = adminCoffee();
    const updatedProducts = products.filter(product => product.id !== id);
    localStorage.removeItem('adminCoffee');
    updateAdminCoffee(updatedProducts);
}
/*const products = adminCoffee().filter(product => product.id !== id);
localStorage.setItem('adminCoffee', JSON.stringify(products));
updateAdminCoffee(products);*/


function changeProductPrice(event) {
    event.preventDefault();

    const productId = parseInt(document.getElementById('changeProductId').value);
    const newPrice = parseFloat(document.getElementById('newPrice').value);

    changeProductPriceById(productId, newPrice);
    event.target.reset();
}


function changeProductPriceById(id, newPrice) {
    const products = adminCoffee();
    const updatedProducts = products.map(product => {
        if (product.id === id) {
            product.price = newPrice;
        }
        return product;
    });
    localStorage.setItem('adminCoffee', JSON.stringify(updatedProducts));
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('adminFormAdd').addEventListener('submit', addNewProduct);
    document.getElementById('adminFormChangePrice').addEventListener('submit', changeProductPrice);
    document.getElementById('adminFormRemove').addEventListener('submit', removeProduct);
});

