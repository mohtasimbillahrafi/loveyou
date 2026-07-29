// Screens & Elements
const setupScreen = document.getElementById('setupScreen');
const proposalScreen = document.getElementById('proposalScreen');
const customLetterInput = document.getElementById('customLetterInput');
const linkContainer = document.getElementById('linkContainer');
const shareLink = document.getElementById('shareLink');
const generateBtn = document.getElementById('generateBtn');

const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const letterModal = document.getElementById('letterModal');
const letterContent = document.getElementById('letterContent');

// বাংলা টেক্সট সাপোর্ট করার জন্য Base64 Encode ও Decode ফাংশন
function encodeMessage(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

function decodeMessage(str) {
    return decodeURIComponent(escape(atob(str)));
}

// 1. URL Check: বুঝতে হবে সে কি চিঠি বানাতে এসেছে নাকি প্রপোজাল পেয়েছে
const urlParams = new URLSearchParams(window.location.search);
const encryptedMsg = urlParams.get('msg');

if (encryptedMsg) {
    // প্রপোজাল মোড: লিংক তৈরি করার স্ক্রিন হাইড করে প্রপোজাল স্ক্রিন দেখাবে
    setupScreen.style.display = 'none';
    proposalScreen.style.display = 'block';
    
    // এনকোড করা কোড ডিকোড করে আসল চিঠিটি সেট করা (Yes চাপলে তবেই দেখাবে)
    try {
        letterContent.textContent = decodeMessage(encryptedMsg);
    } catch (e) {
        letterContent.textContent = "আপনার জন্য একটি মেসেজ ছিল, কিন্তু লিংকটি ভুল!";
    }
}

// 2. Link Generator Logic (নিজের URL-এ)
function generateLink() {
    const text = customLetterInput.value.trim();
    if (!text) {
        alert("দয়া করে কিছু লিখুন!");
        return;
    }
    
    // টেক্সটকে এনক্রিপ্ট করে পড়া অযোগ্য করা
    const encodedText = encodeMessage(text);
    
    // বর্তমান ওয়েবসাইটের লিংকের সাথে মেসেজ জুড়ে দেওয়া (কোনো থার্ড-পার্টি শর্টনার ছাড়া)
    const baseUrl = window.location.origin + window.location.pathname;
    const myOwnLink = `${baseUrl}?msg=${encodedText}`;
    
    shareLink.value = myOwnLink;
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
    const maxX = 150; 
    const maxY = 150; 

    const randomX = (Math.random() - 0.5) * 2 * maxX; 
    const randomY = (Math.random() - 0.5) * 2 * maxY;

    noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
}

noBtn.addEventListener('mouseover', escapeNoBtn);
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); 
    escapeNoBtn();
});

// 4. Yes Button Animation Logic
yesBtn.addEventListener('click', () => {
    letterModal.classList.add('active');
});

function closeModal() {
    letterModal.classList.remove('active');
}
