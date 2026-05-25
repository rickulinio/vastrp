const CLIENT_ID = "1480598374024483012";
const REDIRECT_URI = "https://rickulinio.github.io/vast/login.html";

const loginBtn = document.getElementById("loginBtn");
const userBox = document.getElementById("user");

// ==============================
// LOGIN LINK
// ==============================
if (loginBtn) {
  loginBtn.href =
    `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=token` +
    `&scope=identify`;
}

// ==============================
// RENDER USER
// ==============================
function renderUser(user) {
  const avatarURL = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  if (userBox) {
    userBox.innerHTML = `
      <div class="profile">
        <img class="avatar" src="${avatarURL}" />
        <p>${user.username}</p>
      </div>
    `;
  }

  // 🔥 HIDE LOGIN BTN PO ZALOGOWANIU
  if (loginBtn) {
    loginBtn.style.display = "none";
  }
}

// ==============================
// GET TOKEN
// ==============================
function getTokenFromHash() {
  if (!window.location.hash) return null;

  const params = new URLSearchParams(window.location.hash.substring(1));
  return params.get("access_token");
}

const token = getTokenFromHash();

// ==============================
// LOGIN FLOW
// ==============================
if (token) {
  window.history.replaceState({}, document.title, window.location.pathname);

  fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(user => {
      localStorage.setItem("user", JSON.stringify(user));
      renderUser(user);

      setTimeout(() => {
        window.location.replace("/vast/index.html");
      }, 500);
    })
    .catch(err => console.error("Discord login error:", err));
}

// ==============================
// AUTO LOGIN
// ==============================
const savedUser = localStorage.getItem("user");

if (savedUser && !token) {
  const user = JSON.parse(savedUser);
  renderUser(user);
}

// ==============================
// SAFE MOBILE FIX (NO CRASH)
// ==============================
const mobileBtn = document.getElementById("loginBtnMobile");
if (mobileBtn && savedUser) {
  mobileBtn.textContent = "Profil";
  mobileBtn.href = "/vast/index.html";
}

const mobileUser = document.getElementById("userMobile");
if (mobileUser && savedUser) {
  const user = JSON.parse(savedUser);

  const avatarURL = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  mobileUser.innerHTML = `
    <img src="${avatarURL}" />
    <span>${user.username}</span>
  `;
}