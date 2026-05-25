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

  const params = new URLSearchParams(
    window.location.hash.substring(1)
  );

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

  console.log("TOKEN:", token);

  if (!token) return;

  try {

    const user = await fetchDiscordUser(token);

    console.log("USER:", user);

    if (!user?.id) {
      throw new Error("Invalid user");
    }

    const avatarURL = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`
      : `https://cdn.discordapp.com/embed/avatars/0.png`;

    const userData = {
      id: user.id,
      username: user.username,
      avatar: avatarURL,
    };

    console.log("SAVING USER:", userData);

    saveUser(userData);

    console.log(
      "LOCAL STORAGE AFTER SAVE:",
      localStorage.getItem("user")
    );

    cleanUrl();

    triggerAuthUpdate();

    window.location.replace(BASE_URL);

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    clearUser();

    triggerAuthUpdate();
  }
}

/* ================= INIT ================= */

window.addEventListener("DOMContentLoaded", async () => {

  const loginBtn = document.getElementById("loginBtn");

  if (loginBtn) {
    loginBtn.href = getDiscordLoginURL();
  }

  await handleLogin();

  const saved = getSavedUser();

  if (
    saved &&
    window.location.pathname.includes("login.html")
  ) {
    window.location.replace(BASE_URL);
  }
});