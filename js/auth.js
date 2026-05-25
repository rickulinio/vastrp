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
  window.history.replaceState(
    {},
    document.title,
    window.location.pathname
  );
}

/* ================= EVENT ================= */

function triggerAuthUpdate() {
  window.dispatchEvent(new Event("auth:update"));
}

/* ================= LOGIN URL ================= */

function getDiscordLoginURL() {
  return (
    `https://discord.com/oauth2/authorize` +
    `?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(BASE_URL)}` +
    `&response_type=token` +
    `&scope=identify`
  );
}

/* ================= FETCH USER ================= */

async function fetchDiscordUser(token) {
  const response = await fetch(
    "https://discord.com/api/users/@me",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Discord API Error: ${response.status}`);
  }

  return await response.json();
}

/* ================= LOGIN FLOW ================= */

async function handleLogin() {
  const token = getTokenFromHash();

  if (!token) return;

  console.log("TOKEN:", token);

  try {
    const user = await fetchDiscordUser(token);

    console.log("USER:", user);

    if (!user?.id) {
      throw new Error("Invalid user");
    }

    saveUser({
      id: user.id,
      username: user.username,
      avatar: user.avatar,
    });

    // URL czyścimy DOPIERO po zapisaniu
    cleanUrl();

    // update UI
    triggerAuthUpdate();

    // redirect
    window.location.replace(BASE_URL);

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    clearUser();

    triggerAuthUpdate();
  }
}

/* ================= INIT ================= */

window.addEventListener("DOMContentLoaded", async () => {

  /* LOGIN BUTTON */

  const loginBtn = document.getElementById("loginBtn");

  if (loginBtn) {
    loginBtn.href = getDiscordLoginURL();
  }

  /* HANDLE LOGIN */

  await handleLogin();

  /* AUTO REDIRECT */

  const saved = getSavedUser();

  if (
    saved &&
    window.location.pathname.includes("login.html")
  ) {
    window.location.replace(BASE_URL);
  }
});