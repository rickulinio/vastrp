const CLIENT_ID = "1480598374024483012";

// 🔥 MUSI być dokładnie Twój GitHub Pages URL:
const REDIRECT_URI = "https://rickulinio.github.io/vast/login.html";

const loginBtn = document.getElementById("loginBtn");

// ==============================
// 🔥 LOGIN LINK (Discord OAuth)
// ==============================
if (loginBtn) {
  loginBtn.href =
    `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=token` +
    `&scope=identify`;
}

// ==============================
// 🔥 AUTO LOGIN CHECK
// ==============================
function getTokenFromHash() {
  if (!window.location.hash) return null;

  const params = new URLSearchParams(window.location.hash.substring(1));
  return params.get("access_token");
}

const token = getTokenFromHash();

if (token) {
  // zapobiega ponownemu odpalaniu
  window.history.replaceState({}, document.title, window.location.pathname);

  fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(user => {
      // ==============================
      // 🔥 SAVE USER
      // ==============================
      localStorage.setItem("user", JSON.stringify(user));

      // ==============================
      // 🔥 UI UPDATE (opcjonalne)
      // ==============================
      const userBox = document.getElementById("user");

      if (userBox) {
        const avatarURL = user.avatar
          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/0.png`;

        userBox.innerHTML = `
          <img class="avatar" src="${avatarURL}" />
          <p>Witaj ${user.username}</p>
        `;
      }

      // ==============================
      // 🔥 REDIRECT NA STRONĘ GŁÓWNĄ
      // ==============================
      setTimeout(() => {
        window.location.replace("/vast/index.html");
      }, 600);
    })
    .catch(err => {
      console.error("Błąd logowania Discord:", err);
    });
}

// ==============================
// 🔥 AUTO LOGIN Z LOCALSTORAGE
// (żeby GitHub Pages nie logowało za każdym razem)
// ==============================
const savedUser = localStorage.getItem("user");

if (savedUser && !token) {
  const user = JSON.parse(savedUser);

  const userBox = document.getElementById("user");

  if (userBox) {
    const avatarURL = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
      : `https://cdn.discordapp.com/embed/avatars/0.png`;

    userBox.innerHTML = `
      <img class="avatar" src="${avatarURL}" />
      <p>Witaj ponownie ${user.username}</p>
    `;
  }
}