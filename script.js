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

// 1. URL Check: শর্ট ID আছে কি না চেক করা
const urlParams = new URLSearchParams(window.location.search);
const shortId = urlParams.get('id');

if (shortId) {
    // প্রপোজাল মোড: লিংক তৈরি করার স্ক্রিন হাইড করে প্রপোজাল স্ক্রিন দেখাবে
    setupScreen.style.display = 'none';
    proposalScreen.style.display = 'block';
    
    // ক্লাউড থেকে আপনার চিঠিটি খুঁজে বের করা
    fetch('https://bytebin.lucko.me/' + shortId)
        .then(res => {
            if(res.ok) return res.text();
            throw new Error('Not found');
        })
        .then(text => {
            letterContent.textContent = text;
        })
        .catch(err => {
            letterContent.textContent = "আপনার জন্য একটি মেসেজ ছিল, কিন্তু লিংকটি ভুল বা মেয়াদ শেষ!";
        });
}

// 2. Link Generator Logic (Cloud API দিয়ে শর্ট লিংক)
async function generateLink() {
    const text = customLetterInput.value.trim();
    if (!text) {
        alert("দয়া করে কিছু লিখুন!");
        return;
    }
    
    // লোডিং দেখানো
    generateBtn.textContent = "Link তৈরি হচ্ছে... ⏳";
    generateBtn.disabled = true;
    
    try {
        // ফ্রি ক্লাউড API-তে চিঠি সেভ করা
        const response = await fetch('https://bytebin.lucko.me/post', {
            method: 'POST',
            body: text,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
        
        if (response.ok) {
            const data = await response.json();
            // আপনার নিজস্ব ওয়েবসাইটের ছোট লিংক তৈরি
            const baseUrl = window.location.origin + window.location.pathname;
            const myOwnShortLink = `${baseUrl}?id=${data.key}`;
            
            shareLink.value = myOwnShortLink;
            linkContainer.style.display = 'block';
        } else {
            alert("লিংক তৈরি করতে সমস্যা হয়েছে, আবার চেষ্টা করুন!");
        }
    } catch (error) {
        alert("ইন্টারনেট কানেকশন চেক করুন!");
    }
    
    generateBtn.textContent = "Link তৈরি করুন 🔗";
    generateBtn.disabled = false;
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
