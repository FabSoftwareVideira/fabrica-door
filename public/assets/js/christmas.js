/**
 * Tema de Natal — neve e controles.
 * Só executa quando o servidor marca <html data-season="christmas">.
 * Respeita prefers-reduced-motion e permite desligar a neve.
 */
(() => {
  const root = document.documentElement;

  if (root.dataset.season !== "christmas") return;

  const snowLayer = document.getElementById("christmas-snow");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const STORAGE_KEY = "fabrica-door-snow";
  const flakes = [];

  let snowEnabled = readPreference();

  function readPreference() {
    try {
      return window.sessionStorage.getItem(STORAGE_KEY) !== "off";
    } catch (_error) {
      return true;
    }
  }

  function savePreference(enabled) {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
    } catch (_error) {
      // sessionStorage indisponível: mantém apenas em memória.
    }
  }

  function flakeCount() {
    return window.innerWidth < 700 ? 26 : 64;
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function buildFlakes() {
    if (!snowLayer) return;

    snowLayer.replaceChildren();
    flakes.length = 0;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < flakeCount(); i += 1) {
      const flake = document.createElement("span");
      flake.className = "christmas-flake";
      flake.setAttribute("aria-hidden", "true");

      const size = randomBetween(6, 18);

      flake.style.setProperty("--size", `${size.toFixed(1)}px`);
      flake.style.setProperty("--left", `${randomBetween(0, 100).toFixed(2)}%`);
      flake.style.setProperty("--drift", `${randomBetween(-11, 11).toFixed(2)}vw`);
      flake.style.setProperty("--duration", `${randomBetween(9, 23).toFixed(2)}s`);
      flake.style.setProperty("--delay", `${randomBetween(-23, 0).toFixed(2)}s`);
      flake.style.setProperty("--opacity", randomBetween(0.35, 0.9).toFixed(2));
      flake.style.setProperty("--blur", Math.random() < 0.22 ? "1px" : "0px");

      const glyph = document.createElement("span");
      glyph.className = "christmas-flake-glyph";
      glyph.textContent = Math.random() < 0.7 ? "❄" : "❅";
      glyph.style.setProperty(
        "--spin-duration",
        `${randomBetween(6, 16).toFixed(2)}s`
      );

      flake.appendChild(glyph);
      fragment.appendChild(flake);
      flakes.push(flake);
    }

    snowLayer.appendChild(fragment);
  }

  function clearFlakes() {
    if (snowLayer) snowLayer.replaceChildren();
    flakes.length = 0;
  }

  function isSnowVisible() {
    return snowEnabled && !reducedMotion.matches;
  }

  function syncState() {
    const visible = isSnowVisible();

    root.classList.toggle("snow-disabled", !visible);
    toggle.setAttribute("aria-pressed", String(visible));
    toggle.setAttribute(
      "aria-label",
      visible ? "Desativar a neve de Natal" : "Ativar a neve de Natal"
    );
    toggle.title = visible ? "Desativar a neve" : "Ativar a neve";
    toggle.querySelector(".christmas-snow-toggle-icon").textContent = visible
      ? "❄"
      : "✕";

    if (visible && flakes.length === 0) {
      buildFlakes();
    }

    if (!visible) {
      clearFlakes();
    }
  }

  // Botão discreto para ligar/desligar a neve.
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "christmas-snow-toggle";
  toggle.setAttribute("aria-pressed", "true");
  toggle.innerHTML = '<span class="christmas-snow-toggle-icon" aria-hidden="true">❄</span>';
  document.body.appendChild(toggle);

  toggle.addEventListener("click", () => {
    snowEnabled = !snowEnabled;
    savePreference(snowEnabled);
    syncState();
  });

  reducedMotion.addEventListener("change", syncState);

  // Pausa a animação quando a aba fica em segundo plano.
  document.addEventListener("visibilitychange", () => {
    root.classList.toggle("snow-paused", document.hidden);
  });

  // Recalcula a quantidade de flocos ao mudar o tamanho da janela.
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (isSnowVisible()) buildFlakes();
    }, 300);
  });

  syncState();
})();
