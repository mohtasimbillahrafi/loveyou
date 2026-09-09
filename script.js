// Elements
const setupScreen = document.getElementById('setupScreen');
const proposalScreen = document.getElementById('proposalScreen');
const startOverlay = document.getElementById('startOverlay');
const openSurpriseBtn = document.getElementById('openSurpriseBtn');

const customLetterInput = document.getElementById('customLetterInput');
const ytLinkInput = document.getElementById('ytLinkInput');
const ytTimeInput = document.getElementById('ytTimeInput');
const linkContainer = document.getElementById('linkContainer');
const shareLink = document.getElementById('shareLink');
const generateBtn = document.getElementById('generateBtn');

const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const letterModal = document.getElementById('letterModal');
const letterContent = document.getElementById('letterContent');
const ytPlayerContainer = document.getElementById('ytPlayerContainer');

let proposalData = null;

function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// 1. Check Link & Load Data
const urlParams = new URLSearchParams(window.location.search);
const shortId = urlParams.get('id');

if (shortId) {
    setupScreen.style.display = 'none'; // Setup স্ক্রিন লুকানো
    
    fetch('https://bytebin.lucko.me/' + shortId)
        .then(res => {
            if(res.ok) return res.text();
            throw new Error('Not found');
        })
        .then(text => {
            try {
                proposalData = JSON.parse(text);
            } catch (e) {
                proposalData = { msg: text, yt: null, time: 0 };
            }
            
            letterContent.textContent = proposalData.msg;

            if (proposalData.yt) {
                startOverlay.style.display = 'flex'; // গিফট বক্স দেখানো
                
                // ম্যাজিক ফিক্স: পেজ লোড হওয়ার সাথেই ভিডিও রেডি করে রাখা হবে (কিন্তু বাজবে না)
                ytPlayerContainer.innerHTML = ''; 
                const iframe = document.createElement('iframe');
                iframe.id = 'ytMusicPlayer';
                // enablejsapi=1 থাকা বাধ্যতামূলক কমান্ড পাঠানোর জন্য
                iframe.setAttribute('src', `https://www.youtube.com/embed/${proposalData.yt}?enablejsapi=1&autoplay=0&start=${proposalData.time}&controls=0`);
                iframe.setAttribute('allow', 'autoplay; encrypted-media');
                
                // স্ক্রিন থেকে লুকিয়ে রাখা
                iframe.style.position = 'absolute';
                iframe.style.top = '-9999px';
                iframe.style.left = '-9999px';
                iframe.style.width = '10px';
                iframe.style.height = '10px';
                iframe.style.opacity = '0';
                
                ytPlayerContainer.appendChild(iframe);
            } else {
                proposalScreen.style.display = 'block';
            }
        })
        .catch(err => {
            letterContent.textContent = "আপনার জন্য একটি মেসেজ ছিল, কিন্তু লিংকটি ভুল বা মেয়াদ শেষ!";
            proposalScreen.style.display = 'block';
        });
}

// 2. Play Music on Click (The Final Fix)
openSurpriseBtn.addEventListener('click', () => {
    startOverlay.style.display = 'none'; 
    proposalScreen.style.display = 'block'; 

    const iframe = document.getElementById('ytMusicPlayer');
    if (iframe && iframe.contentWindow) {
        // ইউজারের ক্লিকের সাথেই YouTube-কে সিক্রেট কমান্ড পাঠানো হচ্ছে মিউজিক প্লে করার জন্য
        iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    }
});

// 3. Link Generator
async function generateLink() {
    const text = customLetterInput.value.trim();
    if (!text) return alert("দয়া করে কিছু লিখুন!");
    
    const ytUrl = ytLinkInput.value.trim();
    const ytId = ytUrl ? getYouTubeId(ytUrl) : null;
    const ytTime = ytTimeInput.value ? parseInt(ytTimeInput.value) : 0;

    const dataObj = { msg: text, yt: ytId, time: ytTime };

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

// 5. Yes Button Fix
yesBtn.addEventListener('click', () => { 
    letterModal.style.display = 'flex'; 
});

function closeModal() { 
    letterModal.style.display = 'none'; 
}

function createNew() { 
    window.location.href = window.location.origin + window.location.pathname; 
}
