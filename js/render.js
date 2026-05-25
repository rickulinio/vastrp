function getUser() {
  const saved = localStorage.getItem("user");
  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

function getAvatar(user) {
  if (!user) return "";

  return user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;
}

function clearUserUI() {
  const loginBtn = document.getElementById("loginBtn");
  const userBox = document.getElementById("user");

  if (loginBtn) loginBtn.style.display = "inline-flex";
  if (userBox) userBox.innerHTML = "";
}

function renderAuthUI() {
  const user = getUser();

  const loginBtn = document.getElementById("loginBtn");
  const userBox = document.getElementById("user");

  if (!user) {
    clearUserUI();
    return;
  }

  const avatar = getAvatar(user);

  if (loginBtn) loginBtn.style.display = "none";

  // WAŻNE: reset eventów przez replaceNode (lepsze niż innerHTML-only chaos)
  const wrapper = document.createElement("div");
  wrapper.className = "user-dropdown";

  wrapper.innerHTML = `
    <div class="user-trigger">
      <img src="${avatar}" class="user-avatar">
      <span class="user-name">${user.username}</span>
    </div>

    <div class="user-menu">
      <button class="logout-btn">Wyloguj się</button>
    </div>
  `;

  userBox.innerHTML = "";
  userBox.appendChild(wrapper);

  const trigger = wrapper.querySelector(".user-trigger");
  const menu = wrapper.querySelector(".user-menu");
  const logoutBtn = wrapper.querySelector(".logout-btn");

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("active");
  });

  document.addEventListener("click", () => {
    menu.classList.remove("active");
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth:update"));
  });
}

/* ================= INIT ================= */

window.addEventListener("auth:update", renderAuthUI);
document.addEventListener("DOMContentLoaded", renderAuthUI);