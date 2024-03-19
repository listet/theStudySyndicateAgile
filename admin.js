'use strict'

import { getApi } from "./script.js";


async function initializeAdminCoffee() {
    try {
        const url = 'https://santosnr6.github.io/Data/airbeanproducts.json';
        const data = await getApi(url);
        updateAdminCoffee(data.menu);
    } catch (error) {
        console.log(error);
    }
}

// Function to get stored coffee data from localStorage
function adminCoffee() {
    const storedCoffees = localStorage.getItem('adminCoffee');
    return storedCoffees ? JSON.parse(storedCoffees) : [];
}

// Function to update stored coffee data in localStorage
function updateAdminCoffee(coffees) {
    localStorage.setItem('adminCoffee', JSON.stringify(coffees));
}

// Function to add a new coffee to the list
function addNewProduct(event) {
    event.preventDefault(); // Prevent form submission

    // Get form inputs
    const id = parseInt(document.getElementById('id').value);
    const title = document.getElementById('title').value;
    const desc = document.getElementById('desc').value;
    const longerDesc = document.getElementById('longerDesc').value;
    const price = parseFloat(document.getElementById('price').value);
    const rating = parseFloat(document.getElementById('rating').value);
    const image = document.getElementById('image').value;

    // Create new product object
    const newProduct = {
        id: id,
        title: title,
        desc: desc,
        longer_desc: longerDesc,
        price: price,
        rating: rating,
        image: image
    };

    // Add new product to the list
    addProductToList(newProduct);

    // Reset form
    event.target.reset();
}

// Function to add the new product to the list
function addProductToList(product) {
    const products = adminCoffee();
    products.push(product);
    updateAdminCoffee(products);
}

// Function to remove a product from the list by ID
function removeProduct(event) {
    event.preventDefault(); // Prevent form submission

    // Get product ID to remove
    const productId = parseInt(document.getElementById('removeProductId').value);

    // Remove product
    removeProductById(productId);

    // Reset form
    event.target.reset();
}

// Function to remove a product from the list by ID
function removeProductById(id) {
    const products = adminCoffee().filter(product => product.id !== id);
    updateAdminCoffee(products);
}

// Function to change the price of a product by ID
function changeProductPrice(event) {
    event.preventDefault(); // Prevent form submission

    // Get form inputs
    const productId = parseInt(document.getElementById('changeProductId').value);
    const newPrice = parseFloat(document.getElementById('newPrice').value);

    // Change product price
    changeProductPriceById(productId, newPrice);

    // Reset form
    event.target.reset();
}

// Function to change the price of a product by ID
function changeProductPriceById(id, newPrice) {
    const products = adminCoffee();
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
        products[index].price = newPrice;
        updateAdminCoffee(products);
    }
}

// Add event listener to form submit events
document.getElementById('addProductForm').addEventListener('submit', addNewProduct);
document.getElementById('removeProductForm').addEventListener('submit', removeProduct);
document.getElementById('changePriceForm').addEventListener('submit', changeProductPrice);

