let progress = 0;

const progressText = document.querySelector(".loader-progress-text");
const loader = document.getElementById("loader");

const interval = setInterval(() => {
  progress += Math.floor(Math.random() * 8) + 2;

  if (progress >= 100) {
    progress = 100;
    clearInterval(interval);

    setTimeout(() => {
      if (loader) {
        loader.style.opacity = "0";
        loader.style.pointerEvents = "none";
      }
    }, 400);
  }

  if (progressText) {
    progressText.textContent = progress + "%";
  }
}, 70);

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader")?.classList.add("hide");
  }, 1500);
});

/* ================= HELPER ================= */
const $ = (id) => document.getElementById(id);

/* ================= FACTIONS ================= */
const fg = $("factions-grid");

function renderFactions() {
    fg.innerHTML = '';
    FACTIONS.forEach(f => {
        const isOpen = factionStatus[f.key];
        const el = document.createElement("div");
        el.className = "faction-card reveal";
        el.style.setProperty("--fc", f.color);

        el.innerHTML = `
            <div class="fc-top">
                <div class="fc-icon">${f.icon}</div>
                <div class="fc-name">${f.name}</div>
            </div>
            <p class="fc-desc">${f.desc}</p>
            <button
                class="fc-cta ${!isOpen ? 'disabled' : ''}"
                style="background:${isOpen ? f.color + '18' : '#333'};border-color:${isOpen ? f.color + '30' : '#444'};"
                onclick="${isOpen ? `openModal('${f.key}')` : ''}"
                ${!isOpen ? 'disabled' : ''}
            >
                ${isOpen ? 'Złóż Podanie →' : 'PODANIE ZAMKNIĘTE'}
            </button>
        `;
        fg.appendChild(el);
    });
}
renderFactions();

/* ================= TEAM ================= */
const tg = $("team-grid");

if (tg && Array.isArray(TEAM)) {
  TEAM.forEach(m => {
    const div = document.createElement("div");
    div.className = "team-card reveal";

    div.innerHTML = `
      <img src="${m.image}" class="team-av">
      <div class="team-name">${m.name}</div>
      <div class="team-role">${m.role}</div>
    `;

    tg.appendChild(div);
  });
}

/* ================= NAV ================= */
window.addEventListener("scroll", () => {
  const nav = $("nav");
  if (nav) nav.classList.toggle("scrolled", scrollY > 20);
});

/* ================= COUNTERS ================= */
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

/* ================= REVEAL ================= */
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add("visible"), i * 60);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(".reveal").forEach(el => obs.observe(el));

/* ================= RULES ================= */
const ruleItems = document.querySelectorAll(".rule-item");

if (ruleItems.length) {
  const ruleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll(".rule-title")
          .forEach(t => t.classList.remove("active"));

        entry.target.querySelector(".rule-title")?.classList.add("active");
      }
    });
  }, { threshold: 0.6 });

  ruleItems.forEach(item => ruleObserver.observe(item));
}

/* ================= KEY ================= */
document.querySelectorAll(".key").forEach(key => {
  key.addEventListener("click", () => {
    key.classList.toggle("show");
    setTimeout(() => key.classList.remove("show"), 1600);
  });
});

/* ================= MOBILE MENU ================= */
const navToggle = $("navToggle");
const mobileMenu = $("mobileMenu");
const mobileOverlay = $("mobileOverlay");

function openMenu() {
  mobileMenu?.classList.add("active");
  mobileOverlay?.classList.add("active");
  if (navToggle) navToggle.textContent = "✕";
}

function closeMenu() {
  mobileMenu?.classList.remove("active");
  mobileOverlay?.classList.remove("active");
  if (navToggle) navToggle.textContent = "☰";
}

navToggle?.addEventListener("click", () => {
  mobileMenu?.classList.contains("active") ? closeMenu() : openMenu();
});

mobileOverlay?.addEventListener("click", closeMenu);

document.querySelectorAll(".mobile-menu a").forEach(a => {
  a.addEventListener("click", closeMenu);
});

/* ================= CURSOR ================= */
const glow = document.querySelector(".cursor-glow");

if (glow) {
  window.addEventListener("mousemove", e => {
    glow.animate({
      left: `${e.clientX}px`,
      top: `${e.clientY}px`
    }, { duration: 300, fill: "forwards" });
  });
}

/* ================= MAGNETIC ================= */
document.querySelectorAll(".btn-lg").forEach(btn => {
  btn.addEventListener("mousemove", e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;

    btn.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "";
  });
});

/* ================= AUTH UI ================= */
function updateAuthUI() {
  const user = getUser();
  const loginBtn = $("loginBtn");
  const userBox = $("user");
  const navLinks = document.querySelector(".nav-links");

  // TWOJE ID DO TESTÓW (wpisz tutaj swoje ID)
  const ADMIN_IDS = ["TU_WPISZ_ID_DISCORDA_1", "TU_WPISZ_ID_DISCORDA_2"];

  if (!user || !user.id) {
    if (loginBtn) loginBtn.style.display = "inline-flex";
    if (userBox) userBox.innerHTML = "";
    
    // Usuń przycisk Panel jeśli ktoś się wyloguje
    const adminLink = document.getElementById("adminPanelLink");
    if (adminLink) adminLink.remove();
    return;
  }

  if (loginBtn) loginBtn.style.display = "none";

  // LOGIKA PANELU DLA ADMINA
  if (ADMIN_IDS.includes(user.id) && !document.getElementById("adminPanelLink")) {
    const li = document.createElement("li");
    li.id = "adminPanelLink";
    li.innerHTML = '<a href="panel.html" style="color: var(--primary-color); font-weight: bold;">PANEL</a>';
    if (navLinks) navLinks.appendChild(li);
  }

  if (userBox) {
    userBox.innerHTML = `
      <div class="user-dropdown" id="userDropdown">
        <div class="user-trigger" id="userTrigger">
          <img src="${user.avatar}" class="user-avatar" alt="${user.username}">
        </div>
        <div class="user-menu">
          <button id="logoutBtn" class="logout-btn">Wyloguj</button>
        </div>
      </div>
    `;

    const dropdown = document.getElementById("userDropdown");
    const trigger = document.getElementById("userTrigger");
    const logoutBtn = document.getElementById("logoutBtn");

    trigger?.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("active");
    });

    document.addEventListener("click", () => {
      dropdown?.classList.remove("active");
    });

    logoutBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      logout();
    });
  }
}

/* ================= PARTICLES ================= */
const canvas = document.getElementById("particles");
const ctx = canvas?.getContext("2d");

if (canvas && ctx) {

  let mouse = { x: null, y: null };

  window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    canvas.width = innerWidth;
    const hero = document.querySelector(".hero");
    canvas.height = hero ? hero.offsetHeight : innerHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  const particles = Array.from({ length: 100 }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 2 + 1,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5,
    fx: 0,
    fy: 0
  }));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {

      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);

        if (d < 200) {
          const f = (200 - d) / 200;
          p.fx += (dx / d) * f * 1.5;
          p.fy += (dy / d) * f * 1.5;
        }
      }

      p.x += p.dx + p.fx;
      p.y += p.dy + p.fy;

      p.fx *= 0.92;
      p.fy *= 0.92;

      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

async function updateServerStats() {
  const url = "http://193.111.250.98:30299/players.json";
  const countEl = document.getElementById("player-count");
  const listEl = document.getElementById("player-list");

  try {
    const response = await fetch(url);
    const players = await response.json();
    
    // Animacja licznika
    animateCounter(countEl, players.length);

    // Aktualizacja listy graczy
    listEl.innerHTML = players.map(p => `<div class="player-item">${p.name}</div>`).join('');
  } catch (err) {
    console.error("Błąd pobierania graczy:", err);
  }
}

function animateCounter(element, target) {
  const duration = 1500; // 1.5 sekundy
  const start = parseInt(element.innerText) || 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing dla płynności
    const val = Math.floor(start + (target - start) * (1 - Math.pow(1 - progress, 3)));
    element.innerText = val;

    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
