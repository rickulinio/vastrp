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

/* ================= GET TOKEN ================= */

function getToken() {
  if (!window.location.hash) return null;
  return new URLSearchParams(window.location.hash.substring(1)).get("access_token");
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
      if (!user?.id) throw new Error("bad user");

      saveUser(user);

      // ❗ NIE renderuj tutaj UI (MAIN to robi)
      // ❗ tylko zapis + redirect

      setTimeout(() => {
        window.location.replace("https://rickulinio.github.io/vast/");
      }, 200);
    })
    .catch(() => {
      localStorage.removeItem("user");
    });
}

/* ================= AUTO GUARD ================= */

const saved = getSavedUser();

if (saved && window.location.pathname.includes("login.html")) {
  window.location.replace("https://rickulinio.github.io/vast/");
}