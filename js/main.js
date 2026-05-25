function renderAuthUI() {
  const saved = localStorage.getItem("user");

  const loginBtn = document.getElementById("loginBtn");
  const userBox = document.getElementById("user");

  if (!saved) {
    if (loginBtn) loginBtn.style.display = "inline-flex";
    if (userBox) userBox.innerHTML = "";
    return;
  }

  const user = JSON.parse(saved);

  const avatar = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  if (loginBtn) loginBtn.style.display = "none";

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
      window.dispatchEvent(new Event("auth:update"));
    });
  }
}

/* ================= AUTO INIT ================= */

renderAuthUI();

/* ================= REACTIVE UPDATE ================= */

window.addEventListener("auth:update", renderAuthUI);