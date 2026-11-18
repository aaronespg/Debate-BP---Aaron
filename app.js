const ICONS = {
  moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
  eye: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  lock: `<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  unlock: `<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`,
  ext: `<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`,
};

const state = {
  data: null,
  filtered: [],
  randomMotion: null,
  motionRevealed: false,
  metaRevealed: false,
  lastDrawText: "",
};

const els = {
  themeToggle: document.getElementById("theme-toggle"),
  themeIcon: document.getElementById("theme-icon"),
  themeLabel: document.getElementById("theme-label"),
  statTotal: document.getElementById("stat-total"),
  statTorneos: document.getElementById("stat-torneos"),
  statInfoslides: document.getElementById("stat-infoslides"),
  statTraducidas: document.getElementById("stat-traducidas"),
  generatedAt: document.getElementById("generated-at"),
  btnRandom: document.getElementById("btn-random"),
  randomPoolCount: document.getElementById("random-pool-count"),
  randomFilterTema: document.getElementById("random-filter-tema"),
  randomFilterTipo: document.getElementById("random-filter-tipo"),
  randomFilterInfoslide: document.getElementById("random-filter-infoslide"),
  btnClearRandomFilters: document.getElementById("btn-clear-random-filters"),
  randomStage: document.getElementById("random-stage"),
  teamsFormGrid: document.getElementById("teams-form-grid"),
  btnDrawPositions: document.getElementById("btn-draw-positions"),
  btnClearTeams: document.getElementById("btn-clear-teams"),
  positionsResult: document.getElementById("positions-result"),
  chambersGrid: document.getElementById("chambers-grid"),
  btnCopyPositions: document.getElementById("btn-copy-positions"),
  filterText: document.getElementById("filter-text"),
  filterTorneo: document.getElementById("filter-torneo"),
  filterTema: document.getElementById("filter-tema"),
  filterTipo: document.getElementById("filter-tipo"),
  filterIdioma: document.getElementById("filter-idioma"),
  filterInfoslide: document.getElementById("filter-infoslide"),
  btnClearFilters: document.getElementById("btn-clear-filters"),
  resultsCount: document.getElementById("results-count"),
  motionsContainer: document.getElementById("motions-container"),
  manualSectionsContainer: document.getElementById("manual-sections-container"),
  rubricOradoras: document.getElementById("rubric-oradoras"),
  rubricPrincipales: document.getElementById("rubric-principales"),
  rubricPanelistas: document.getElementById("rubric-panelistas"),
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
  const apply = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    els.themeIcon.innerHTML = theme === "dark" ? ICONS.sun : ICONS.moon;
    els.themeLabel.textContent = theme === "dark" ? "Modo claro" : "Modo oscuro";
  };
  const saved = localStorage.getItem("bp-theme") || "light";
  apply(saved);

  els.themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem("bp-theme", next);
    apply(next);
  });
}

function initTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.tab;
      buttons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("active", active);
        b.setAttribute("aria-selected", String(active));
      });
      panels.forEach((p) => {
        const active = p.id === targetId;
        p.classList.toggle("active", active);
        p.hidden = !active;
      });
    });
  });
}

function renderInfoslideHtml(m) {
  if (!m.tiene_infoslide) return "";
  const textoEs = m.infoslide_es || m.infoslide;
  const tieneOriginal =
    m.idioma === "en" && m.infoslide && m.infoslide_es && m.infoslide !== m.infoslide_es;

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
  if (!m) return;

  els.randomStage.className = "random-stage active";
  const textoPrincipal = m.mocion_es || m.mocion;
  const esIngles = m.idioma === "en";

  els.randomStage.innerHTML = `
    <div class="random-meta-bar">
      <div class="motion-badges">
        ${
          state.metaRevealed
            ? `<span class="badge badge-accent">${ICONS.unlock} Torneo y ronda revelados</span>`
            : `<span class="badge badge-warn">${ICONS.lock} Torneo y ronda ocultos</span>`
        }
        ${m.tiene_infoslide ? `<span class="badge badge-info">Con Infoslide</span>` : `<span class="badge badge-neutral">Sin Infoslide</span>`}
        ${esIngles ? `<span class="badge badge-neutral">EN -> ES</span>` : `<span class="badge badge-neutral">ES</span>`}
      </div>
      <div>
        ${
          state.metaRevealed
            ? ""
            : `<button id="btn-reveal-meta" class="btn btn-secondary btn-sm" type="button">${ICONS.eye} <span>Revelar torneo y ronda</span></button>`
        }
      </div>
    </div>

    ${m.tiene_infoslide ? renderInfoslideHtml(m) : ""}

    ${
      state.motionRevealed
        ? `<p class="random-motion-text">${escapeHtml(textoPrincipal)}</p>
           ${
             esIngles && m.mocion !== textoPrincipal
               ? `<details class="original-en">
                    <summary>Ver moción original en inglés</summary>
                    <p>${escapeHtml(m.mocion)}</p>
                  </details>`
               : ""
           }`
        : `<div class="motion-hidden-box">
             <p>${
               m.tiene_infoslide
                 ? "Moción oculta. Lee el infoslide y pulsa el botón para revelar la moción."
                 : "Moción oculta. Pulsa el botón cuando estés listo para revelarla."
             }</p>
             <button id="btn-reveal-motion" class="btn btn-primary" type="button">
               ${ICONS.eye} <span>Revelar moción</span>
             </button>
           </div>`
    }

    ${
      state.metaRevealed
        ? `<div class="revealed-box">
             <div>
               <strong>Torneo:</strong> ${escapeHtml(m.torneo)} &nbsp;·&nbsp;
               <strong>Ronda:</strong> ${escapeHtml(m.ronda)}
             </div>
             <a href="${escapeHtml(m.url)}" target="_blank" rel="noopener noreferrer">
               <span>Ver en Calicotab</span> ${ICONS.ext}
             </a>
           </div>`
        : ""
    }
  `;

  const btnRevealMotion = document.getElementById("btn-reveal-motion");
  if (btnRevealMotion) {
    btnRevealMotion.addEventListener("click", () => {
      state.motionRevealed = true;
      renderRandomStage();
    });
  }

  const btnRevealMeta = document.getElementById("btn-reveal-meta");
  if (btnRevealMeta) {
    btnRevealMeta.addEventListener("click", () => {
      state.metaRevealed = true;
      renderRandomStage();
    });
  }
}

function getRandomPool() {
  if (!state.data) return [];
  const tema = els.randomFilterTema.value;
  const tipo = els.randomFilterTipo.value;
  const infoslide = els.randomFilterInfoslide.value;

  return state.data.mociones.filter((m) => {
    if (tema && m.tema !== tema) return false;
    if (tipo && m.tipo_mocion !== tipo) return false;
    if (infoslide === "con" && !m.tiene_infoslide) return false;
    if (infoslide === "sin" && m.tiene_infoslide) return false;
    return true;
  });
}

function updateRandomPoolCount() {
  const pool = getRandomPool();
  els.randomPoolCount.textContent = `${pool.length} ${pool.length === 1 ? "disponible" : "disponibles"}`;
  els.btnRandom.disabled = pool.length === 0;
}

function pickRandomMotion() {
  const pool = getRandomPool();
  if (!pool.length) return;
  const idx = Math.floor(Math.random() * pool.length);
  state.randomMotion = pool[idx];
  state.motionRevealed = false;
  state.metaRevealed = false;
  renderRandomStage();
}

/* Sorteador de Posiciones BP */
function initPositionDrawer() {
  const slotsHtml = [1, 2, 3, 4]
    .map(
      (n) => `
      <div class="team-slot" data-slot="${n}">
        <div class="team-slot-head">
          <span class="team-slot-title">
            <span class="team-num">${n}</span>
            <span>Equipo ${n}</span>
          </span>
          <label class="iron-toggle">
            <input type="checkbox" class="iron-check" data-slot="${n}" />
            <span>Iron-person</span>
          </label>
        </div>
        <div class="speaker-fields">
          <input type="text" class="sp1" data-slot="${n}" placeholder="Orador 1" />
          <input type="text" class="sp2" data-slot="${n}" placeholder="Orador 2" />
        </div>
      </div>
    `
    )
    .join("");

  els.teamsFormGrid.innerHTML = slotsHtml;

  els.teamsFormGrid.querySelectorAll(".iron-check").forEach((chk) => {
    chk.addEventListener("change", (e) => {
      const slot = e.target.dataset.slot;
      const sp1 = els.teamsFormGrid.querySelector(`.sp1[data-slot="${slot}"]`);
      const sp2 = els.teamsFormGrid.querySelector(`.sp2[data-slot="${slot}"]`);
      if (e.target.checked) {
        sp2.value = sp1.value;
        sp2.disabled = true;
      } else {
        sp2.disabled = false;
      }
    });
  });

  els.teamsFormGrid.querySelectorAll(".sp1").forEach((inp) => {
    inp.addEventListener("input", (e) => {
      const slot = e.target.dataset.slot;
      const chk = els.teamsFormGrid.querySelector(`.iron-check[data-slot="${slot}"]`);
      const sp2 = els.teamsFormGrid.querySelector(`.sp2[data-slot="${slot}"]`);
      if (chk.checked) {
        sp2.value = e.target.value;
      }
    });
  });

  els.btnClearTeams.addEventListener("click", () => {
    els.teamsFormGrid.querySelectorAll("input[type='text']").forEach((i) => {
      i.value = "";
      i.disabled = false;
    });
    els.teamsFormGrid.querySelectorAll(".iron-check").forEach((c) => {
      c.checked = false;
    });
    els.positionsResult.hidden = true;
  });

  els.btnDrawPositions.addEventListener("click", () => {
    const teams = [1, 2, 3, 4].map((n) => {
      const sp1 = els.teamsFormGrid.querySelector(`.sp1[data-slot="${n}"]`).value.trim();
      const sp2 = els.teamsFormGrid.querySelector(`.sp2[data-slot="${n}"]`).value.trim();
      const iron = els.teamsFormGrid.querySelector(`.iron-check[data-slot="${n}"]`).checked;
      const nombre1 = sp1 || `Equipo ${n}`;
      const nombre2 = iron ? nombre1 : sp2;
      const label = nombre2 ? `${nombre1} / ${nombre2}` : nombre1;
      return { label, iron };
    });

    for (let i = teams.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [teams[i], teams[j]] = [teams[j], teams[i]];
    }

    const gov = [
      { nombre: "Alta de Gobierno (AG)", team: teams[0] },
      { nombre: "Baja de Gobierno (BG)", team: teams[2] },
    ];
    const opp = [
      { nombre: "Alta de Oposición (AO)", team: teams[1] },
      { nombre: "Baja de Oposición (BO)", team: teams[3] },
    ];

    const renderBench = (title, tipo, list) => `
      <div class="bench-column">
        <div class="bench-title">${title}</div>
        ${list
          .map(
            (c) => `
            <div class="chamber-card ${tipo}">
              <div class="chamber-label">${escapeHtml(c.nombre)}</div>
              <div class="chamber-speakers">
                <span>${escapeHtml(c.team.label)}</span>
                ${c.team.iron ? `<span class="badge badge-info">Iron-person</span>` : ""}
              </div>
            </div>
          `
          )
          .join("")}
      </div>
    `;

    els.chambersGrid.innerHTML =
      renderBench("Bancada de Gobierno", "gov", gov) +
      renderBench("Bancada de Oposición", "opp", opp);

    const ordenLogico = [gov[0], opp[0], gov[1], opp[1]];
    state.lastDrawText = ordenLogico
      .map((c) => `${c.nombre}: ${c.team.label}${c.team.iron ? " (Iron-person)" : ""}`)
      .join("\n");

    els.positionsResult.hidden = false;
    els.positionsResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  els.btnCopyPositions.addEventListener("click", async () => {
    if (!state.lastDrawText) return;
    try {
      await navigator.clipboard.writeText(state.lastDrawText);
      const span = els.btnCopyPositions.querySelector("span");
      span.textContent = "Copiado";
      setTimeout(() => {
        span.textContent = "Copiar sorteo";
      }, 1800);
    } catch {
      // Ignorar si el navegador bloquea el portapapeles
    }
  });
}

/* Banco de Mociones */
function applyFilters() {
  if (!state.data) return;
  const q = els.filterText.value.trim().toLowerCase();
  const torneo = els.filterTorneo.value;
  const tema = els.filterTema.value;
  const tipo = els.filterTipo.value;
  const idioma = els.filterIdioma.value;
  const infoslide = els.filterInfoslide.value;

  state.filtered = state.data.mociones.filter((m) => {
    if (torneo && m.torneo !== torneo) return false;
    if (tema && m.tema !== tema) return false;
    if (tipo && m.tipo_mocion !== tipo) return false;
    if (idioma && m.idioma !== idioma) return false;
    if (infoslide === "con" && !m.tiene_infoslide) return false;
    if (infoslide === "sin" && m.tiene_infoslide) return false;
    if (q) {
      const haystack = [m.torneo, m.ronda, m.tema, m.tipo_mocion, m.mocion, m.mocion_es, m.infoslide, m.infoslide_es]
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
                ${m.tema ? `<span class="badge badge-accent">${escapeHtml(m.tema)}</span>` : ""}
                ${m.tipo_mocion ? `<span class="badge badge-warn">${escapeHtml(m.tipo_mocion)}</span>` : ""}
                ${m.tiene_infoslide ? `<span class="badge badge-info">Infoslide</span>` : ""}
                ${esIngles ? `<span class="badge badge-neutral">EN -> ES</span>` : `<span class="badge badge-neutral">ES</span>`}
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
          <a href="${escapeHtml(grupo.url)}" target="_blank" rel="noopener noreferrer">
            <span>Fuente Calicotab</span> ${ICONS.ext}
          </a>
        </div>
        <div class="motion-list">${cardsHtml}</div>
      </section>
    `);
  }

  els.motionsContainer.innerHTML = html.join("");
}

function initSubtabs() {
  const buttons = document.querySelectorAll(".subtab-btn");
  const panels = document.querySelectorAll(".subtab-panel");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.subtab;
      buttons.forEach((b) => b.classList.toggle("active", b === btn));
      panels.forEach((p) => {
        const active = p.id === targetId;
        p.classList.toggle("active", active);
        p.hidden = !active;
      });
    });
  });
}

function renderJudgeTable(rows) {
  return `
    <div class="table-wrap">
      <table class="rubric-table">
        <thead>
          <tr>
            <th>Puntos</th>
            <th>Nivel</th>
            <th>Precisión</th>
            <th>Razonamiento / Justificación</th>
            <th>Discusión</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (r) => `
              <tr>
                <td><span class="score-pill">${escapeHtml(r.puntos)}</span></td>
                <td><strong>${escapeHtml(r.nivel)}</strong></td>
                <td>${escapeHtml(r.precision)}</td>
                <td>${escapeHtml(r.razonamiento)}</td>
                <td>${escapeHtml(r.discusion)}</td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

async function loadManualAndRubrics() {
  try {
    const res = await fetch("data/manual_cmude_2026.json?v=8", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const manual = await res.json();

    els.manualSectionsContainer.innerHTML = manual.manual_secciones
      .map(
        (sec) => `
        <article class="manual-card">
          <h3>${escapeHtml(sec.titulo)}</h3>
          <p>${escapeHtml(sec.resumen)}</p>
          <ul>
            ${sec.puntos.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}
          </ul>
        </article>
      `
      )
      .join("");

    els.rubricOradoras.innerHTML = `
      <div class="table-wrap">
        <table class="rubric-table">
          <thead>
            <tr>
              <th>Puntos</th>
              <th>Comentarios cualitativos</th>
            </tr>
          </thead>
          <tbody>
            ${manual.tabla_oradoras
              .map(
                (r) => `
                <tr>
                  <td><span class="score-pill">${escapeHtml(r.rango)}</span></td>
                  <td>${escapeHtml(r.descripcion)}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;

    els.rubricPrincipales.innerHTML = renderJudgeTable(manual.tabla_juezas_principales);
    els.rubricPanelistas.innerHTML = renderJudgeTable(manual.tabla_juezas_panelistas);
  } catch (err) {
    els.manualSectionsContainer.innerHTML = `<div class="empty-state">No se pudo cargar la guía del manual (${escapeHtml(err.message)}).</div>`;
  }
}

async function init() {
  initTheme();
  initTabs();
  initSubtabs();
  initPositionDrawer();
  loadManualAndRubrics();

  try {
    const res = await fetch("data/mociones.json?v=7", { cache: "no-store" });
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
      const opt1 = document.createElement("option");
      opt1.value = t;
      opt1.textContent = t;
      els.filterTorneo.appendChild(opt1);
    }

    const temas = [...new Set(data.mociones.map((m) => m.tema).filter(Boolean))].sort();
    for (const tema of temas) {
      for (const sel of [els.randomFilterTema, els.filterTema]) {
        const opt = document.createElement("option");
        opt.value = tema;
        opt.textContent = tema;
        sel.appendChild(opt);
      }
    }

    const tipos = [...new Set(data.mociones.map((m) => m.tipo_mocion).filter(Boolean))].sort();
    for (const tipo of tipos) {
      for (const sel of [els.randomFilterTipo, els.filterTipo]) {
        const opt = document.createElement("option");
        opt.value = tipo;
        opt.textContent = tipo;
        sel.appendChild(opt);
      }
    }

    updateRandomPoolCount();
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
  els.randomFilterTema.addEventListener("change", updateRandomPoolCount);
  els.randomFilterTipo.addEventListener("change", updateRandomPoolCount);
  els.randomFilterInfoslide.addEventListener("change", updateRandomPoolCount);
  els.btnClearRandomFilters.addEventListener("click", () => {
    els.randomFilterTema.value = "";
    els.randomFilterTipo.value = "";
    els.randomFilterInfoslide.value = "";
    updateRandomPoolCount();
  });
  els.filterText.addEventListener("input", applyFilters);
  els.filterTorneo.addEventListener("change", applyFilters);
  els.filterTema.addEventListener("change", applyFilters);
  els.filterTipo.addEventListener("change", applyFilters);
  els.filterIdioma.addEventListener("change", applyFilters);
  els.filterInfoslide.addEventListener("change", applyFilters);
  els.btnClearFilters.addEventListener("click", () => {
    els.filterText.value = "";
    els.filterTorneo.value = "";
    els.filterTema.value = "";
    els.filterTipo.value = "";
    els.filterIdioma.value = "";
    els.filterInfoslide.value = "";
    applyFilters();
  });
}

init();
