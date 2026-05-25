const CLIENT_ID = "1480598374024483012";

/* ================= BASE ================= */
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

/* ================= TOKEN ================= */

function getToken() {
  if (!window.location.hash) return null;

  return new URLSearchParams(
    window.location.hash.substring(1)
  ).get("access_token");
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

      // 🔥 ALWAYS GO HOME (NO login.html EVER)
      window.location.href = BASE_URL;
    })
    .catch(() => {
      localStorage.removeItem("user");
    });
}

/* ================= SAFETY GUARD ================= */

const savedUser = localStorage.getItem("user");

if (savedUser && window.location.pathname.includes("login.html")) {
  window.location.replace(BASE_URL);
}