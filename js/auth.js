const CLIENT_ID = "1480598374024483012";
const REDIRECT_URI = "https://rickulinio.github.io/vast/login.html";

/* ================= LOGIN BUTTON ================= */

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.href =
    `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=token` +
    `&scope=identify`;
}

/* ================= HELPERS ================= */

function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

/* ================= RENDER USER (ONLY UI, NO LOGIC IN MAIN) ================= */

function renderUser(user) {
  const userBox = document.getElementById("user");
  const loginBtn = document.getElementById("loginBtn");

  if (!userBox) return;

  const avatar = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  if (loginBtn) loginBtn.style.display = "none";

  userBox.innerHTML = `
    <div class="user-dropdown">
      <div class="user-trigger" id="userTrigger">
        <img src="${avatar}" class="user-avatar">
        <span class="user-name">${user.username}</span>
      </div>

      <div class="user-menu" id="userMenu">
        <button class="logout-btn" id="logoutBtn">🚪 Wyloguj się</button>
      </div>
    </div>
  `;

  const trigger = document.getElementById("userTrigger");
  const menu = document.getElementById("userMenu");

  if (trigger && menu) {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();

      document.querySelectorAll(".user-menu.active")
        .forEach(m => m.classList.remove("active"));

      menu.classList.toggle("active");
    });

    document.addEventListener("click", () => {
      menu.classList.remove("active");
    });
  }

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("user");
    location.reload();
  });
}

/* ================= TOKEN LOGIN ================= */

function getToken() {
  if (!window.location.hash) return null;

  return new URLSearchParams(
    window.location.hash.substring(1)
  ).get("access_token");
}

const token = getToken();

if (token) {
  window.history.replaceState({}, document.title, window.location.pathname);

  fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(r => r.json())
    .then(user => {
      saveUser(user);
      renderUser(user);

      setTimeout(() => {
        window.location.href = "https://rickulinio.github.io/vast/";
      }, 400);
    });
}

/* ================= AUTO LOGIN ================= */

const saved = getSavedUser();

if (saved && !token) {
  renderUser(saved);
}