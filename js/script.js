// ═══════════════════════════════════════════
// Noora's Portfolio — interactions
// ═══════════════════════════════════════════

// ── typed tagline (placeholder phrases) ──
const PHRASES = [
  'Aspiring SOC Analyst 🛡️',
  'Cybersecurity Analyst 🔍',
  'AI Security Engineer 🤖',
  'Turning alerts into answers ✨',
];

const typedEl = document.getElementById('typedText');

function startTyping() {
  if (!typedEl) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const phrase = PHRASES[phraseIndex];

    if (!deleting) {
      charIndex += 1;
      typedEl.textContent = phrase.slice(0, charIndex);
      if (charIndex === phrase.length) {
        deleting = true;
        setTimeout(tick, 2200);
        return;
      }
      setTimeout(tick, 65);
    } else {
      charIndex -= 1;
      typedEl.textContent = phrase.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % PHRASES.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 35);
    }
  }

  tick();
}

startTyping();

// ── mobile nav toggle ──
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ── navbar shadow on scroll ──
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ── scroll reveal ──
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ── active nav link while scrolling ──
const sections = document.querySelectorAll('section[id]');
const linkFor = {};
document.querySelectorAll('.nav-link').forEach((link) => {
  linkFor[link.getAttribute('href').slice(1)] = link;
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('.nav-link.active').forEach((l) => l.classList.remove('active'));
      const link = linkFor[entry.target.id];
      if (link) link.classList.add('active');
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach((section) => sectionObserver.observe(section));

// ── contact form ──
// For direct in-page sending, create a free form at https://formspree.io
// (sign up with the destination email), then paste its form ID below,
// e.g. 'xkgwabcd'. Until then, submissions open the visitor's email app
// with the message pre-filled.
const FORMSPREE_ID = '';
const CONTACT_EMAIL = 'nooranasir712@gmail.com';

const contactForm = document.getElementById('contactForm');

function setButtonStatus(button, text, revertTo) {
  button.textContent = text;
  button.disabled = true;
  setTimeout(() => {
    button.textContent = revertTo;
    button.disabled = false;
  }, 3000);
}

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = contactForm.querySelector('button[type="submit"]');
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      setButtonStatus(button, '⚠️ Please fill in name, email & message', '💌 Send Message');
      return;
    }

    if (!FORMSPREE_ID) {
      // no backend configured — hand off to the visitor's email app
      const mailBody = `Name: ${name}\nEmail: ${email}\n\n${message}`;
      window.location.href =
        `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject || 'Message from portfolio')}` +
        `&body=${encodeURIComponent(mailBody)}`;
      return;
    }

    const original = button.textContent;
    button.textContent = '⏳ Sending...';
    button.disabled = true;

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (!response.ok) throw new Error(`Formspree responded ${response.status}`);
      button.textContent = '✅ Sent! Thank you';
      contactForm.reset();
    } catch (error) {
      button.textContent = '⚠️ Could not send — please email directly';
    }
    setTimeout(() => {
      button.textContent = original;
      button.disabled = false;
    }, 3000);
  });
}

// ── skills sphere: draggable 3D word cloud ──
// icon: Simple Icons slug (loaded from CDN, tinted to the theme);
// emoji: fallback glyph for skills that have no official logo
const SPHERE_SKILLS = [
  { label: 'SOC', emoji: '🛡️' },
  { label: 'SIEM', emoji: '🖥️' },
  { label: 'MITRE ATT&CK', emoji: '⚔️' },
  { label: 'Incident Response', emoji: '🚨' },
  { label: 'Threat Detection', emoji: '🎯' },
  { label: 'IOC Analysis', emoji: '🧬' },
  { label: 'Log Analysis', emoji: '📜' },
  { label: 'Phishing Analysis', emoji: '🎣' },
  { label: 'Malware Analysis', emoji: '🦠' },
  { label: 'Email Headers', emoji: '📧' },
  { label: 'Wireshark', icon: 'wireshark' },
  { label: 'LetsDefend', emoji: '🧪' },
  { label: 'Kali Linux', icon: 'kalilinux' },
  { label: 'Nmap', emoji: '📡' },
  { label: 'Burp Suite', icon: 'burpsuite' },
  { label: 'Python', icon: 'python' },
  { label: 'SQL', icon: 'mysql' },
  { label: 'Bash', icon: 'gnubash' },
  { label: 'FastAPI', icon: 'fastapi' },
  { label: 'LLMs', icon: 'ollama' },
  { label: 'Pandas', icon: 'pandas' },
  { label: 'NumPy', icon: 'numpy' },
  { label: 'Scikit-learn', icon: 'scikitlearn' },
  { label: 'TensorFlow', icon: 'tensorflow' },
  { label: 'Power BI', emoji: '📊' },
  { label: 'Linux', icon: 'linux' },
  { label: 'Git', icon: 'git' },
];

const SPHERE_COLORS = ['#a9714b', '#8d6e63', '#cf9445', '#8fa382'];

function initSkillSphere() {
  const sphere = document.getElementById('skillSphere');
  if (!sphere) return;

  // distribute points evenly on a sphere (Fibonacci spiral)
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const points = SPHERE_SKILLS.map((skill, i) => {
    const y = 1 - (i / (SPHERE_SKILLS.length - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;

    const color = SPHERE_COLORS[i % SPHERE_COLORS.length];
    const el = document.createElement('span');
    el.className = 'sphere-word';
    el.style.color = color;

    if (skill.icon) {
      const img = document.createElement('img');
      img.src = `https://cdn.simpleicons.org/${skill.icon}/${color.slice(1)}`;
      img.alt = '';
      img.loading = 'lazy';
      img.addEventListener('error', () => img.remove()); // fall back to text-only
      el.appendChild(img);
    } else if (skill.emoji) {
      const glyph = document.createElement('span');
      glyph.className = 'sphere-emoji';
      glyph.textContent = skill.emoji;
      el.appendChild(glyph);
    }

    el.appendChild(document.createTextNode(skill.label));
    sphere.appendChild(el);
    return { el, x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
  });

  const BASE_SPIN = 0.0035; // idle auto-rotation speed
  let velX = 0;
  let velY = BASE_SPIN;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  function rotate(point, ax, ay) {
    // around Y axis
    let cos = Math.cos(ay);
    let sin = Math.sin(ay);
    const x = point.x * cos - point.z * sin;
    let z = point.x * sin + point.z * cos;
    // around X axis
    cos = Math.cos(ax);
    sin = Math.sin(ax);
    const y = point.y * cos - z * sin;
    z = point.y * sin + z * cos;
    point.x = x;
    point.y = y;
    point.z = z;
  }

  function render() {
    // cap the horizontal reach tighter than the vertical so long labels
    // never spill past the screen edge on narrow phones
    const radius = Math.min(sphere.clientWidth * 0.3, sphere.clientHeight * 0.42);
    points.forEach((point) => {
      rotate(point, velX, velY);
      const depth = (point.z + 2) / 3; // 0.33 (back) → 1 (front)
      // fully hide items once they pass behind the sphere so they never
      // overlap the front ones; fade happens near the horizon (z ±0.3)
      const alpha = Math.min(1, Math.max(0, (point.z + 0.3) / 0.6));
      point.el.style.transform =
        `translate(-50%, -50%) translate(${point.x * radius}px, ${point.y * radius}px) scale(${0.55 + depth * 0.6})`;
      point.el.style.opacity = alpha.toFixed(2);
      point.el.style.visibility = alpha === 0 ? 'hidden' : 'visible';
      point.el.style.zIndex = Math.round(depth * 100);
    });

    if (!dragging) {
      // ease momentum back to the idle spin
      velY += (BASE_SPIN - velY) * 0.02;
      velX += (0 - velX) * 0.02;
    }
    requestAnimationFrame(render);
  }

  sphere.addEventListener('pointerdown', (event) => {
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    sphere.classList.add('dragging');
    sphere.setPointerCapture(event.pointerId);
  });

  sphere.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    // front of the sphere follows the pointer
    velY = (lastX - event.clientX) * 0.0035;
    velX = (lastY - event.clientY) * 0.0035;
    lastX = event.clientX;
    lastY = event.clientY;
  });

  function endDrag() {
    dragging = false;
    sphere.classList.remove('dragging');
  }
  sphere.addEventListener('pointerup', endDrag);
  sphere.addEventListener('pointercancel', endDrag);

  render();
}

initSkillSphere();

// ── gallery: block right-click / long-press save ──
const galleryMarquee = document.getElementById('galleryMarquee');

if (galleryMarquee) {
  galleryMarquee.addEventListener('contextmenu', (event) => event.preventDefault());
  galleryMarquee.addEventListener('dragstart', (event) => event.preventDefault());
}

// ── footer year ──
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
