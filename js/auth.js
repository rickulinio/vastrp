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

/* ================= CLEAN URL ================= */

function cleanUrl() {
  window.history.replaceState({}, document.title, window.location.pathname);
}

const token = getToken();

/* ================= LOGIN FLOW ================= */

if (token) {
  cleanUrl();

  fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(r => r.json())
    .then(user => {
      if (!user?.id) throw new Error("invalid user");

      saveUser(user);

      // 🔥 NAJSTABILNIEJSZY REDIRECT (ZERO LOOPÓW)
      window.location.replace(BASE_URL);
    })
    .catch(() => {
      localStorage.removeItem("user");
    });
}

/* ================= AUTO FIX ================= */

const saved = getSavedUser();

if (saved) {
  // jeśli ktoś jest zalogowany i siedzi na login.html → wywal go na home
  if (window.location.pathname.includes("login.html")) {
    window.location.replace(BASE_URL);
  }
}