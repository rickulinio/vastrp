
/* ─── SAFE HELPER ─── */
const $id = (id) => document.getElementById(id);

/* ─── AUTH ─── */
(function authSync() {
  try {
    const savedUser = localStorage.getItem("user");

    const loginBtn = $id("loginBtn");
    const userBox = $id("user");

    if (!savedUser || savedUser === "undefined") {
      loginBtn?.style.setProperty("display", "inline-flex");
      if (userBox) userBox.innerHTML = "";
      return;
    }

    let user;
    try {
      user = JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("user");
      return;
    }

    const avatarURL = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
      : `https://cdn.discordapp.com/embed/avatars/0.png`;

    loginBtn?.style.setProperty("display", "none", "important");

    if (!userBox) return;

    userBox.style.display = "flex";

    userBox.innerHTML = `
      <div class="profile-dropdown">
        <div class="profile-trigger" style="cursor:pointer;display:flex;gap:8px;align-items:center;">
          <img src="${avatarURL}" style="width:32px;height:32px;border-radius:50%;">
          <span>${user.username ?? "User"}</span>
        </div>

        <div class="dropdown-menu" style="display:none;position:absolute;">
          <a href="settings.html">⚙ Settings</a>
          <a href="https://discord.gg/gz3HhfZkNQ" target="_blank">💬 Discord</a>
          <a href="#" id="logoutBtn">🚪 Logout</a>
        </div>
      </div>
    `;

    const trigger = userBox.querySelector(".profile-trigger");
    const dropdown = userBox.querySelector(".dropdown-menu");

    trigger?.addEventListener("click", () => {
      if (!dropdown) return;
      dropdown.style.display =
        dropdown.style.display === "block" ? "none" : "block";
    });

    userBox.querySelector("#logoutBtn")?.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("user");
      location.reload();
    });

  } catch (e) {
    console.error("AUTH CRASH:", e);
  }
})();

/* ─── FACTIONS SAFE ─── */
(function renderFactions() {
  const fg = $id("factions-grid");
  if (!fg) return;
  if (!Array.isArray(window.FACTIONS)) return;

  window.FACTIONS.forEach(f => {
    if (!f) return;

    const el = document.createElement("div");
    el.className = "faction-card reveal";
    el.style.setProperty("--fc", f.color || "#fff");

    el.innerHTML = `
      <div class="fc-top">
        <div class="fc-icon">${f.icon || ""}</div>
        <div class="fc-name">${f.name || ""}</div>
      </div>
      <p class="fc-desc">${f.desc || ""}</p>
    `;

    fg.appendChild(el);
  });
})();

/* ─── TEAM SAFE ─── */
(function renderTeam() {
  const tg = $id("team-grid");
  if (!tg) return;
  if (!Array.isArray(window.TEAM)) return;

  window.TEAM.forEach(m => {
    if (!m) return;

    tg.innerHTML += `
      <div class="team-card reveal">
        <img src="${m.image || ""}" class="team-av">
        <div>${m.name || ""}</div>
        <div>${m.role || ""}</div>
      </div>
    `;
  });
})();

/* ─── NAV ─── */
window.addEventListener("scroll", () => {
  const nav = $id("nav");
  if (nav) nav.classList.toggle("scrolled", scrollY > 20);
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

/* ─── PARTICLES 100% SAFE ─── */
(function particles() {
  const canvas = document.getElementById("particles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const particles = [];

  function resize() {
    canvas.width = innerWidth;
    canvas.height = document.querySelector(".hero")?.offsetHeight || innerHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4
    });
  }

  function animate() {
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

    requestAnimationFrame(animate);
  }

  animate();
})();