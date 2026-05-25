const CLIENT_ID = "1480598374024483012";
const BASE_URL = "https://rickulinio.github.io/vast/";

/* ================= LOGIN LINK ================= */

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  const REDIRECT_URI = `${BASE_URL}login.html`;

  loginBtn.href =
    `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=token` +
    `&scope=identify`;
}

/* ================= GET TOKEN ================= */

function getToken() {
  if (!window.location.hash) return null;
  return new URLSearchParams(window.location.hash.substring(1)).get("access_token");
}

/* ================= CLEAN ================= */

function cleanUrl() {
  window.history.replaceState({}, document.title, window.location.pathname);
}

/* ================= LOGIN FLOW ================= */

const token = getToken();

if (token) {
  fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(r => r.json())
    .then(user => {
      if (!user?.id) throw new Error("bad user");

      localStorage.setItem("user", JSON.stringify(user));

      cleanUrl();

      // 🔥 NAJWAŻNIEJSZE FIX:
      // zawsze wraca na HOME, NIE login.html
      window.location.href = BASE_URL;
    })
    .catch(() => {
      localStorage.removeItem("user");
    });
}

/* ================= AUTO FIX ================= */

const savedUser = localStorage.getItem("user");

if (savedUser && window.location.pathname.includes("login.html")) {
  window.location.replace(BASE_URL);
}