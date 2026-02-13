// 1. SET THE TARGET TIME (Feb 15, 2026, 00:30 AM Vietnam Time)
const targetDate = new Date("2026-02-15T00:30:00+07:00").getTime();

const timerDisplay = document.getElementById('timer');
const statusText = document.getElementById('status-text');
const giftBox = document.getElementById('gift-box');
const giftSection = document.getElementById('gift-section');
const audio = document.getElementById('valentineAudio');
let hasStarted = false;

function startMusic() {
    if (audio && !hasStarted) {
        hasStarted = true; // Prevents the fade-in from triggering multiple times
        
        audio.volume = 0; // Start at silence
        audio.play().then(() => {
            // FADE IN LOGIC
            let fadeVolume = 0;
            const fadeSpeed = 0.05; // How much volume increases per step
            const fadeInterval = 200; // Speed of steps in milliseconds (200ms)

            const fadeIn = setInterval(() => {
                if (fadeVolume < 1) {
                    fadeVolume += fadeSpeed;
                    // Fix floating point math issues (e.g., 0.9500000001)
                    audio.volume = Math.min(fadeVolume, 1); 
                } else {
                    clearInterval(fadeIn); // Stop interval when volume hits 1
                }
            }, fadeInterval);

            // Clean up listeners
            window.removeEventListener('click', startMusic);
            window.removeEventListener('touchstart', startMusic);
        }).catch(err => {
            hasStarted = false; // Reset if play was blocked
            console.log("Waiting for interaction...");
        });
    }
}

window.addEventListener('click', startMusic);
window.addEventListener('touchstart', startMusic);


// --- 3. COUNTDOWN LOGIC ---
function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = targetDate - now;

    if (timeLeft <= 0) {
        timerDisplay.innerText = "OPEN ME! ❤️";
        statusText.innerText = "The wait is over...";
        giftSection.classList.add('ready');
        return true;
    }

    const d = Math.floor(timeLeft / 86400000);
    const h = Math.floor((timeLeft % 86400000) / 3600000);
    const m = Math.floor((timeLeft % 3600000) / 60000);
    const s = Math.floor((timeLeft % 60000) / 1000);

    const format = (n) => (n < 10 ? `0${n}` : n);
    timerDisplay.innerText = `${d}d ${format(h)}h ${format(m)}m ${format(s)}s`;
    return false;
}
setInterval(updateCountdown, 1000);
updateCountdown();


// --- 4. ALERT LOGIC (The Lovely Message) ---
function showSweetAlert() {
    const alertBox = document.getElementById('custom-alert');
    alertBox.classList.add('alert-visible');
    
    const hideAlert = () => alertBox.classList.remove('alert-visible');
    alertBox.onclick = hideAlert;
    setTimeout(hideAlert, 3500);
}


// --- 5. BOX INTERACTION ---
giftBox.addEventListener('click', () => {
    const now = new Date().getTime();
    
    if (now < targetDate) {
        // TOO EARLY
        giftBox.classList.add('shake');
        showSweetAlert();
        setTimeout(() => giftBox.classList.remove('shake'), 500);
    } else {
        // IT IS TIME
        openGift();
    }
});


// --- 6. NAVIGATION LOGIC (Lid opens, then changes website) ---
function openGift() {
    // Start opening animation
    giftSection.classList.add('open-box');
    
    // NO music.play() here anymore - it's already playing from the first click!

    setTimeout(() => {
        // REPLACE this with your actual bouquet website URL
        window.location.href = "https://aungmoe07.github.io/LoveLetter/"; 
    }, 0); // Slightly longer wait to let her see the lid fly off
}