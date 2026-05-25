/* ─────────────────────────────
   RENDER FACTIONS
───────────────────────────── */
const factionsGrid = document.getElementById('factions-grid');

FACTIONS.forEach(faction => {

  const card = document.createElement('div');

  card.className = 'faction-card reveal';

  card.style.setProperty('--fc', faction.color);

  card.innerHTML = `
    <div class="fc-top">

      <div class="fc-icon">
        ${faction.icon}
      </div>

      <div>
        <div class="fc-name">
          ${faction.name}
        </div>

        <span class="fc-tag">
          ${faction.tag}
        </span>
      </div>

    </div>

    <p class="fc-desc">
      ${faction.desc}
    </p>

    <button
      class="fc-cta"
      style="
        --fc:${faction.color};
        background:${faction.color}18;
        border-color:${faction.color}30;
      "
      onclick="openModal('${faction.key}')"
    >
      Złóż Podanie
      <span>→</span>
    </button>
  `;

  factionsGrid.appendChild(card);
});

/* ─────────────────────────────
   RENDER TEAM
───────────────────────────── */
const teamGrid = document.getElementById('team-grid');

TEAM.forEach(member => {

  teamGrid.innerHTML += `
    <div class="team-card reveal">

      <div class="team-av">
        ${member.initials}
      </div>

      <div class="team-name">
        ${member.name}
      </div>

      <div class="team-role">
        ${member.role}
      </div>

      <div class="team-bio">
        ${member.bio}
      </div>

    </div>
  `;
});

/* ─────────────────────────────
   RENDER FAQ
───────────────────────────── */
const faqList = document.getElementById('faq-list');

FAQS.forEach(item => {

  faqList.innerHTML += `
    <div class="faq-item">

      <button
        class="faq-q"
        onclick="toggleFaq(this)"
      >

        ${item.q}

        <div class="faq-arrow">
          <svg viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>

      </button>

      <div class="faq-body">
        <div class="faq-body-inner">
          ${item.a}
        </div>
      </div>

    </div>
  `;
});