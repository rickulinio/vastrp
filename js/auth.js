const CLIENT_ID = "1480598374024483012";
const BASE_URL = "https://rickulinio.github.io/vast/";

/* ================= LOGIN LINK ================= */

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.href =
    `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(BASE_URL)}` +
    `&response_type=token` +
    `&scope=identify`;
}

/* ================= GET TOKEN ================= */

function getToken() {
  if (!window.location.hash) return null;

  const params = new URLSearchParams(window.location.hash.substring(1));
  return params.get("access_token");
}

const token = getToken();

/* ================= CLEAN URL ================= */

function cleanUrl() {
  window.history.replaceState({}, document.title, window.location.pathname);
}

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
      localStorage.setItem("user", JSON.stringify(user));

      // 🔥 NAJWAŻNIEJSZE: zawsze ROOT
      window.location.replace(BASE_URL);
    })
    .catch(() => {
      localStorage.removeItem("user");
    });
}

/* ================= AUTO FIX LOOP ================= */

const savedUser = localStorage.getItem("user");

if (savedUser) {
  const isLoginPage = window.location.pathname.includes("login.html");

  // jeśli ktoś przypadkiem wpadł na login.html → cofka
  if (isLoginPage) {
    window.location.replace(BASE_URL);
  }
}