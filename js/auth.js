const CLIENT_ID = "1480598374024483012";
const BASE_URL = "https://rickulinio.github.io/vast/";

/* ================= STORAGE ================= */

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

function clearUser() {
  localStorage.removeItem("user");
}

/* ================= TOKEN ================= */

function getTokenFromHash() {
  if (!window.location.hash) return null;

  const params = new URLSearchParams(window.location.hash.substring(1));
  return params.get("access_token");
}

/* ================= CLEAN URL ================= */

function cleanUrl() {
  window.history.replaceState({}, document.title, window.location.pathname);
}

/* ================= EVENT SYSTEM ================= */

function updateNavbarUI() {
  window.dispatchEvent(new Event("auth:update"));
}

/* ================= DISCORD LOGIN LINK ================= */

window.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");

  if (loginBtn) {
    const discordAuthURL =
      `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(BASE_URL)}` +
      `&response_type=token` +
      `&scope=identify`;

    loginBtn.href = discordAuthURL;
  }

  /* ================= LOGIN FLOW ================= */

  const token = getTokenFromHash();

  if (token) {
    cleanUrl();

    fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(r => r.json())
      .then(user => {
        if (!user?.id) throw new Error("Invalid user");

        saveUser({
          id: user.id,
          username: user.username,
          avatar: user.avatar,
        });

        updateNavbarUI();

        window.location.replace(BASE_URL);
      })
      .catch(() => {
        clearUser();
      });
  }

  /* ================= AUTO REDIRECT ================= */

  const saved = getSavedUser();

  if (saved && window.location.pathname.includes("login.html")) {
    window.location.replace(BASE_URL);
  }
});