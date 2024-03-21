'use strict'

//kör igång hämtningen från apin om adminCoffee är tom
document.addEventListener('DOMContentLoaded', function () {
    if (adminCoffee().length === 0) {
        initializeAdminCoffee();
    }
});


async function getApi(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

//get coffees från api'n och spara som data.
async function initializeAdminCoffee() {
    try {
        const url = 'https://santosnr6.github.io/Data/airbeanproducts.json';
        const data = await getApi(url);
        updateAdminCoffee(data.menu);
    } catch (error) {
        console.log(error);
    }
}

//get alla coffees lagrad i localstorage
export function adminCoffee() {
    const storedCoffees = localStorage.getItem('adminCoffee');
    return storedCoffees ? JSON.parse(storedCoffees) : [];
}

//uppdatera adminCoffee med ny data
function updateAdminCoffee(products) {
    localStorage.setItem('adminCoffee', JSON.stringify(products));
}

//lägga till en ny produkt med samma nycklar som api'n
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
    updateAdminCoffee(adminCoffee());
    event.target.reset();
}

//lägg till ny produkt, localstorage uppdateras i addNewProduct
function addProductToList(newProduct) {
    let products = adminCoffee();
    products.push(newProduct);
    localStorage.setItem('adminCoffee', JSON.stringify(products));
}

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

