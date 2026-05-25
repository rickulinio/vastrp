const CLIENT_ID = "1480598374024483012";

/* ================= BASE ================= */
const BASE_URL = "https://rickulinio.github.io/vast/";
const LOGIN_URL = BASE_URL + "login.html";

/* ================= LOGIN LINK ================= */

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.href =
    `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(LOGIN_URL)}` +
    `&response_type=token` +
    `&scope=identify`;
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
      if (!user?.id) throw new Error("invalid user");

      localStorage.setItem("user", JSON.stringify(user));

      cleanUrl();

      // 🔥 NAJWAŻNIEJSZE:
      // zawsze wraca na STRONĘ GŁÓWNĄ
      window.location.replace(BASE_URL);
    })
    .catch(() => {
      localStorage.removeItem("user");
    });
}

/* ================= SAFETY ================= */

const savedUser = localStorage.getItem("user");

if (savedUser && window.location.pathname.includes("login.html")) {
  window.location.replace(BASE_URL);
}