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
    }, 500);
  }

  if (progressText) {
    progressText.textContent = progress + "%";
  }
}, 80);

window.addEventListener("load", () => {
  setTimeout(() => {
    const l = document.getElementById("loader");
    if (l) l.classList.add("hide");
  }, 1800);
});

/* ─── SAFE HELPERS ─── */
const $ = (id) => document.getElementById(id);

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

document.querySelectorAll(".reveal").forEach(el => obs.observe(el));

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

if (mobileOverlay) mobileOverlay.addEventListener("click", closeMenu);

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

// STARU KOD PARTICLES ZOSTAŁ STĄD USUNIĘTY, ABY UNIKNĄĆ BŁĘDU REDEKLARACJI

const savedUser = localStorage.getItem("user");
const loginBtn = document.getElementById("loginBtn");
const userBox = document.getElementById("user");

if (!savedUser) {
  if (loginBtn) loginBtn.style.display = "inline-flex";
  if (userBox) userBox.innerHTML = "";
} else {
  const user = JSON.parse(savedUser);

  if (loginBtn) loginBtn.style.display = "none";

  const avatar = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  // MINIMAL UI (reszta CSS robi robotę)
  if (userBox) {
    userBox.innerHTML = `
      <div class="user-pill">
        <img src="${avatar}" class="user-avatar">
        <span class="user-name">${user.username}</span>
        <button id="logoutBtn" class="logout-btn">Wyloguj</button>
      </div>
    `;

    document.getElementById("logoutBtn")?.addEventListener("click", () => {
      localStorage.removeItem("user");
      location.reload();
    });
  }
}

function updateAuthUI() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const loginBtn = document.getElementById("loginBtn");
  const userBox = document.getElementById("user");

  if (!user) {
    if (loginBtn) loginBtn.style.display = "inline-flex";
    if (userBox) userBox.innerHTML = "";
    return;
  }

  if (loginBtn) loginBtn.style.display = "none";

  const avatar = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  if (userBox) {
    userBox.innerHTML = `
      <div class="user-dropdown">
        <div class="user-trigger" id="userTrigger">
          <img src="${avatar}" class="user-avatar">
          <span class="user-name">${user.username}</span>
        </div>

        <div class="user-menu" id="userMenu">
          <button id="logoutBtn" class="logout-btn">Wyloguj się</button>
        </div>
      </div>
    `;

    const trigger = document.getElementById("userTrigger");
    const menu = document.getElementById("userMenu");
    const logout = document.getElementById("logoutBtn");

    trigger?.addEventListener("click", (e) => {
      e.stopPropagation();
      menu?.classList.toggle("active");
    });

    logout?.addEventListener("click", () => {
      localStorage.removeItem("user");
      updateAuthUI();
    });

    document.addEventListener("click", (e) => {
      if (!userBox.contains(e.target)) {
        menu?.classList.remove("active");
      }
    });
  }
}

/* ─── PARTICLES (NOWY ZINTEGROWANY KOD) ─── */
// Tutaj const canvas i const ctx są deklarowane po raz pierwszy w pliku.
const canvas = document.getElementById("particles");
const ctx = canvas?.getContext("2d");

if (canvas && ctx) {
    let mouse = { x: null, y: null };

    // Słuchacz zdarzeń myszy - tylko gdy canvas istnieje
    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Resetowanie pozycji myszy, gdy kursor opuści okno (cząsteczki przestaną uciekać)
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        const hero = document.querySelector(".hero");
        // Canvas na wysokość hero lub całego okna, jeśli hero nie ma
        canvas.height = hero ? hero.offsetHeight : window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = [];
    const particleCount = 100; // Zwiększona liczba cząsteczek dla lepszego efektu

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 1,
            // Prędkość bazowa (dx/dy)
            dx: (Math.random() - 0.5) * 0.5, 
            dy: (Math.random() - 0.5) * 0.5,
            // Zmienne na dodatkową siłę odpychania (początkowo zero)
            forceX: 0,
            forceY: 0
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            // --- LOGIKA ODPYCHANIA (REPULSE) ---
            if (mouse.x !== null && mouse.y !== null) {
                let dxMouse = p.x - mouse.x;
                let dyMouse = p.y - mouse.y;
                let distance = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                
                let repulseRadius = 200; // Zasięg odpychania

                if (distance < repulseRadius) {
                    // Oblicz siłę odpychania (im bliżej, tym mocniej)
                    let force = (repulseRadius - distance) / repulseRadius;
                    let strength = 1.5; // Siła odepchnięcia
                    
                    // Dodaj siłę do zmiennych forceX/forceY (a nie bezpośrednio do dx/dy)
                    p.forceX += (dxMouse / distance) * force * strength;
                    p.forceY += (dyMouse / distance) * force * strength;
                }
            }

            // Aplikuj ruch bazowy + siłę odpychania
            p.x += p.dx + p.forceX;
            p.y += p.dy + p.forceY;

            // Stopniowe wygaszanie siły odpychania (tarcia), by cząsteczka wróciła do normy
            p.forceX *= 0.92;
            p.forceY *= 0.92;

            // --- ODBIJANIE OD KRAWĘDZI ---
            if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

            // --- RYSOWANIE ---
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            
            // Używamy koloru pasującego do orbów (fioletowy glow)
            ctx.fillStyle = "rgba(255, 255, 255, 0.4)"; 
            ctx.fill();
        });

        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}

/* START */
updateAuthUI();

/* UPDATE PO LOGINIE */
window.addEventListener("auth:update", updateAuthUI);