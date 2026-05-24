const CLIENT_ID = "TWOJE_CLIENT_ID";

// 🔥 MUSI być dokładnie Twój GitHub Pages URL:
const REDIRECT_URI = "https://rickulinio.github.io/vastrp/login.html";

const loginBtn = document.getElementById("loginBtn");

// Discord OAuth (implicit flow – działa na static hosting)
loginBtn.href =
  `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&response_type=token` +
  `&scope=identify`;

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
      document.getElementById("user").innerHTML = `
        <img class="avatar" src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png" />
        <p>Witaj ${user.username}</p>
      `;
    });
}