const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

const particles = [];
const particleCount = 80;
const emojiParticles = [];
const emojiCount = 15;
const emojis = ["🚀", "💻", "✨", "🎉", "🌟", "🔥"];


function resizeCanvas() {
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const scaleX = canvas.width / oldWidth;
    const scaleY = canvas.height / oldHeight;

    particles.forEach(p => {
        p.x *= scaleX;
        p.y *= scaleY;
    });
    emojiParticles.forEach(e => {
        e.x *= scaleX;
        e.y *= scaleY;
    });
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5;
        this.alpha = Math.random() * 0.5 + 0.5;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    draw() {
        ctx.fillStyle = `rgba(0,255,255,${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class EmojiParticle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 30 + 20;
        this.speedX = (Math.random() - 0.5) * 1.2;
        this.speedY = (Math.random() - 0.5) * 1.2;
        this.emoji = emojis[Math.floor(Math.random() * emojis.length)];
        this.angle = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.rotationSpeed;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.font = `${this.size}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.emoji, 0, 0);
        ctx.restore();
    }
}

for (let i = 0; i < particleCount; i++) particles.push(new Particle());
for (let i = 0; i < emojiCount; i++) emojiParticles.push(new EmojiParticle());

function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.strokeStyle = `rgba(0,255,255,${0.3 * (1 - dist / 100)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    emojiParticles.forEach(e => { e.update(); e.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
}

animate();