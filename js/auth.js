const CLIENT_ID = "1480598374024483012";
const REDIRECT_URI = "https://rickulinio.github.io/vast/login.html";

/* ================= LOGIN LINK ================= */

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.href =
    `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=token` +
    `&scope=identify`;
}

/* ================= STORAGE ================= */

function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

function logout() {
  localStorage.removeItem("user");
  location.reload();
}

/* ================= TOKEN ================= */

function getToken() {
  if (!window.location.hash) return null;

  return new URLSearchParams(
    window.location.hash.substring(1)
  ).get("access_token");
}

const token = getToken();

/* ================= LOGIN FLOW ================= */

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

      setTimeout(() => {
        window.location.href = "https://rickulinio.github.io/vast/";
      }, 300);
    });
}

/* ================= EXPORT SIMPLE STATE ================= */

window.AUTH = {
  getUser,
  logout
};