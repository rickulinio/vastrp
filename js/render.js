/* ================= USER STORAGE ================= */

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

/* ================= UI RESET ================= */

function clearUserUI() {
  const loginBtn = document.getElementById("loginBtn");
  const userBox = document.getElementById("user");

  if (loginBtn) loginBtn.style.display = "inline-flex";
  if (userBox) userBox.innerHTML = "";
}

/* ================= SAFE CLICK OUTSIDE ================= */

function setupOutsideClick(menu) {
  const handler = (e) => {
    if (!menu.contains(e.target)) {
      menu.classList.remove("active");
    }
  };

  document.addEventListener("click", handler);

  return handler;
}

/* ================= MAIN RENDER ================= */

let outsideClickHandler = null;

function renderAuthUI() {
  const user = getUser();

  const loginBtn = document.getElementById("loginBtn");
  const userBox = document.getElementById("user");

  if (!user || !userBox) {
    clearUserUI();
    return;
  }

  const avatar = getAvatar(user);

  if (loginBtn) loginBtn.style.display = "none";

  // 🔥 ważne: czyścimy poprzedni listener click outside
  if (outsideClickHandler) {
    document.removeEventListener("click", outsideClickHandler);
    outsideClickHandler = null;
  }

  userBox.innerHTML = `
    <div class="user-dropdown">
      <div class="user-trigger">
        <img src="${avatar}" class="user-avatar">
        <span class="user-name">${user.username}</span>
      </div>

      <div class="user-menu">
        <button class="logout-btn">Wyloguj się</button>
      </div>
    </div>
  `;

  const trigger = userBox.querySelector(".user-trigger");
  const menu = userBox.querySelector(".user-menu");
  const logoutBtn = userBox.querySelector(".logout-btn");

  if (!trigger || !menu || !logoutBtn) return;

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("active");
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    renderAuthUI();
  });

  // klik poza menu
  outsideClickHandler = (e) => {
    if (!userBox.contains(e.target)) {
      menu.classList.remove("active");
    }
  };

  document.addEventListener("click", outsideClickHandler);
}

/* ================= INIT ================= */

window.addEventListener("auth:update", renderAuthUI);
document.addEventListener("DOMContentLoaded", renderAuthUI);