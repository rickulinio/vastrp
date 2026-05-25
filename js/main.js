/* ================= SAFE HELPERS ================= */
const $ = (id) => document.getElementById(id);

/* ================= FACTIONS ================= */
const fg = $("factions-grid");

if (fg && Array.isArray(window.FACTIONS)) {
  fg.innerHTML = "";

  window.FACTIONS.forEach(f => {
    const el = document.createElement("div");
    el.className = "faction-card reveal";
    el.style.setProperty("--fc", f.color);

    el.innerHTML = `
      <div class="fc-top">
        <div class="fc-icon">${f.icon}</div>
        <div>
          <div class="fc-name">${f.name}</div>
          <span class="fc-tag">${f.tag}</span>
        </div>
      </div>

      <p class="fc-desc">${f.desc}</p>

      <button class="fc-cta"
        style="--fc:${f.color};background:${f.color}18;border-color:${f.color}30;"
        onclick="openModal('${f.key}')"
      >
        Złóż Podanie <span>→</span>
      </button>
    `;

    fg.appendChild(el);
  });
}

/* ================= TEAM ================= */
const tg = $("team-grid");

if (tg && Array.isArray(window.TEAM)) {
  tg.innerHTML = window.TEAM.map(m => `
    <div class="team-card reveal">
      <img class="team-av" src="${m.image}" alt="${m.name}">
      <div class="team-name">${m.name}</div>
      <div class="team-role">${m.role}</div>
    </div>
  `).join("");
}

/* ================= FAQ ================= */
const fl = $("faq-list");

if (fl && Array.isArray(window.FAQS)) {
  fl.innerHTML = window.FAQS.map(item => `
    <div class="faq-item">
      <button class="faq-q" data-faq>
        ${item.q}
        <div class="faq-arrow">
          <svg viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </button>

      <div class="faq-body">
        <div class="faq-body-inner">${item.a}</div>
      </div>
    </div>
  `).join("");
}

/* ================= FAQ TOGGLE (DELEGATION FIX) ================= */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-faq]");
  if (!btn) return;

  const item = btn.closest(".faq-item");
  if (!item) return;

  const isOpen = item.classList.contains("open");

  document.querySelectorAll(".faq-item.open")
    .forEach(i => i.classList.remove("open"));

  if (!isOpen) item.classList.add("open");
});

/* ================= NAV SCROLL ================= */
window.addEventListener("scroll", () => {
  const nav = $("nav");
  if (!nav) return;

  nav.classList.toggle("scrolled", window.scrollY > 20);
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
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      obs.unobserve(e.target); // FIX: brak leaków
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(".reveal").forEach(el => obs.observe(el));

/* ================= RULE HIGHLIGHT ================= */
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

/* ================= KEY EFFECT ================= */
document.querySelectorAll(".key").forEach(key => {
  key.addEventListener("click", () => {
    key.classList.add("show");

    setTimeout(() => {
      key.classList.remove("show");
    }, 1600);
  });
});

/* ================= MOBILE MENU ================= */
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

navToggle?.addEventListener("click", () => {
  mobileMenu?.classList.contains("active") ? closeMenu() : openMenu();
});

mobileOverlay?.addEventListener("click", closeMenu);

document.querySelectorAll(".mobile-menu a").forEach(a => {
  a.addEventListener("click", closeMenu);
});