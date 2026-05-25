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

/* ================= RENDER USER ================= */

function renderUser(user) {
  const userBox = document.getElementById("user");
  const loginBtn = document.getElementById("loginBtn");

  if (!userBox) return;

  const avatarURL = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  // chowamy login
  if (loginBtn) {
    loginBtn.style.display = "none";
  }

  // pokazujemy usera
  userBox.style.display = "flex";

  const profileBtn = document.getElementById("profileBtn");
  const profileMenu = document.getElementById("profileMenu");

  /* ===== OPEN / CLOSE ===== */

  profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    profileMenu.classList.toggle("active");
  });

  /* ===== CLOSE WHEN CLICK OUTSIDE ===== */

  document.addEventListener("click", (e) => {
    if (!userBox.contains(e.target)) {
      profileMenu.classList.remove("active");
    }
  });

  /* ===== LOGOUT ===== */

  const logoutBtn = document.getElementById("logoutBtn");

  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();

    localStorage.removeItem("user");

    window.location.reload();
  });
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
  window.history.replaceState(
    {},
    document.title,
    window.location.pathname
  );

  fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(r => r.json())
    .then(user => {
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      renderUser(user);

      setTimeout(() => {
window.location.replace("/vast/");
      }, 500);
    });
}

/* ================= AUTO LOGIN ================= */

const savedUser = localStorage.getItem("user");

if (savedUser && !token) {
  renderUser(JSON.parse(savedUser));
}