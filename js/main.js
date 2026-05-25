function renderAuthUI() {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const loginBtn = document.getElementById("loginBtn");
  const userBox = document.getElementById("user");

  if (!userBox) return;

  if (!user) {
    if (loginBtn) loginBtn.style.display = "inline-flex";
    userBox.innerHTML = "";
    return;
  }

  if (loginBtn) loginBtn.style.display = "none";

  const avatarHash = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  userBox.innerHTML = `
    <div class="user-dropdown">
      <div class="user-trigger" id="userTrigger">
        <img src="${avatarHash}" class="user-avatar">
        <span class="user-name">${user.username || "User"}</span>
      </div>

      <div class="user-menu" id="userMenu">
        <button class="logout-btn" id="logoutBtn">Wyloguj</button>
      </div>
    </div>
  `;

  const trigger = document.getElementById("userTrigger");
  const menu = document.getElementById("userMenu");

  if (trigger && menu) {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("active");
    });

    document.addEventListener("click", () => {
      menu.classList.remove("active");
    });
  }

  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.reload();
    });
  }
}

renderAuthUI();