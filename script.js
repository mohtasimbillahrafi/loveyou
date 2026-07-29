// Screens & Elements
const setupScreen = document.getElementById('setupScreen');
const proposalScreen = document.getElementById('proposalScreen');
const customLetterInput = document.getElementById('customLetterInput');
const linkContainer = document.getElementById('linkContainer');
const shareLink = document.getElementById('shareLink');

const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const letterModal = document.getElementById('letterModal');
const letterContent = document.getElementById('letterContent');

// 1. URL Check: বুঝতে হবে সে কি চিঠি বানাতে এসেছে নাকি প্রপোজাল পেয়েছে
const urlParams = new URLSearchParams(window.location.search);
const encryptedMsg = urlParams.get('msg');

if (encryptedMsg) {
    // প্রপোজাল মোড: লিংক তৈরি করার স্ক্রিন হাইড করে প্রপোজাল স্ক্রিন দেখাবে
    setupScreen.style.display = 'none';
    proposalScreen.style.display = 'block';
    
    // মেসেজ ডিকোড করে চিঠিতে সেট করা
    letterContent.textContent = decodeURIComponent(encryptedMsg);
}

// 2. Link Generator Logic
function generateLink() {
    const text = customLetterInput.value.trim();
    if (!text) {
        alert("দয়া করে কিছু লিখুন!");
        return;
    }
    
    // টেক্সটকে URL ফ্রেন্ডলি করা
    const encodedText = encodeURIComponent(text);
    
    // বর্তমান ওয়েবসাইটের লিংকের সাথে মেসেজ জুড়ে দেওয়া
    const baseUrl = window.location.origin + window.location.pathname;
    const finalLink = `${baseUrl}?msg=${encodedText}`;
    
    shareLink.value = finalLink;
    linkContainer.style.display = 'block';
}

function copyLink() {
    shareLink.select();
    document.execCommand('copy');
    document.getElementById('copyBtn').textContent = "Copied! ✔️";
    setTimeout(() => {
        document.getElementById('copyBtn').textContent = "Copy Link";
    }, 2000);
}

// 3. No Button Trick Logic (Smooth Escape)
function escapeNoBtn() {
    // বাটনটিকে কার্ডের ভেতরে রেন্ডম পজিশনে সরানো
    const maxX = 150; // ডানে-বামে কতদূর যাবে
    const maxY = 150; // উপরে-নিচে কতদূর যাবে

    const randomX = (Math.random() - 0.5) * 2 * maxX; 
    const randomY = (Math.random() - 0.5) * 2 * maxY;

    noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
}

noBtn.addEventListener('mouseover', escapeNoBtn);
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // মোবাইলে টাচ করলে ক্লিক হওয়া আটকাবে
    escapeNoBtn();
});

// 4. Yes Button Animation Logic
yesBtn.addEventListener('click', () => {
    letterModal.classList.add('active'); // এনিমেশন ট্রিগার করবে
});

function closeModal() {
    letterModal.classList.remove('active');
}
