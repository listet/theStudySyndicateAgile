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


function adminCoffee() {
    const storedCoffees = localStorage.getItem('adminCoffee');
    return storedCoffees ? JSON.parse(storedCoffees) : [];
}


function updateAdminCoffee(coffees) {
    localStorage.setItem('adminCoffee', JSON.stringify(coffees));
}


function addNewProduct(event) {
    event.preventDefault();

    const id = parseInt(document.getElementById('id').value);
    const title = document.getElementById('title').value;
    const desc = document.getElementById('desc').value;
    const longerDesc = document.getElementById('longerDesc').value;
    const price = parseFloat(document.getElementById('price').value);
    const rating = parseFloat(document.getElementById('rating').value);
    const image = document.getElementById('image').value;

    const newProduct = {
        id: id,
        title: title,
        desc: desc,
        longer_desc: longerDesc,
        price: price,
        rating: rating,
        image: image
    };

    addProductToList(newProduct);

    event.target.reset();
}


function addProductToList(product) {
    const products = adminCoffee();
    products.push(product);
    updateAdminCoffee(products);
}


function removeProduct(event) {
    event.preventDefault();

    const productId = parseInt(document.getElementById('removeProductId').value);

    removeProductById(productId);

    event.target.reset();
}



function removeProductById(id) {
    const products = adminCoffee().filter(product => product.id !== id);
    updateAdminCoffee(products);
}


function changeProductPrice(event) {
    event.preventDefault();

    const productId = parseInt(document.getElementById('changeProductId').value);
    const newPrice = parseFloat(document.getElementById('newPrice').value);

    changeProductPriceById(productId, newPrice);

    event.target.reset();
}


function changeProductPriceById(id, newPrice) {
    const products = adminCoffee();
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
        products[index].price = newPrice;
        updateAdminCoffee(products);
    }
}


document.getElementById('adminFormAdd').addEventListener('submit', addNewProduct);
document.getElementById('adminFormChangePrice').addEventListener('submit', changeProductPrice);
document.getElementById('adminFormRemove').addEventListener('submit', removeProduct);


