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

    let regBtn = document.querySelector('#RegisterUserBtn');
    regBtn.addEventListener('click', (event) => {
        event.preventDefault();
        validateRegistration(event)
    });
}

function registerUserToLocal(username, email, password) {
    let existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    // Kollar om user eller email redan finns i localStorage
    if (existingUsers.some(users => users.username === username)) {
        return 'Användarnamnet existerar redan.';
    }
    if (existingUsers.some(user => user.email === email)) {
        return 'Emailadressen existerar redan.';
    }
    // Lägger till user
    existingUsers.push({ username, email, password });
    // sparar i local storage
    localStorage.setItem('users', JSON.stringify(existingUsers));
}

async function validateRegistration(event) {
    event.preventDefault();

    try {
        let username = document.querySelector('#registerName').value;
        let email = document.querySelector('#registerEmail').value;
        let password = document.querySelector('#registerPassword').value;
        let passwordAgain = document.querySelector('#registerPasswordAgain').value;
        let errorMsg = document.querySelector('#errorMsg');
        let passwordRegex = /^(?=.*[a-ö])(?=.*[A-Ö])(?=.*\d).{8,}$/;
        const gdprCheckbox = document.querySelector('#gdprCheckboxRegister');
        const userData = await fetchUserData();

        if (username.length < 6 || username.length > 20) {
            throw {
                'msg': 'Användarnamnet måste vara mellan 6 och 20 tecken långt.'
            };
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            throw {
                'msg': 'Ogiltig e-postadress.'
            };
        }
        if (password.length < 8) {
            throw {
                'msg': 'Lösenordet måste vara minst 8 tecken långt.'
            };
        }
        if (!passwordRegex.test(password)) {
            throw {
                'msg': 'Lösenordet måste både innehålla stora och små bokstäver samt minst en siffra.'
            };
        }
        if (password !== passwordAgain) {
            throw {
                'msg': 'Lösenordet matchar inte.'
            }
        }
        if (userData.users.some(user => user.username === username)) {
            throw {
                'msg': 'Användarnamnet existerar redan.'
            };
        }
        if (userData.users.some(user => user.email === email)) {
            throw {
                'msg': 'Emailadressen existerar redan.'
            };
        }
        if (!gdprCheckbox.checked) {
            throw {
                'msg': 'Checkboxen måste vara icheckad.'
            };
        }
        //Kallar på funktion RegisterUserToLocal för att gämföra användarnamn samt mail gentemot LocalStorage samt spara.
        const registrationError = registerUserToLocal(username, email, password);
        if (registrationError) {
            throw {
                'msg': registrationError
            };
        }
        console.log('success!')
        errorMsg.innerHTML = '';
        window.location.href = 'profile.html';
    } catch (error) {
        console.log(error);
        errorMsg.textContent = error.msg;
    }
}
