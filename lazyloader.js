function lazyloader() {
    const loadingImg = document.createElement('img');
    loadingImg.src = '../Assets/loader.png';
    loadingImg.classList.add('loading');
    document.body.appendChild(loadingImg);
}

lazyloader();

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(function() {
    const loadingImg = document.querySelector('.loading');
    loadingImg.remove();
    console.log('DOM fully loaded and parsed');
    }, 500);
});