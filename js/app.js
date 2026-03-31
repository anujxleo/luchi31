// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Particle System for floating hearts and sparkles
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 200;
        this.size = Math.random() * 8 + 4; // heart size
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = -(Math.random() * 1.5 + 0.5); // float up
        this.color = Math.random() > 0.5 ? 'rgba(255, 102, 179, 0.6)' : 'rgba(179, 102, 255, 0.6)'; // Pink or Purple
        this.opacity = 1;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.05 + 0.01;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + Math.sin(this.wobble) * 20, this.y);
        ctx.scale(this.size / 20, this.size / 20);
        ctx.fillStyle = this.color;
        
        ctx.beginPath();
        ctx.moveTo(0, 5);
        ctx.bezierCurveTo(0, 0, -10, 0, -10, -10);
        ctx.bezierCurveTo(-10, -20, 0, -20, 0, -5);
        ctx.bezierCurveTo(0, -20, 10, -20, 10, -10);
        ctx.bezierCurveTo(10, 0, 0, 0, 0, 5);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.wobble += this.wobbleSpeed;
        
        if (this.y < -50) {
            this.y = canvas.height + 50;
            this.x = Math.random() * canvas.width;
        }
        this.draw();
    }
}

function initParticles() {
    particles = [];
    const numParticles = window.innerWidth < 768 ? 20 : 40;
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// Gift Box Interaction
const giftContainer = document.getElementById('gift-container');
const giftBox = document.getElementById('gift-box');
const giftReveal = document.getElementById('gift-reveal');
let giftOpened = false;

giftContainer.addEventListener('click', () => {
    if (giftOpened) return;
    giftOpened = true;

    // Open box animation
    giftBox.classList.add('open');
    document.querySelector('.click-hint').style.display = 'none';

    // Start playing music immediately to prevent browser autoplay block
    if (player && typeof player.playVideo === 'function') {
        player.playVideo();
        isPlaying = true;
        document.getElementById('music-icon').innerText = '⏸️';
    }

    // Trigger Confetti
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#b366ff', '#ff66b3', '#ffffff']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#b366ff', '#ff66b3', '#ffffff']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());

    // Show Message
    setTimeout(() => {
        giftContainer.style.display = 'none';
        giftReveal.classList.remove('hidden');
        giftReveal.classList.add('show');
        
        // Ensure scroll jumps to the revealed message nicely
        giftReveal.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1200);
});

// Scroll animations for gallery and final message
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
});

// YouTube Music Player Setup
let player;
let isPlaying = false;

function onYouTubeIframeAPIReady() {
    // BTS - Dynamite (Official Music Video) placeholder ID: gdZLi9oWNZg or Bungee: mbIaoaNww
    // For audio focus, we'll try a lyric video ID or just the official MV
    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: 'b4iVv91Z6lY', // BTS SWIM
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'showinfo': 0,
            'modestbranding': 1,
            'loop': 1,
            'playlist': 'b4iVv91Z6lY',
            'start': 31
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    // Ready to play when gift opens. Set volume to an enjoyable level
    event.target.setVolume(50);
}

const musicToggle = document.getElementById('music-toggle');
const musicIcon = document.getElementById('music-icon');

musicToggle.addEventListener('click', () => {
    if (!player) return;
    
    if (isPlaying) {
        player.pauseVideo();
        musicIcon.innerText = '🎵';
        isPlaying = false;
    } else {
        player.playVideo();
        musicIcon.innerText = '⏸️';
        isPlaying = true;
    }
});

// --- NEW FEATURE LOGIC --- //

// 1. Welcome Overlay Logic
document.body.style.overflow = 'hidden'; // Lock scroll completely on load
const welcomeOverlay = document.getElementById('welcome-overlay');
const text1 = document.getElementById('welcome-text-1');
const text2 = document.getElementById('welcome-text-2');
const enterBtn = document.getElementById('enter-btn');

setTimeout(() => { text1.style.opacity = '1'; }, 500);
setTimeout(() => { 
    text2.classList.remove('hidden'); 
    setTimeout(() => { text2.style.opacity = '1'; }, 50);
}, 2500);
setTimeout(() => { 
    enterBtn.classList.remove('hidden'); 
}, 4500);

enterBtn.addEventListener('click', () => {
    welcomeOverlay.classList.add('fade-out');
    document.body.style.overflow = 'auto'; // Unlock scroll
    // Start music automatically here
    if (player && typeof player.playVideo === 'function' && !isPlaying) {
        player.playVideo();
        isPlaying = true;
        document.getElementById('music-icon').innerText = '⏸️';
    }
});

// 2. Typewriter Effect
const typewriterText = document.getElementById('typewriter-text');
const fullText = "I don’t know how to explain this perfectly...\nbut having you in my life makes everything feel better.\nYou are not just my best friend...\nyou are my comfort, my happiness, my favorite person. 💜";
let typeIndex = 0;
let hasTyped = false;

const typewriteObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !hasTyped) {
        hasTyped = true;
        typeText();
    }
}, { threshold: 0.5 });

const typeSec = document.getElementById('typewriter-section');
if(typeSec) typewriteObserver.observe(typeSec);

function typeText() {
    if (typeIndex < fullText.length) {
        if(fullText.charAt(typeIndex) === '\n') {
            typewriterText.innerHTML += '<br>';
        } else {
            typewriterText.innerHTML += fullText.charAt(typeIndex);
        }
        typeIndex++;
        setTimeout(typeText, 60); // Speed
    }
}

// 4. Why You Are Special Logic
const specialBtn = document.getElementById('special-btn');
const specialContainer = document.getElementById('special-message-container');
const specialMessage = document.getElementById('special-message');

const specialLines = [
    "Because your smile changes everything.",
    "Because you make people feel safe.",
    "Because you are genuinely kind.",
    "Because you are unforgettable.",
    "Because you are one of a kind.",
    "Because your laugh is my favorite sound.",
    "Because you always know how to make me smile.",
    "Because you see the good in everyone.",
    "Because you light up every room you walk into.",
    "Because you are effortlessly beautiful inside and out.",
    "Because your energy is pure magic.",
    "Because you inspire me to be better.",
    "Because you naturally bring warmth to cold days.",
    "Because there is nobody else quite like you.",
    "Because you are simply Rajeshwari. 💜"
];
let availableLines = [...specialLines];

if(specialBtn) {
    specialBtn.addEventListener('click', () => {
        specialContainer.classList.remove('hidden');
        specialMessage.style.opacity = '0';
        
        setTimeout(() => {
            if(availableLines.length === 0) availableLines = [...specialLines];
            const randIndex = Math.floor(Math.random() * availableLines.length);
            specialMessage.innerText = availableLines[randIndex];
            availableLines.splice(randIndex, 1);
            specialMessage.style.opacity = '1';
        }, 300);
    });
}

// 5. Cake Interaction
const cakeInteraction = document.getElementById('cake-interaction');
const cakeWish = document.getElementById('cake-wish');
let cakeOpened = false;

if(cakeInteraction) {
    cakeInteraction.addEventListener('click', () => {
        if (cakeOpened) return;
        cakeOpened = true;
        
        cakeInteraction.classList.add('opened');
        
        // Confetti burst for Cake
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#b366ff', '#ff66b3', '#ffffff'] });
        
        setTimeout(() => {
            cakeWish.classList.remove('hidden');
        }, 1000);
    });
}

// 8. Gallery Modal Enhancements
const galleryModal = document.getElementById('gallery-modal');
const modalImage = document.getElementById('modal-image');
const modalCaption = document.getElementById('modal-caption');
const closeModalBtn = document.getElementById('close-modal');
const closeModalBackdrop = document.getElementById('close-modal-backdrop');

document.querySelectorAll('.gallery-card').forEach(card => {
    card.addEventListener('click', () => {
        const imgSrc = card.querySelector('img').src;
        const captionText = card.querySelector('.gallery-quote').innerText;
        
        modalImage.src = imgSrc;
        modalCaption.innerText = captionText;
        
        galleryModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });
});

function closeGallery() {
    galleryModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

if(closeModalBtn) closeModalBtn.addEventListener('click', closeGallery);
if(closeModalBackdrop) closeModalBackdrop.addEventListener('click', closeGallery);


// 7 & 10. Micro-interactions & Secret Message (5-Taps)
let tapCount = 0;
let tapTimer;
const secretModal = document.getElementById('secret-modal');
const closeSecretBtn = document.getElementById('close-secret');

window.addEventListener('click', (e) => {
    // Standard Touch Particle Generator
    const particle = document.createElement('div');
    particle.className = 'touch-particle';
    particle.style.left = (e.clientX - 7.5) + 'px';
    particle.style.top = (e.clientY - 7.5) + 'px';
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 1000);
    
    // Ripple Effect Check
    if (e.target.classList.contains('ripple-btn')) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        const rect = e.target.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';
        e.target.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }
    
    // Mobile Vibration
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }

    // Secret Tap Trigger Tracker
    tapCount++;
    if (tapCount === 1) {
        tapTimer = setTimeout(() => { tapCount = 0; }, 2000);
    }
    
    if (tapCount >= 5 && secretModal) {
        secretModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        tapCount = 0;
        clearTimeout(tapTimer);
        
        // Bonus confetti on secret find
        confetti({ particleCount: 300, spread: 180, origin: { y: 0.5 }, startVelocity: 40 });
    }
});

if(closeSecretBtn) {
    closeSecretBtn.addEventListener('click', () => {
        secretModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });
}

