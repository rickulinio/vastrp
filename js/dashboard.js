const saved = localStorage.getItem("user");

if (!saved) {
  window.location.href = "login.html";
}

const user = JSON.parse(saved);

// NAV STATUS
const status = document.getElementById("status");
const userid = document.getElementById("userid");

status.textContent = "Zalogowany ✔";
userid.textContent = user.id;

// AVATAR UI (jak w Twojej stronie)
const avatarURL = user.avatar
  ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
  : `https://cdn.discordapp.com/embed/avatars/0.png`;

document.getElementById("userBox").innerHTML = `
  <div class="dash-user">
    <img src="${avatarURL}" class="dash-avatar">
    <div>
      <div class="dash-name">${user.username}</div>
      <div class="dash-sub">Użytkownik</div>
    </div>
  </div>
`;

// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("user");
  window.location.href = "index.html";
});