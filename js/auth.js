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

  if (loginBtn) loginBtn.style.display = "none";

  if (profileBtn) {
    profileBtn.style.display = "flex";
    profileBtn.setAttribute("data-name", user.username);

    profileBtn.innerHTML = `
      <img src="${avatarURL}" alt="avatar">
    `;
  }
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