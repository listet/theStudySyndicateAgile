async function getApi(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data; 
    } catch (error) { 
        console.log(error);
    }
}

async function showCoffee() {
    const kaffe = await getApi('https://santosnr6.github.io/Data/airbeanproducts.json');
    const menyRef = document.querySelector('.meny__overview');
    menyRef.innerHTML = '';

    kaffe.menu.forEach(coffee => {
        const coffeeArticle = document.createElement('article');
        coffeeArticle.classList.add('meny__article');
        const coffeeSection = document.createElement('section');
        coffeeSection.classList.add('meny_info-section');
        const button = document.createElement('button');
        button.classList.add('meny__button');
        button.innerHTML = '<img src="/Assets/add.svg">';
        const detailSection = document.createElement('section');
        detailSection.classList.add('detail-section');
        const title = document.createElement('h2');
        title.classList.add('meny__subtitle');
        const pRef = document.createElement('p');
        pRef.classList.add('meny__info');
        const price = document.createElement('h2');
        price.classList.add('meny__subtitle');

        title.innerHTML = coffee.title;
        pRef.innerHTML = coffee.desc;
        price.innerHTML = coffee.price + ' kr';

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