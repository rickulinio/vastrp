/* ─── SAFE HELPERS ─── */
const $id = (id) => document.getElementById(id);
const $qs = (s) => document.querySelector(s);
const $qsa = (s) => document.querySelectorAll(s);

/* ─── RENDER FACTIONS ─── */
const fg = $id("factions-grid");

if (fg && Array.isArray(FACTIONS)) {
  FACTIONS.forEach(f => {
    const el = document.createElement('div');
    el.className = 'faction-card reveal';
    el.style.setProperty('--fc', f.color);

    el.innerHTML = `
      <div class="fc-top">
        <div class="fc-icon">${f.icon}</div>
        <div>
          <div class="fc-name">${f.name}</div>
          <span class="fc-tag">${f.tag}</span>
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
const tg = $id("team-grid");

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

/* ─── RENDER FAQ ─── */
const fl = $id("faq-list");

if (fl && Array.isArray(FAQS)) {
  FAQS.forEach(item => {
    fl.innerHTML += `
      <div class="faq-item">
        <button class="faq-q" onclick="toggleFaq(this)">
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
    `;
  });
}

/* ─── FAQ TOGGLE ─── */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  if (!item) return;

  const isOpen = item.classList.contains('open');

  $qsa('.faq-item.open')
    .forEach(i => i.classList.remove('open'));

  if (!isOpen) item.classList.add('open');
}

/* ─── NAV SCROLL ─── */
window.addEventListener('scroll', () => {
  const nav = $id("nav");
  if (!nav) return;

  nav.classList.toggle('scrolled', scrollY > 20);
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
  countUp($id("s-players"), 47, 1200);
  countUp($id("s-discord"), 1284, 1800);
}, 300);

/* ─── REVEAL ─── */
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
    }
  });
}, { threshold: 0.08 });

$qsa('.reveal').forEach(el => obs.observe(el));

/* ─── RULE HIGHLIGHT ─── */
const ruleItems = $qsa('.rule-item');

if (ruleItems.length) {
  const ruleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {

        $qsa('.rule-title')
          .forEach(t => t.classList.remove('active'));

        const title = entry.target.querySelector('.rule-title');
        if (title) title.classList.add('active');
      }
    });
  }, { threshold: 0.6 });

  ruleItems.forEach(item => ruleObserver.observe(item));
}

/* ─── KEY EFFECT ─── */
$qsa('.key').forEach(key => {
  key.addEventListener('click', () => {
    key.classList.toggle('show');

    setTimeout(() => {
      key.classList.remove('show');
    }, 1600);
  });
});

/* ─── MOBILE MENU ─── */
const navToggle = $id("navToggle");
const mobileMenu = $id("mobileMenu");
const mobileOverlay = $id("mobileOverlay");

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

$qsa(".mobile-menu a").forEach(a => {
  a.addEventListener("click", closeMenu);
});