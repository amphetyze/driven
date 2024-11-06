const loader = document.querySelector('.loader');

function deleteLoaderFromDOM() {
    setTimeout(() => {
        loader.remove();
    }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    if (!sessionStorage.getItem('loader')) {
        sessionStorage.setItem('loader', 'true');
        deleteLoaderFromDOM();
    } else { loader.remove(); }
});


const startingTimeValue = '12:00:00'; 
let timerInterval;
let coins = parseFloat(localStorage.getItem('coins')) || 0;
let endTime = localStorage.getItem('endTime') ? new Date(localStorage.getItem('endTime')) : null;
let isButtonActive = localStorage.getItem('isButtonActive') === 'true';

function generateRandomNumber() {
    return (Math.random() * (200 - 100) + 100).toFixed(2);
}

function updateCoins() {
    const randomNumber = parseFloat(generateRandomNumber());
    coins += randomNumber;
    document.querySelector('.header__coins').textContent = coins.toFixed(2);
    localStorage.setItem('coins', coins);
}

function startTimer() {
    if (!endTime) return;

    timerInterval = setInterval(() => {
        const now = new Date();
        const timeLeft = endTime - now;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.querySelector('.button').classList.remove('active');
            document.querySelector('.button').removeAttribute('disabled');
            isButtonActive = false;
            localStorage.setItem('isButtonActive', isButtonActive);
            document.querySelector('.timer__text').textContent = startingTimeValue;
            return;
        }

        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        document.querySelector('.timer__text').textContent =
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');

        localStorage.setItem('endTime', endTime);
    }, 1000);

    document.querySelector('.button').classList.add('active');
    document.querySelector('.button').setAttribute('disabled', 'disabled');
    isButtonActive = true;
    localStorage.setItem('isButtonActive', isButtonActive);
}

document.querySelector('.button').addEventListener('click', (event) => {
    const button = event.currentTarget;
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        isButtonActive = false;
        localStorage.setItem('isButtonActive', isButtonActive);
        document.querySelector('.timer__text').textContent = startingTimeValue;
        endTime = null; 
        localStorage.removeItem('endTime');
    } else {
        updateCoins();
        const now = new Date();
        endTime = new Date(now.getTime() + 12 * 3600 * 1000); 
        localStorage.setItem('endTime', endTime);
        startTimer();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('dom is loaded');

    document.querySelector('.header__coins').textContent = coins.toFixed(2);

    if (endTime) {
        startTimer();
    } else {
        document.querySelector('.timer__text').textContent = startingTimeValue;
    }

    if (isButtonActive) {
        document.querySelector('.button').classList.add('active');
        document.querySelector('.button').setAttribute('disabled', 'disabled');
    }
});