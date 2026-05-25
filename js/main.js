/* ================= LOADER ================= */

let progress = 0;

const progressText = document.querySelector(".loader-progress-text");
const loader = document.getElementById("loader");

const interval = setInterval(() => {
  progress += Math.floor(Math.random() * 8) + 2;

  if (progress >= 100) {
    progress = 100;
    clearInterval(interval);

    setTimeout(() => {
      loader?.classList.add("hide");
      if (loader) {
        loader.style.opacity = "0";
        loader.style.pointerEvents = "none";
      }
    }, 400);
  }

  if (progressText) {
    progressText.textContent = progress + "%";
  }
}, 80);

window.addEventListener("load", () => {
  setTimeout(() => {
    loader?.classList.add("hide");
  }, 1500);
});


/* ================= SAFE HELPERS ================= */

const $ = (id) => document.getElementById(id);


/* ================= AUTH UI ================= */

function renderAuthUI() {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const loginBtn = $("loginBtn");
  const userBox = $("user");

  if (!userBox) return;

  // brak usera
  if (!user) {
    if (loginBtn) loginBtn.style.display = "inline-flex";
    userBox.innerHTML = "";
    return;
  }

  // user zalogowany
  if (loginBtn) loginBtn.style.display = "none";

  const avatar = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  userBox.innerHTML = `
    <div class="user-dropdown">
      <div class="user-trigger" id="userTrigger">
        <img src="${avatar}" class="user-avatar">
        <span class="user-name">${user.username || "User"}</span>
      </div>

      <div class="user-menu" id="userMenu">
        <button class="logout-btn" id="logoutBtn">Wyloguj</button>
      </div>
    </div>
  `;

  const trigger = $("userTrigger");
  const menu = $("userMenu");

  if (trigger && menu) {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("active");
    });

    document.addEventListener("click", () => {
      menu.classList.remove("active");
    });
  }

  $("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("user");
    location.reload();
  });
}


/* ================= FACTIONS ================= */

const fg = $("factions-grid");

if (fg && Array.isArray(FACTIONS)) {
  FACTIONS.forEach(f => {
    const el = document.createElement("div");
    el.className = "faction-card reveal";
    el.style.setProperty("--fc", f.color);

    el.innerHTML = `
      <div class="fc-top">
        <div class="fc-icon">${f.icon}</div>
        <div class="fc-name">${f.name}</div>
      </div>

      <p class="fc-desc">${f.desc}</p>

      <button class="fc-cta" onclick="openModal('${f.key}')">
        Złóż Podanie →
      </button>
    `;

    fg.appendChild(el);
  });
}


/* ================= TEAM ================= */

const tg = $("team-grid");

if (tg && Array.isArray(TEAM)) {
  TEAM.forEach(m => {
    tg.innerHTML += `
      <div class="team-card reveal">
        <img class="team-av" src="${m.image}">
        <div class="team-name">${m.name}</div>
        <div class="team-role">${m.role}</div>
      </div>
    `;
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

document.querySelectorAll(".rule-item").forEach(item => {
  item.addEventListener("mouseenter", () => {
    document.querySelectorAll(".rule-title")
      .forEach(t => t.classList.remove("active"));

    item.querySelector(".rule-title")?.classList.add("active");
  });
});


/* ================= MENU ================= */

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


/* ================= INIT ================= */

// 🔥 WAŻNE: dopiero po DOM
window.addEventListener("DOMContentLoaded", () => {
  renderAuthUI();
});