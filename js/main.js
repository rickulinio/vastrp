const $ = (id) => document.getElementById(id);

/* ================= USER UI (ONLY DISPLAY) ================= */

function renderUserUI() {
  const userBox = $("user");
  const loginBtn = $("loginBtn");

  const user = window.AUTH?.getUser?.();

  if (!user) {
    if (loginBtn) loginBtn.style.display = "inline-flex";
    if (userBox) userBox.innerHTML = "";
    return;
  }

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
        <button class="logout-btn" id="logoutBtn">Wyloguj się</button>
      </div>
    </div>
  `;

  const trigger = $("userTrigger");
  const menu = $("userMenu");

  if (trigger && menu) {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("active");
    });

    document.addEventListener("click", () => {
      menu.classList.remove("active");
    });
  }

  $("logoutBtn")?.addEventListener("click", () => {
    window.AUTH?.logout?.();
  });
}

renderUserUI();