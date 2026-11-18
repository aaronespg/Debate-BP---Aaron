const state = {
  data: null,
  filtered: [],
  randomMotion: null,
  showRandomInfoslide: false,
  revealed: false,
};

const els = {
  themeToggle: document.getElementById("theme-toggle"),
  statTotal: document.getElementById("stat-total"),
  statTorneos: document.getElementById("stat-torneos"),
  statInfoslides: document.getElementById("stat-infoslides"),
  statTraducidas: document.getElementById("stat-traducidas"),
  generatedAt: document.getElementById("generated-at"),
  btnRandom: document.getElementById("btn-random"),
  randomUseFilters: document.getElementById("random-use-filters"),
  randomStage: document.getElementById("random-stage"),
  filterText: document.getElementById("filter-text"),
  filterTorneo: document.getElementById("filter-torneo"),
  filterIdioma: document.getElementById("filter-idioma"),
  filterInfoslide: document.getElementById("filter-infoslide"),
  btnClearFilters: document.getElementById("btn-clear-filters"),
  resultsCount: document.getElementById("results-count"),
  motionsContainer: document.getElementById("motions-container"),
};

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function initTheme() {
  const saved = localStorage.getItem("bp-theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
  els.themeToggle.textContent = saved === "dark" ? "☀️ Modo claro" : "🌙 Modo oscuro";

  els.themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("bp-theme", next);
    els.themeToggle.textContent = next === "dark" ? "☀️ Modo claro" : "🌙 Modo oscuro";
  });
}

function renderInfoslideHtml(m) {
  if (!m.tiene_infoslide) return "";
  const textoEs = m.infoslide_es || m.infoslide;
  const tieneOriginal = m.idioma === "en" && m.infoslide && m.infoslide_es && m.infoslide !== m.infoslide_es;

  return `
    <div class="infoslide-box">
      <strong>Infoslide${tieneOriginal ? " (Traducido al español)" : ""}</strong>
      <div>${escapeHtml(textoEs)}</div>
      ${
        tieneOriginal
          ? `<details class="original-en">
               <summary>Ver infoslide original en inglés</summary>
               <p>${escapeHtml(m.infoslide)}</p>
             </details>`
          : ""
      }
    </div>
  `;
}

function renderRandomStage() {
  const m = state.randomMotion;
  if (!m) {
    els.randomStage.className = "random-stage empty";
    els.randomStage.innerHTML = `<p class="muted">Haz clic en <strong>“Sortear moción”</strong> para comenzar una práctica anónima.</p>`;
    return;
  }

  els.randomStage.className = "random-stage active";
  const textoPrincipal = m.mocion_es || m.mocion;
  const esIngles = m.idioma === "en";

  els.randomStage.innerHTML = `
    <div class="random-meta-bar">
      <div class="motion-badges">
        ${
          state.revealed
            ? `<span class="badge badge-accent">🔓 Revelado</span>`
            : `<span class="badge badge-warn">🔒 Torneo y ronda ocultos</span>`
        }
        ${m.tiene_infoslide ? `<span class="badge badge-info">📄 Con Infoslide</span>` : ""}
        ${esIngles ? `<span class="badge badge-neutral">🌐 EN → ES</span>` : `<span class="badge badge-neutral">🇪🇸 ES</span>`}
      </div>
      <div class="random-stage-buttons">
        ${
          m.tiene_infoslide
            ? `<button id="btn-toggle-infoslide" class="btn btn-ghost" type="button">
                 ${state.showRandomInfoslide ? "📄 Ocultar Infoslide" : "📄 Ver Infoslide"}
               </button>`
            : ""
        }
        ${
          state.revealed
            ? ""
            : `<button id="btn-reveal" class="btn btn-secondary" type="button">👁️ Revelar torneo y ronda</button>`
        }
      </div>
    </div>

    <p class="random-motion-text">${escapeHtml(textoPrincipal)}</p>

    ${
      esIngles && m.mocion !== textoPrincipal
        ? `<details class="original-en">
             <summary>Ver moción original en inglés</summary>
             <p>${escapeHtml(m.mocion)}</p>
           </details>`
        : ""
    }

    ${state.showRandomInfoslide ? renderInfoslideHtml(m) : ""}

    ${
      state.revealed
        ? `<div class="revealed-box">
             <div>
               <strong>Torneo:</strong> ${escapeHtml(m.torneo)} &nbsp;·&nbsp;
               <strong>Ronda:</strong> ${escapeHtml(m.ronda)}
             </div>
             <a href="${escapeHtml(m.url)}" target="_blank" rel="noopener noreferrer">Ver en Calicotab ↗</a>
           </div>`
        : ""
    }
  `;

  const btnToggleInfo = document.getElementById("btn-toggle-infoslide");
  if (btnToggleInfo) {
    btnToggleInfo.addEventListener("click", () => {
      state.showRandomInfoslide = !state.showRandomInfoslide;
      renderRandomStage();
    });
  }

  const btnReveal = document.getElementById("btn-reveal");
  if (btnReveal) {
    btnReveal.addEventListener("click", () => {
      state.revealed = true;
      renderRandomStage();
    });
  }
}

function pickRandomMotion() {
  if (!state.data) return;
  const pool =
    els.randomUseFilters.checked && state.filtered.length > 0
      ? state.filtered
      : state.data.mociones;

  if (!pool.length) return;
  const idx = Math.floor(Math.random() * pool.length);
  state.randomMotion = pool[idx];
  state.showRandomInfoslide = false;
  state.revealed = false;
  renderRandomStage();
}

function applyFilters() {
  if (!state.data) return;
  const q = els.filterText.value.trim().toLowerCase();
  const torneo = els.filterTorneo.value;
  const idioma = els.filterIdioma.value;
  const infoslide = els.filterInfoslide.value;

  state.filtered = state.data.mociones.filter((m) => {
    if (torneo && m.torneo !== torneo) return false;
    if (idioma && m.idioma !== idioma) return false;
    if (infoslide === "con" && !m.tiene_infoslide) return false;
    if (infoslide === "sin" && m.tiene_infoslide) return false;
    if (q) {
      const haystack = [m.torneo, m.ronda, m.mocion, m.mocion_es, m.infoslide, m.infoslide_es]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  renderMotionsList();
}

function renderMotionsList() {
  const list = state.filtered;
  els.resultsCount.textContent = `${list.length} ${list.length === 1 ? "moción" : "mociones"}`;

  if (!list.length) {
    els.motionsContainer.innerHTML = `<div class="empty-state card">No se encontraron mociones con los filtros seleccionados.</div>`;
    return;
  }

  // Agrupar por torneo preservando el orden
  const grupos = new Map();
  for (const m of list) {
    if (!grupos.has(m.torneo)) {
      grupos.set(m.torneo, { url: m.url, items: [] });
    }
    grupos.get(m.torneo).items.push(m);
  }

  const html = [];
  for (const [torneo, grupo] of grupos.entries()) {
    const cardsHtml = grupo.items
      .map((m) => {
        const textoPrincipal = m.mocion_es || m.mocion;
        const esIngles = m.idioma === "en";
        return `
          <article class="motion-card">
            <div class="motion-top">
              <div class="motion-badges">
                <span class="badge badge-neutral">${escapeHtml(m.ronda)}</span>
                ${m.tiene_infoslide ? `<span class="badge badge-info">📄 Infoslide</span>` : ""}
                ${esIngles ? `<span class="badge badge-neutral">🌐 EN → ES</span>` : `<span class="badge badge-neutral">🇪🇸 ES</span>`}
              </div>
            </div>
            <p class="motion-text">${escapeHtml(textoPrincipal)}</p>
            ${
              esIngles && m.mocion !== textoPrincipal
                ? `<details class="original-en">
                     <summary>Ver original en inglés</summary>
                     <p>${escapeHtml(m.mocion)}</p>
                   </details>`
                : ""
            }
            ${renderInfoslideHtml(m)}
          </article>
        `;
      })
      .join("");

    html.push(`
      <section class="tournament-block">
        <div class="tournament-header">
          <h3>${escapeHtml(torneo)} <span class="badge badge-neutral">${grupo.items.length}</span></h3>
          <a href="${escapeHtml(grupo.url)}" target="_blank" rel="noopener noreferrer">Fuente Calicotab ↗</a>
        </div>
        <div class="motion-list">${cardsHtml}</div>
      </section>
    `);
  }

  els.motionsContainer.innerHTML = html.join("");
}

async function init() {
  initTheme();

  try {
    const res = await fetch("data/mociones.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    state.data = data;

    els.statTotal.textContent = data.total_mociones;
    els.statTorneos.textContent = data.total_torneos;
    els.statInfoslides.textContent = data.total_con_infoslide;
    els.statTraducidas.textContent = data.total_traducidas;
    els.generatedAt.textContent = data.generado_en || "—";

    const torneos = [...new Set(data.mociones.map((m) => m.torneo))];
    for (const t of torneos) {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      els.filterTorneo.appendChild(opt);
    }

    applyFilters();
  } catch (err) {
    els.motionsContainer.innerHTML = `
      <div class="empty-state card">
        Error al cargar <code>data/mociones.json</code> (${escapeHtml(err.message)}).
        Si estás abriendo el archivo localmente con <code>file://</code>, usa un servidor local
        (por ejemplo <code>py -m http.server</code>) o ábrelo desde GitHub Pages.
      </div>
    `;
  }

  els.btnRandom.addEventListener("click", pickRandomMotion);
  els.filterText.addEventListener("input", applyFilters);
  els.filterTorneo.addEventListener("change", applyFilters);
  els.filterIdioma.addEventListener("change", applyFilters);
  els.filterInfoslide.addEventListener("change", applyFilters);
  els.btnClearFilters.addEventListener("click", () => {
    els.filterText.value = "";
    els.filterTorneo.value = "";
    els.filterIdioma.value = "";
    els.filterInfoslide.value = "";
    applyFilters();
  });
}

init();
