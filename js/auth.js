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

/* ================= TOKEN ================= */

function getToken() {
  if (!window.location.hash) return null;
  return new URLSearchParams(window.location.hash.substring(1)).get("access_token");
}

/* ================= LOGIN FLOW ================= */

async function handleLogin() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const user = await res.json();

    if (!user || !user.id) throw new Error("Invalid user");

    localStorage.setItem("user", JSON.stringify(user));

    // czyścimy hash PO zapisie
    window.history.replaceState({}, document.title, window.location.pathname);

    // redirect dopiero po zapisie
    window.location.replace(BASE_URL);

  } catch (e) {
    console.log("Login error:", e);
    localStorage.removeItem("user");
  }
}

handleLogin();

/* ================= AUTO RESTORE ================= */

const savedUser = localStorage.getItem("user");

if (savedUser) {
  const isLoginPage = window.location.pathname.includes("login.html");

  // jeśli ktoś przypadkiem wpadł na login.html → cofka
  if (isLoginPage) {
    window.location.replace(BASE_URL);
  }
}
