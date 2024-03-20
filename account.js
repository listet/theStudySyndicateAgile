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
    // Kollar om user eller email redan finns
    if (existingUsers.some(users => users.username === username)) {
        return 'Username already exists.';
    }
    if (existingUsers.some(user => user.email === email)) {
        return 'Email already exists.';
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
                'nodeRef': document.querySelector('#registerName'),
                'msg': 'Användarnamnet måste vara mellan 6 och 20 tecken långt.'
            };
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            throw {
                'nodeRef': document.querySelector('#registerEmail'),
                'msg': 'Invalid email address.'
            };
        }
        if (password.length < 8) {
            throw {
                'nodeRef': document.querySelector('#registerPassword'),
                'msg': 'Lösenordet måste vara minst 8 tecken långt.'
            };
        }

        if (!passwordRegex.test(password)) {
            throw {
                'nodeRef': document.querySelector('#registerPassword'),
                'msg': 'Lösenordet måste både innehålla stora och små bokstäver samt minst en siffra.'
            };
        }

        if (password !== passwordAgain) {
            throw {
                'nodeRef': document.querySelector('#registerPasswordAgain'),
                'msg': 'Lösenordet matchar inte.'
            }
        }

        // Check if the username already exists
        if (userData.users.some(user => user.username === username)) {
            throw {
                'nodeRef': document.querySelector('#registerName'),
                'msg': 'username already exists.'
            };
        }

        // Check if the email already exists
        if (userData.users.some(user => user.email === email)) {
            throw {
                'nodeRef': document.querySelector('#registerEmail'),
                'msg': 'email already exists.'
            };
        }

        if (!gdprCheckbox.checked) {
            throw {
                'nodeRef': document.querySelector('#gdprCheckboxRegister'),
                'msg': 'Checkboxen måste vara icheckad.'
            };
        }


        const registrationError = registerUserToLocal(username, email, password);
        if (registrationError) {
            throw {
                'nodeRef': document.querySelector('#registerName'), // You can choose to focus on username field or email field
                'msg': registrationError
            };
        }

        console.log('success!')
        errorMsg.innerHTML = '';
        window.location.href = 'profile.html';
    } catch (error) {
        if (error.nodeRef) {
            error.nodeRef.focus();
        }
        console.log(error);
        errorMsg.textContent = error.msg;
    }
}
