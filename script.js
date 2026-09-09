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

let proposalData = null;
let ytPlayer = null;

// YouTube Video ID এক্সট্র্যাক্ট ফাংশন
function getYouTubeId(url) {
    if (!url) return '8UiAH3tJUTs';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '8UiAH3tJUTs';
}

// 1. URL চেক করে ডেটা লোড
const urlParams = new URLSearchParams(window.location.search);
const shortId = urlParams.get('id');

if (shortId) {
    setupScreen.style.display = 'none';
    
    fetch('https://bytebin.lucko.me/' + shortId)
        .then(res => res.ok ? res.text() : Promise.reject('Not found'))
        .then(text => {
            try {
                proposalData = JSON.parse(text);
            } catch (e) {
                proposalData = { msg: text, yt: '8UiAH3tJUTs', time: 14 };
            }
            
            letterContent.textContent = proposalData.msg;
            startOverlay.style.display = 'flex';
            
            // YouTube Player ইনিশিয়ালাইজ করা
            initYouTubePlayer(proposalData.yt || '8UiAH3tJUTs', proposalData.time || 14);
        })
        .catch(err => {
            letterContent.textContent = "আপনার জন্য একটি মেসেজ ছিল, কিন্তু লিংকটি ভুল বা মেয়াদ শেষ!";
            proposalScreen.style.display = 'block';
        });
}

// YouTube Player Initializer
function initYouTubePlayer(videoId, startTime) {
    function createPlayer() {
        ytPlayer = new YT.Player('ytPlayer', {
            height: '200',
            width: '200',
            videoId: videoId,
            playerVars: {
                'autoplay': 0,
                'controls': 0,
                'start': startTime,
                'playsinline': 1,
                'origin': window.location.origin
            }
        });
    }

    if (window.YT && window.YT.Player) {
        createPlayer();
    } else {
        window.onYouTubeIframeAPIReady = createPlayer;
    }
}

// 2. গিফটে ক্লিক করলে স্ক্রিন ওপেন এবং মিউজিক শুরু
openSurpriseBtn.addEventListener('click', () => {
    startOverlay.style.display = 'none';
    proposalScreen.style.display = 'block';

    if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
        ytPlayer.unMute();
        ytPlayer.setVolume(100);
        if (proposalData && proposalData.time) {
            ytPlayer.seekTo(proposalData.time, true);
        }
        ytPlayer.playVideo();
    }
});

// 3. Link Generator
async function generateLink() {
    const text = customLetterInput.value.trim();
    if (!text) return alert("দয়া করে কিছু চিঠি লিখুন!");
    
    const ytUrl = ytLinkInput.value.trim() || 'https://youtu.be/8UiAH3tJUTs';
    const ytId = getYouTubeId(ytUrl);
    const ytTime = ytTimeInput.value ? parseInt(ytTimeInput.value) : 14;

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

// 5. Yes Button & Modal
yesBtn.addEventListener('click', () => { 
    letterModal.style.display = 'flex'; 
});

function closeModal() { 
    letterModal.style.display = 'none'; 
}

function createNew() { 
    window.location.href = window.location.origin + window.location.pathname; 
}
