'use strict'

document.addEventListener('DOMContentLoaded', function () {
    initContentLogin();
});


function initContentLogin() {
    document.querySelector('#formContainerLogin').classList.remove('d-none');
    document.querySelector('#formContainerRegister').classList.add('d-none');
}

window.addEventListener('load', async () => {
    const loginForm = document.querySelector('#loginForm');
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('loginName').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        const gdprCheckbox = document.getElementById('gdprCheckbox');

        if (!username || !password || !gdprCheckbox.checked) {
            alert('Fylla i alla fält och markera gdpr-rutan.');
            return;
        }

        try {
            const userData = await fetchUserData();
            const user = userData.users.find(user => user.username === username && user.password === password);

            if (!user) {
                alert('Ogiltig användernamn eller lösenord.');
                return;
            }
            const role = user.role;
            if (role === 'admin') {
                window.location.href = 'profile.html' // ADMIN lägg till rätt html länk här!
            } else {
                window.location.href = 'profile.html' // USER lägg till rätt html länk här!
            }
        } catch (error) {
            alert('Login misslyckades', error);
        }
    });

    // Event listener för registerBtn
    const registerBtn = document.querySelector('#registerBtn');
    registerBtn.addEventListener('click', () => {
        initContentRegister();
    });
});

async function fetchUserData() {
    try {
        const response = await fetch('https://santosnr6.github.io/Data/airbeanusers.json');
        if (!response.ok) {
            throw new Error(`Misslyckade att hämta userdata (${response.status} ${response.statusText})`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fel när userdata hämtades: ', error);
        throw error;
    }
}

function initContentRegister() {
    console.log('registerForm')
    document.querySelector('#formContainerLogin').classList.add('d-none');
    document.querySelector('#formContainerRegister').classList.remove('d-none');
}

// function - getUsers

// function - addUser
