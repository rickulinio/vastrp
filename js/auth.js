const CLIENT_ID = "1480598374024483012";

// 🔥 MUSI być dokładnie Twój GitHub Pages URL:
const REDIRECT_URI = "https://rickulinio.github.io/vast/login.html";

const loginBtn = document.getElementById("loginBtn");

// Discord OAuth (implicit flow – działa na static hosting)
loginBtn.href =
  `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&response_type=token` +
  `&scope=identify`;

// Pobranie tokena z URL
const hash = window.location.hash;
const token = new URLSearchParams(hash.replace("#", "?")).get("access_token");

if (token) {
  fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(user => {
      // 🔥 zapis usera do pamięci
      localStorage.setItem("user", JSON.stringify(user));

      // (opcjonalnie) pokazanie powitania chwilę
      const userBox = document.getElementById("user");
      if (userBox) {
        userBox.innerHTML = `
          <img class="avatar" src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png" />
          <p>Witaj ${user.username}</p>
        `;
      }

      // 🔥 usuwa #token z URL
      window.history.replaceState({}, document.title, window.location.pathname);

      // 🔥 PRZEKIEROWANIE NA STRONĘ GŁÓWNĄ
      setTimeout(() => {
        window.location.href = "/vast/index.html";
      }, 800);
    })
    .catch(err => {
      console.error("Błąd logowania:", err);
    });
}