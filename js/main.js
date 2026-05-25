(function authSync() {
  const saved = localStorage.getItem("user");

  const loginBtn = document.getElementById("loginBtn");
  const userBox = document.getElementById("user");

  if (!saved || !userBox) {
    if (loginBtn) loginBtn.style.display = "inline-flex";
    if (userBox) userBox.innerHTML = "";
    return;
  }

  const user = JSON.parse(saved);

  const avatar = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  // hide login
  if (loginBtn) loginBtn.style.display = "none";

  userBox.innerHTML = `
    <div class="profile-wrap" id="profileBtn">
      <img src="${avatar}" style="width:32px;height:32px;border-radius:50%;">
      <span>${user.username}</span>
    </div>

    <div class="profile-menu" id="profileMenu">
      <a href="dashboard.html">📊 Dashboard</a>
      <a href="settings.html">⚙ Settings</a>
      <a href="https://discord.gg/gz3HhfZkNQ" target="_blank">💬 Discord</a>
      <a href="#" id="logoutBtn">🚪 Logout</a>
    </div>
  `;

  const btn = document.getElementById("profileBtn");
  const menu = document.getElementById("profileMenu");

  if (btn && menu) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      menu.style.display =
        menu.style.display === "block"
          ? "none"
          : "block";
    });

    document.addEventListener("click", () => {
      menu.style.display = "none";
    });
  }

  document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
    e.preventDefault();

    localStorage.removeItem("user");

    location.reload();
  });
})();