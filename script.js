const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const letterModal = document.getElementById('letterModal');
const closeBtn = document.getElementById('closeBtn');
const letterContent = document.getElementById('letterContent');

// dynamic letter customizer from URL search params
const urlParams = new URLSearchParams(window.location.search);
const customMessage = urlParams.get('msg');

if (customMessage) {
    letterContent.textContent = decodeURIComponent(customMessage);
}

// Function to move No button
function moveNoButton() {
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth - 50);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - 50);
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
}

// Mouseover & Touchstart event for mobile and desktop
noBtn.addEventListener('mouseover', moveNoButton);
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
});

// Show Letter Modal on Yes click
yesBtn.addEventListener('click', () => {
    letterModal.style.display = 'flex';
});

// Close Modal
closeBtn.addEventListener('click', () => {
    letterModal.style.display = 'none';
});
