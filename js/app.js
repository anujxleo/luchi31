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
        
        // Start playing music
        if (player && typeof player.playVideo === 'function') {
            player.playVideo();
            isPlaying = true;
            document.getElementById('music-icon').innerText = '⏸️';
        }
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
