/* ─── SAFE HELPERS ─── */
const $ = (id) => document.getElementById(id);

/* ─── AUTH SYNC (LOGIN / PROFILE FIX) ─── */
(function authSync() {
  const savedUser = localStorage.getItem("user");

  const loginBtn = $("loginBtn");
  const userBox = $("user");

  if (!savedUser) {
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (userBox) userBox.style.display = "none";
    return;
  }

  const user = JSON.parse(savedUser);

  const avatarURL = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  // hide login
  if (loginBtn) loginBtn.style.display = "none";

  // show profile
  if (userBox) {
    userBox.style.display = "flex";
    userBox.innerHTML = `
      <div class="profile" title="${user.username}">
        <img class="avatar" src="${avatarURL}" />
        <span>${user.username}</span>
      </div>
    `;
  }
})();

/* ─── RENDER FACTIONS ─── */
const fg = $("factions-grid");

if (fg && Array.isArray(FACTIONS)) {
  FACTIONS.forEach(f => {
    const el = document.createElement("div");
    el.className = "faction-card reveal";
    el.style.setProperty("--fc", f.color);

    el.innerHTML = `
      <div class="fc-top">
        <div class="fc-icon">${f.icon}</div>
        <div>
          <div class="fc-name">${f.name}</div>
        </div>
      </div>

      <p class="fc-desc">${f.desc}</p>

      <button
        class="fc-cta"
        style="--fc:${f.color};background:${f.color}18;border-color:${f.color}30;"
        onclick="openModal('${f.key}')"
      >
        Złóż Podanie <span>→</span>
      </button>
    `;

    fg.appendChild(el);
  });
}

/* ─── RENDER TEAM ─── */
const tg = $("team-grid");

if (tg && Array.isArray(TEAM)) {
  TEAM.forEach(m => {
    tg.innerHTML += `
      <div class="team-card reveal">
        <img class="team-av" src="${m.image}" alt="${m.name}">
        <div class="team-name">${m.name}</div>
        <div class="team-role">${m.role}</div>
      </div>
    `;
  });
}

/* ─── NAV SCROLL ─── */
window.addEventListener("scroll", () => {
  const nav = $("nav");
  if (!nav) return;

  nav.classList.toggle("scrolled", scrollY > 20);
});

/* ─── COUNTERS ─── */
function countUp(el, to, dur) {
  if (!el) return;

  let v = 0;
  const step = to / (dur / 16);

  const t = setInterval(() => {
    v = Math.min(v + step, to);
    el.textContent = Math.floor(v);
    if (v >= to) clearInterval(t);
  }, 16);
}

setTimeout(() => {
  countUp($("s-players"), 47, 1200);
  countUp($("s-discord"), 1284, 1800);
}, 300);

/* ─── REVEAL ─── */
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add("visible"), i * 60);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(".reveal")
  .forEach(el => obs.observe(el));

/* ─── RULE HIGHLIGHT ─── */
const ruleItems = document.querySelectorAll(".rule-item");

if (ruleItems.length) {
  const ruleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll(".rule-title")
          .forEach(t => t.classList.remove("active"));

        const title = entry.target.querySelector(".rule-title");
        if (title) title.classList.add("active");
      }
    });
  }, { threshold: 0.6 });

  ruleItems.forEach(item => ruleObserver.observe(item));
}

/* ─── KEY EFFECT ─── */
document.querySelectorAll(".key").forEach(key => {
  key.addEventListener("click", () => {
    key.classList.toggle("show");

    setTimeout(() => {
      key.classList.remove("show");
    }, 1600);
  });
});

/* ─── MOBILE MENU ─── */
const navToggle = $("navToggle");
const mobileMenu = $("mobileMenu");
const mobileOverlay = $("mobileOverlay");

function openMenu() {
  if (!mobileMenu || !mobileOverlay || !navToggle) return;

  mobileMenu.classList.add("active");
  mobileOverlay.classList.add("active");
  navToggle.textContent = "✕";
}

function closeMenu() {
  if (!mobileMenu || !mobileOverlay || !navToggle) return;

  mobileMenu.classList.remove("active");
  mobileOverlay.classList.remove("active");
  navToggle.textContent = "☰";
}

if (navToggle) {
  navToggle.addEventListener("click", () => {
    if (mobileMenu?.classList.contains("active")) closeMenu();
    else openMenu();
  });
}

if (mobileOverlay) {
  mobileOverlay.addEventListener("click", closeMenu);
}

document.querySelectorAll(".mobile-menu a").forEach(a => {
  a.addEventListener("click", closeMenu);
});

/* ─── CURSOR GLOW ─── */
const glow = document.querySelector(".cursor-glow");

if (glow) {
  window.addEventListener("mousemove", e => {
    glow.animate({
      left: `${e.clientX}px`,
      top: `${e.clientY}px`
    }, {
      duration: 350,
      fill: "forwards"
    });
  });
}

/* ─── MAGNETIC BUTTONS ─── */
document.querySelectorAll(".btn-lg").forEach(btn => {
  btn.addEventListener("mousemove", e => {
    const rect = btn.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    btn.style.transform =
      `translate(${x * 0.12}px, ${y * 0.18}px)`;
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "";
  });
});

/* ─── PARTICLES ─── */
const canvas = document.getElementById("particles");
const ctx = canvas?.getContext("2d");

if (canvas && ctx) {
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    const hero = document.querySelector(".hero");
    canvas.height = hero ? hero.offsetHeight : window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const particles = [];

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4
    });
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fill();
    });

    requestAnimationFrame(animateParticles);
  }

  animateParticles();
}