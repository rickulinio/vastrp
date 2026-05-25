const CLIENT_ID = "1480598374024483012";
const BASE_URL = "https://rickulinio.github.io/vast/";

/* ================= LOGIN BUTTON ================= */

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.href =
    `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(BASE_URL)}` +
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

/* ================= TOKEN ================= */

function getToken() {
  if (!window.location.hash) return null;
  return new URLSearchParams(window.location.hash.substring(1)).get("access_token");
}

const token = getToken();

/* ================= LOGIN FLOW ================= */

if (token) {
  // usuń hash z URL
  window.history.replaceState({}, document.title, window.location.pathname);

  fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(r => r.json())
    .then(user => {
      if (!user?.id) throw new Error("invalid user");

      saveUser(user);

      // MAŁY DELAY żeby localStorage się zapisał
      setTimeout(() => {
        window.location.href = BASE_URL;
      }, 150);
    })
    .catch(() => {
      localStorage.removeItem("user");
    });
}

/* ================= AUTO REDIRECT ================= */

const saved = getSavedUser();

if (saved && window.location.pathname.includes("login.html")) {
  window.location.replace(BASE_URL);
}