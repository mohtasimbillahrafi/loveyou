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

// YouTube Link থেকে Video ID বের করার ফাংশন
function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// 1. URL Check: শর্ট ID আছে কি না চেক করা
const urlParams = new URLSearchParams(window.location.search);
const shortId = urlParams.get('id');

if (shortId) {
    setupScreen.classList.add('hidden');
    
    // ক্লাউড থেকে ডাটা নিয়ে আসা
    fetch('https://bytebin.lucko.me/' + shortId)
        .then(res => res.ok ? res.text() : Promise.reject('Not found'))
        .then(text => {
            try {
                proposalData = JSON.parse(text);
            } catch (e) {
                proposalData = { msg: text, yt: null, time: 0 }; 
            }
            
            letterContent.textContent = proposalData.msg;

            // যদি গান থাকে, তবে "Tap to Open" স্ক্রিন দেখাবে এবং ব্যাকগ্রাউন্ডে Iframe রেডি করে রাখবে
            if (proposalData.yt) {
                startOverlay.classList.remove('hidden');
                // Iframe আগে থেকেই লোড করা হচ্ছে, কিন্তু প্লে হবে না
                ytPlayerContainer.innerHTML = `<iframe id="ytMusicPlayer" width="10" height="10" 
                    src="https://www.youtube.com/embed/${proposalData.yt}?enablejsapi=1&start=${proposalData.time}&autoplay=0" 
                    allow="autoplay" style="position:absolute; opacity:0; z-index:-10;"></iframe>`;
            } else {
                proposalScreen.classList.remove('hidden');
            }
        })
        .catch(err => {
            letterContent.textContent = "আপনার জন্য একটি মেসেজ ছিল, কিন্তু লিংকটি ভুল বা মেয়াদ শেষ!";
            proposalScreen.classList.remove('hidden');
        });
}

// 2. "Tap to Open" বাটনে ক্লিক করলে গান বাজবে
openSurpriseBtn.addEventListener('click', () => {
    // স্ক্রিন ট্রানজিশন
    startOverlay.style.opacity = '0';
    setTimeout(() => {
        startOverlay.classList.add('hidden');
        proposalScreen.classList.remove('hidden');
    }, 400);

    // মিউজিক প্লে ট্রিগার (ইউজার ক্লিকের সাথে সাথেই src আপডেট করে প্লে করা হচ্ছে)
    if (proposalData && proposalData.yt) {
        const player = document.getElementById('ytMusicPlayer');
        if(player) {
            // এটি ব্রাউজারের অটো-প্লে ব্লক বাইপাস করবে কারণ ইউজারের ক্লিকের ভেতরেই এটি ট্রিগার হচ্ছে
            player.src = `https://www.youtube.com/embed/${proposalData.yt}?enablejsapi=1&start=${proposalData.time}&autoplay=1`;
        }
    }
});

// 3. Link Generator Logic
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

// 4. No Button Trick (অ্যাডভান্সড ম্যাথ দিয়ে স্মুথ করা হয়েছে)
function moveNoBtn() {
    const card = document.getElementById('proposalScreen');
    const cardRect = card.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    
    const maxX = cardRect.width - btnRect.width - 20;
    const maxY = cardRect.height - btnRect.height - 20;
    
    const randomX = (Math.random() - 0.5) * maxX * 1.5;
    const randomY = (Math.random() - 0.5) * maxY * 1.5;
    
    noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
}

noBtn.addEventListener('mouseover', moveNoBtn);
noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveNoBtn(); });

// 5. Yes Button & Modal Logic
yesBtn.addEventListener('click', () => { letterModal.classList.add('active'); });
function closeModal() { letterModal.classList.remove('active'); }
function createNew() { window.location.href = window.location.origin + window.location.pathname; }
