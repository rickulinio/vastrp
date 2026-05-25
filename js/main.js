function renderAuthUI() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const loginBtn = document.getElementById("loginBtn");
  const userBox = document.getElementById("user");

  if (!user || !userBox) return;

  // ukryj login
  if (loginBtn) loginBtn.style.display = "none";

  const avatar = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  userBox.innerHTML = `
    <div class="user-dropdown">
      <div class="user-trigger" id="userTrigger">
        <img src="${avatar}" class="user-avatar">
        <span class="user-name">${user.username}</span>
      </div>

      <div class="user-menu" id="userMenu">
        <button class="logout-btn" id="logoutBtn">Wyloguj</button>
      </div>
    </div>
  `;

  const trigger = document.getElementById("userTrigger");
  const menu = document.getElementById("userMenu");

  trigger?.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("active");
  });

  document.addEventListener("click", () => {
    menu?.classList.remove("active");
  });

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("user");
    location.reload();
  });
}

renderAuthUI();