const CLIENT_ID = "1480598374024483012";

// 🔥 MUSI być dokładnie Twój GitHub Pages URL:
const REDIRECT_URI = "https://rickulinio.github.io/vast/login.html";

const loginBtn = document.getElementById("loginBtn");
const userBox = document.getElementById("user");

// ==============================
// 🔥 LOGIN LINK (Discord OAuth)
// ==============================
if (loginBtn) {
  loginBtn.href =
    `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=token` +
    `&scope=identify`;
}

// ==============================
// 🔥 FUNKCJA RENDER USERA
// ==============================
function renderUser(user) {
  const avatarURL = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  // avatar + tekst
  if (userBox) {
    userBox.innerHTML = `
      <div class="profile">
        <img class="avatar" src="${avatarURL}" />
        <p>${user.username}</p>
      </div>
    `;
  }

  // zmiana przycisku login
  if (loginBtn) {
    loginBtn.textContent = `Zalogowano jako ${user.username}`;
    loginBtn.style.pointerEvents = "none";
    loginBtn.style.opacity = "0.7";
  }
}

// ==============================
// 🔥 POBIERANIE TOKENA Z URL
// ==============================
function getTokenFromHash() {
  if (!window.location.hash) return null;

  const params = new URLSearchParams(window.location.hash.substring(1));
  return params.get("access_token");
}

const token = getTokenFromHash();

// ==============================
// 🔥 LOGIN FLOW
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
      }, 600);
    })
    .catch(err => {
      console.error("Błąd logowania Discord:", err);
    });
}

// ==============================
// 🔥 AUTO LOGIN (LOCALSTORAGE)
// ==============================
const savedUser = localStorage.getItem("user");

if (savedUser && !token) {
  const user = JSON.parse(savedUser);
  renderUser(user);
}

document.getElementById("loginBtnMobile").textContent = "Profil";
document.getElementById("loginBtnMobile").href = "/vast/index.html";

const mobileUser = document.getElementById("userMobile");
if (mobileUser && user) {
  mobileUser.innerHTML = `
    <img src="${avatarURL}" />
    <span>${user.username}</span>
  `;
}