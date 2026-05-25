const CLIENT_ID = "1480598374024483012";
const BASE_URL = "https://rickulinio.github.io/vast/";

/* STORAGE */
function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem("user");
}

/* TOKEN */
function getTokenFromHash() {
  if (!window.location.hash) return null;
  return new URLSearchParams(window.location.hash.substring(1)).get("access_token");
}

/* CLEAN */
function cleanUrl() {
  window.history.replaceState({}, document.title, window.location.pathname);
}

/* EVENT */
function triggerAuthUpdate() {
  window.dispatchEvent(new Event("auth:update"));
}

/* LOGIN URL */
function getDiscordLoginURL() {
  return `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(BASE_URL)}&response_type=token&scope=identify`;
}

/* FETCH USER */
async function fetchDiscordUser(token) {
  const res = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error("Discord API error");
  return await res.json();
}

/* LOGIN */
async function handleLogin() {
  const token = getTokenFromHash();

  console.log("TOKEN:", token);

  if (!token) return;

  try {
    const user = await fetchDiscordUser(token);

    if (!user?.id) throw new Error("No user");

    const userData = {
      id: user.id,
      username: user.username,
      avatar: user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`
        : "https://cdn.discordapp.com/embed/avatars/0.png"
    };

    saveUser(userData);

    console.log("SAVED:", userData);

    cleanUrl();
    triggerAuthUpdate();

    window.location.replace(BASE_URL);

  } catch (e) {
    console.error(e);
    clearUser();
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) loginBtn.href = getDiscordLoginURL();

  await handleLogin();
});