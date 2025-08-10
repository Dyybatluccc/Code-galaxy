// script.js
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "NhatDuy-15.07.06ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+";
const fontSize = 14;
const columns = Math.floor(canvas.width / fontSize);
const drops = Array(columns).fill(1);
let hue = 0;

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = letters.charAt(Math.floor(Math.random() * letters.length));
    const color = `hsl(${(hue + i * 10) % 360}, 100%, 60%)`;
    ctx.fillStyle = color;
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i] += 2;
  }
  hue = (hue + 1) % 360;
}
setInterval(drawMatrix, 40);

const overlay = document.getElementById("overlayText");

function showText(text, duration = 2000, callback) {
  const colorHue = Math.floor(Math.random() * 360);
  overlay.style.color = `hsl(${colorHue}, 100%, 70%)`;
  overlay.style.textShadow = `0 0 20px hsl(${colorHue}, 100%, 70%), 0 0 40px hsl(${(colorHue + 60) % 360}, 100%, 70%)`;
  overlay.style.transition = "none";
  overlay.style.opacity = 0;
  overlay.style.filter = "blur(10px)";
  overlay.textContent = text;

  requestAnimationFrame(() => {
    overlay.style.transition = "opacity 1s, filter 1s, color 0.5s, text-shadow 1s";
    overlay.style.opacity = 1;
    overlay.style.filter = "blur(0)";
  });

  setTimeout(() => {
    overlay.style.opacity = 0;
    overlay.style.filter = "blur(10px)";
    if (callback) setTimeout(callback, 1000);
  }, duration);
}

function explodeText(text) {
  overlay.style.opacity = 0;
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = 500;
  tempCanvas.height = 500;
  tempCtx.font = "bold 150px Orbitron";
  tempCtx.fillStyle = "white";
  tempCtx.fillText(text, 30, 300);
  const imageData = tempCtx.getImageData(0, 0, 500, 500);
  const container = document.body;
  const particles = [];

  for (let y = 0; y < 500; y += 6) {
    for (let x = 0; x < 500; x += 6) {
      const index = (y * 500 + x) * 4;
      const alpha = imageData.data[index + 3];
      if (alpha > 128) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = `${x + window.innerWidth / 2 - 250}px`;
        particle.style.top = `${y + window.innerHeight / 2 - 250}px`;

        const colorHue = Math.floor(Math.random() * 360);
        particle.style.backgroundColor = `hsl(${colorHue}, 100%, 70%)`;

        container.appendChild(particle);

        const angle = Math.random() * 2 * Math.PI;
        const velocity = Math.random() * 2 + 1; // slow explosion
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        particles.push({ el: particle, x, y, vx, vy, alpha: 1 });
      }
    }
  }

  function animateParticles() {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.005;
      if (p.alpha <= 0) {
        p.el.remove();
        particles.splice(i, 1);
        i--;
        continue;
      }
      p.el.style.left = `${p.x + window.innerWidth / 2 - 250}px`;
      p.el.style.top = `${p.y + window.innerHeight / 2 - 250}px`;
      p.el.style.opacity = p.alpha;
    }
    if (particles.length > 0) requestAnimationFrame(animateParticles);
  }

  animateParticles();
}

// Sequence
setTimeout(() => showText("3", 1000, () => {
  showText("2", 1000, () => {
    showText("1", 1000, () => {
      showText("🎂", 2000, () => {
        showText("15.07.2006", 2000, () => {
          showText("HAPPY BIRTHDAY", 2000, () => {
            showText("NHAT DUY (Dyy)", 2000, () => {
              explodeText("NHAT DUY (Dyy)");
            });
          });
        });
      });
    });
  });
}));