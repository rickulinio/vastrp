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
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(r => r.json())
    .then(user => {
      localStorage.setItem("user", JSON.stringify(user));

      // 🔥 FIX: stabilny redirect
      window.location.replace("/vast/");
    });
}

/* ================= AUTO RESTORE ================= */

const savedUser = localStorage.getItem("user");

if (savedUser && !token) {
  // tylko informacyjnie — UI robi MAIN.JS
}