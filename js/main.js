function renderAuthUI() {
  const saved = localStorage.getItem("user");

  const loginBtn = get("loginBtn");
  const userBox = get("user");

  // 🔥 SAFE GUARD (NIE ROZWALA STRONY)
  if (!userBox) return;

  if (!saved) {
    if (loginBtn) loginBtn.style.display = "inline-flex";
    userBox.innerHTML = "";
    return;
  }

  const user = JSON.parse(saved);

  const avatar = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  if (loginBtn) loginBtn.style.display = "none";

  // 🔥 NIE NADPISUJ jeśli już istnieje (FIX “ZNIKANIA”)
  if (userBox.dataset.rendered === "1") return;
  userBox.dataset.rendered = "1";

  userBox.innerHTML = `
    <div class="user-dropdown">
      <div class="user-trigger" id="userTrigger">
        <img src="${avatar}" class="user-avatar">
        <span class="user-name">${user.username}</span>
      </div>

      <div class="user-menu" id="userMenu">
        <button class="logout-btn" id="logoutBtn">Wyloguj się</button>
      </div>
    </div>
  `;

  const trigger = get("userTrigger");
  const menu = get("userMenu");

  if (trigger && menu) {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("active");
    });

    document.addEventListener("click", () => {
      menu.classList.remove("active");
    });
  }

  get("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("user");
    location.reload();
  });
}

document.addEventListener("DOMContentLoaded", renderAuthUI);