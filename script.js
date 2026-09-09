const setupScreen = document.getElementById('setupScreen');
const proposalScreen = document.getElementById('proposalScreen');
const startOverlay = document.getElementById('startOverlay');
const openSurpriseBtn = document.getElementById('openSurpriseBtn');

const customLetterInput = document.getElementById('customLetterInput');
const audioLinkInput = document.getElementById('audioLinkInput');
const linkContainer = document.getElementById('linkContainer');
const shareLink = document.getElementById('shareLink');
const generateBtn = document.getElementById('generateBtn');

const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const letterModal = document.getElementById('letterModal');
const letterContent = document.getElementById('letterContent');
const bgAudio = document.getElementById('bgAudio');

// কপিরাইট-মুক্ত রোমান্টিক সফট পিয়ানো মিউজিক (ডিফল্ট ব্যাকআপ)
const DEFAULT_MUSIC = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3';

let proposalData = null;

// 1. URL চেক করে ডাটা আনা
const urlParams = new URLSearchParams(window.location.search);
const shortId = urlParams.get('id');

if (shortId) {
    setupScreen.style.display = 'none';
    
    fetch('https://bytebin.lucko.me/' + shortId)
        .then(res => {
            if(res.ok) return res.text();
            throw new Error('Not found');
        })
        .then(text => {
            try {
                proposalData = JSON.parse(text);
            } catch (e) {
                proposalData = { msg: text, audio: DEFAULT_MUSIC };
            }
            
            letterContent.textContent = proposalData.msg;
            startOverlay.style.display = 'flex'; // গিফট বক্স স্ক্রিন ওপেন
        })
        .catch(err => {
            letterContent.textContent = "আপনার জন্য একটি মেসেজ ছিল, কিন্তু লিংকটি ভুল বা মেয়াদ শেষ!";
            proposalScreen.style.display = 'block';
        });
}

// 2. গিফটে ক্লিক করলেই গান বাজবে (১০০% কাজ করবে)
openSurpriseBtn.addEventListener('click', () => {
    startOverlay.style.display = 'none';
    proposalScreen.style.display = 'block';

    const audioSource = (proposalData && proposalData.audio) ? proposalData.audio : DEFAULT_MUSIC;
    bgAudio.src = audioSource;
    bgAudio.play().catch(e => console.log("Audio play error:", e));
});

// 3. Link Generator
async function generateLink() {
    const text = customLetterInput.value.trim();
    if (!text) return alert("দয়া করে চিঠি লিখুন!");
    
    const customAudio = audioLinkInput.value.trim() || DEFAULT_MUSIC;
    const dataObj = { msg: text, audio: customAudio };

    generateBtn.textContent = "Link তৈরি হচ্ছে... ⏳";
    generateBtn.disabled = true;
    
    try {
        const response = await fetch('https://bytebin.lucko.me/post', {
            method: 'POST',
            body: JSON.stringify(dataObj),
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            const data = await response.json();
            shareLink.value = `${window.location.origin}${window.location.pathname}?id=${data.key}`;
            linkContainer.style.display = 'block';
        } else {
            alert("লিংক তৈরি করতে সমস্যা হয়েছে!");
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
    setTimeout(() => { document.getElementById('copyBtn').textContent = "Copy Link"; }, 2000);
}

// 4. No Button Escaping Trick
function moveNoBtn() {
    const maxX = 150; 
    const maxY = 150;
    const randomX = (Math.random() - 0.5) * maxX * 1.5;
    const randomY = (Math.random() - 0.5) * maxY * 1.5;
    noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
}

noBtn.addEventListener('mouseover', moveNoBtn);
noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveNoBtn(); });

// 5. Yes Button ও Modal Logic
yesBtn.addEventListener('click', () => { 
    letterModal.style.display = 'flex'; 
});

function closeModal() { 
    letterModal.style.display = 'none'; 
}

function createNew() { 
    window.location.href = window.location.origin + window.location.pathname; 
}
