const CLIENT_ID = "1480598374024483012";
const REDIRECT_URI = "https://rickulinio.github.io/vast/login.html";

const loginBtn = document.getElementById("loginBtn");
const profileBtn = document.getElementById("profileBtn");

// ================= LOGIN LINK =================
if (loginBtn) {
  loginBtn.href =
    `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=token` +
    `&scope=identify`;
}

// ================= RENDER PROFILE =================
function renderUser(user) {
  const avatarURL = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  const loginBtn = document.getElementById("loginBtn");
  const userBox = document.getElementById("user");

  if (loginBtn) loginBtn.style.display = "none";
  if (!userBox) return;

  userBox.style.display = "flex";

  userBox.innerHTML = `
    <div class="profile">
      <img class="avatar" src="${avatarURL}" />
      <span>${user.username}</span>
    </div>

    <div class="dropdown">
      <a href="profile.html">👤 Profil</a>
      <a href="settings.html">⚙️ Settings</a>
      <a href="https://discord.gg/gz3HhfZkNQ" target="_blank">💬 Discord</a>
      <a href="#" id="logoutBtn">🚪 Logout</a>
    </div>
  `;

  // toggle dropdown
  userBox.onclick = () => {
    userBox.classList.toggle("active");
  };

  // logout
  setTimeout(() => {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem("user");
        location.reload();
      };
    }
  }, 0);

  // close when clicking outside
  document.addEventListener("click", (e) => {
    if (!userBox.contains(e.target)) {
      userBox.classList.remove("active");
    }
  });
}function renderUser(user) {
  const avatarURL = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  const loginBtn = document.getElementById("loginBtn");
  const userBox = document.getElementById("user");

  if (loginBtn) loginBtn.style.display = "none";
  if (!userBox) return;

  userBox.style.display = "flex";

  userBox.innerHTML = `
    <div class="profile">
      <img class="avatar" src="${avatarURL}" />
      <span>${user.username}</span>
    </div>

    <div class="dropdown">
      <a href="profile.html">👤 Profil</a>
      <a href="settings.html">⚙️ Settings</a>
      <a href="https://discord.gg/gz3HhfZkNQ" target="_blank">💬 Discord</a>
      <a href="#" id="logoutBtn">🚪 Logout</a>
    </div>
  `;

  // toggle dropdown
  userBox.onclick = () => {
    userBox.classList.toggle("active");
  };

  // logout
  setTimeout(() => {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem("user");
        location.reload();
      };
    }
  }, 0);

  // close when clicking outside
  document.addEventListener("click", (e) => {
    if (!userBox.contains(e.target)) {
      userBox.classList.remove("active");
    }
  });
}

// ================= TOKEN =================
function getToken() {
  if (!window.location.hash) return null;
  return new URLSearchParams(window.location.hash.substring(1)).get("access_token");
}

const token = getToken();

// ================= LOGIN FLOW =================
if (token) {
  window.history.replaceState({}, document.title, window.location.pathname);

  fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(r => r.json())
    .then(user => {
      localStorage.setItem("user", JSON.stringify(user));
      renderUser(user);

      setTimeout(() => {
        window.location.replace("/vast/index.html");
      }, 500);
    });
}

// ================= AUTO LOGIN =================
const savedUser = localStorage.getItem("user");

if (savedUser && !token) {
  renderUser(JSON.parse(savedUser));
}