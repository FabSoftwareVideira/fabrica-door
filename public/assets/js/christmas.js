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

  /* ---------- Música de Natal (Web Audio, só por clique) ---------- */
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (AudioContextClass) {
    const SEMITONES = {
      C: 0,
      "C#": 1,
      D: 2,
      "D#": 3,
      E: 4,
      F: 5,
      "F#": 6,
      G: 7,
      "G#": 8,
      A: 9,
      "A#": 10,
      B: 11
    };
    const BEAT_SECONDS = 0.52;
    const LOOKAHEAD_MS = 250;
    const SCHEDULE_AHEAD = 0.9;
    const VOLUME = 0.16;

    // Refrão de "Jingle Bells": [nota, duração em tempos].
    const MELODY = [
      ["E5", 1], ["E5", 1], ["E5", 2],
      ["E5", 1], ["E5", 1], ["E5", 2],
      ["E5", 1], ["G5", 1], ["C5", 1.5], ["D5", 0.5],
      ["E5", 4],
      ["F5", 1], ["F5", 1], ["F5", 1.5], ["F5", 0.5],
      ["F5", 1], ["E5", 1], ["E5", 1], ["E5", 0.5], ["E5", 0.5],
      ["E5", 1], ["D5", 1], ["D5", 1], ["E5", 1],
      ["D5", 2], ["G5", 2],
      ["E5", 1], ["E5", 1], ["E5", 2],
      ["E5", 1], ["E5", 1], ["E5", 2],
      ["E5", 1], ["G5", 1], ["C5", 1.5], ["D5", 0.5],
      ["E5", 4],
      ["F5", 1], ["F5", 1], ["F5", 1.5], ["F5", 0.5],
      ["F5", 1], ["E5", 1], ["E5", 1], ["E5", 0.5], ["E5", 0.5],
      ["G5", 1], ["G5", 1], ["F5", 1], ["D5", 1],
      ["C5", 4]
    ];

    const musicToggle = document.createElement("button");
    musicToggle.type = "button";
    musicToggle.className = "christmas-music-toggle";
    musicToggle.setAttribute("aria-pressed", "false");
    musicToggle.setAttribute("aria-label", "Ativar a música de Natal");
    musicToggle.title = "Tocar música de Natal";
    musicToggle.innerHTML =
      '<span class="christmas-music-toggle-icon" aria-hidden="true">🎵</span>';
    document.body.appendChild(musicToggle);

    let audioContext = null;
    let masterGain = null;
    let schedulerTimer = null;
    let nextNoteTime = 0;
    let noteIndex = 0;
    let musicPlaying = false;

    function noteFrequency(note) {
      const match = /^([A-G]#?)(\d)$/.exec(note);

      if (!match) return 440;

      const semitone =
        SEMITONES[match[1]] + (Number(match[2]) + 1) * 12;

      return 440 * Math.pow(2, (semitone - 69) / 12);
    }

    function ensureAudioContext() {
      if (!audioContext) {
        audioContext = new AudioContextClass();
        masterGain = audioContext.createGain();
        masterGain.gain.value = 0;
        masterGain.connect(audioContext.destination);
      }

      if (audioContext.state === "suspended") {
        audioContext.resume().catch(() => {});
      }

      return audioContext;
    }

    function playNote(note, startAt, beats) {
      const frequency = noteFrequency(note);
      const duration = beats * BEAT_SECONDS;
      const release = Math.min(1.7, Math.max(0.3, duration * 0.92));
      const partials = [
        { type: "triangle", ratio: 1, gain: 0.5 },
        { type: "sine", ratio: 2.01, gain: 0.16 },
        { type: "sine", ratio: 3.02, gain: 0.06 }
      ];

      partials.forEach((partial) => {
        const oscillator = audioContext.createOscillator();
        const envelope = audioContext.createGain();

        oscillator.type = partial.type;
        oscillator.frequency.value = frequency * partial.ratio;

        envelope.gain.setValueAtTime(0.0001, startAt);
        envelope.gain.exponentialRampToValueAtTime(
          partial.gain,
          startAt + 0.014
        );
        envelope.gain.exponentialRampToValueAtTime(0.0001, startAt + release);

        oscillator.connect(envelope);
        envelope.connect(masterGain);
        oscillator.start(startAt);
        oscillator.stop(startAt + release + 0.05);
      });
    }

    function scheduleMusic() {
      if (!musicPlaying || !audioContext) return;

      // Se a aba ficou parada, evita agendar uma rajada de notas atrasadas.
      if (nextNoteTime < audioContext.currentTime - 0.5) {
        nextNoteTime = audioContext.currentTime + 0.05;
      }

      while (nextNoteTime < audioContext.currentTime + SCHEDULE_AHEAD) {
        const [note, beats] = MELODY[noteIndex];

        playNote(note, nextNoteTime, beats);

        nextNoteTime += beats * BEAT_SECONDS;
        noteIndex += 1;

        if (noteIndex >= MELODY.length) {
          noteIndex = 0;
          nextNoteTime += 1.2; // respiro antes de repetir o refrão
        }
      }
    }

    function syncMusicButton() {
      musicToggle.setAttribute("aria-pressed", String(musicPlaying));
      musicToggle.setAttribute(
        "aria-label",
        musicPlaying
          ? "Desativar a música de Natal"
          : "Ativar a música de Natal"
      );
      musicToggle.title = musicPlaying
        ? "Desativar a música"
        : "Tocar música de Natal";
      musicToggle.classList.toggle("is-playing", musicPlaying);
      musicToggle.querySelector(".christmas-music-toggle-icon").textContent =
        musicPlaying ? "🔊" : "🎵";
    }

    function startMusic() {
      ensureAudioContext();

      const now = audioContext.currentTime;

      musicPlaying = true;
      noteIndex = 0;
      nextNoteTime = now + 0.18;

      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(
        Math.max(masterGain.gain.value, 0.0001),
        now
      );
      masterGain.gain.linearRampToValueAtTime(VOLUME, now + 0.6);

      scheduleMusic();

      window.clearInterval(schedulerTimer);
      schedulerTimer = window.setInterval(scheduleMusic, LOOKAHEAD_MS);

      syncMusicButton();
    }

    function stopMusic() {
      musicPlaying = false;
      window.clearInterval(schedulerTimer);
      schedulerTimer = null;

      if (audioContext && masterGain) {
        const now = audioContext.currentTime;

        masterGain.gain.cancelScheduledValues(now);
        masterGain.gain.setValueAtTime(
          Math.max(masterGain.gain.value, 0.0001),
          now
        );
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      }

      syncMusicButton();
    }

    musicToggle.addEventListener("click", () => {
      if (musicPlaying) {
        stopMusic();
        return;
      }

      startMusic();
    });

    // Não deixa a trilha tocando com a aba em segundo plano.
    document.addEventListener("visibilitychange", () => {
      if (!audioContext) return;

      if (document.hidden) {
        window.clearInterval(schedulerTimer);
        schedulerTimer = null;

        if (musicPlaying) {
          audioContext.suspend().catch(() => {});
        }

        return;
      }

      if (!musicPlaying) return;

      audioContext
        .resume()
        .then(() => {
          window.clearInterval(schedulerTimer);
          noteIndex = 0;
          nextNoteTime = audioContext.currentTime + 0.2;
          scheduleMusic();
          schedulerTimer = window.setInterval(scheduleMusic, LOOKAHEAD_MS);
        })
        .catch(() => {});
    });
  }

  reducedMotion.addEventListener("change", () => {
    syncState();
    handleReducedMotionChange();
  });

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
      positionSleigh();
    }, 300);
  });

  /* ---------- Trenó ---------- */
  const sleigh = document.getElementById("christmas-sleigh");
  let sleighTimer = null;

  function positionSleigh() {
    if (!sleigh) return;

    const header = document.getElementById("header");
    const headerHeight = header ? header.getBoundingClientRect().height : 88;

    sleigh.style.top = `${Math.round(headerHeight + 2)}px`;
  }

  function launchSleigh() {
    if (!sleigh || reducedMotion.matches) return;

    window.clearTimeout(sleighTimer);
    positionSleigh();
    sleigh.classList.remove("is-flying");
    // Reinicia a animação mesmo se ela já tiver rodado.
    void sleigh.offsetWidth;
    sleigh.classList.add("is-flying");

    sleighTimer = window.setTimeout(() => {
      sleigh.classList.remove("is-flying");
      scheduleSleigh();
    }, 17500);
  }

  function scheduleSleigh(delay) {
    if (!sleigh || reducedMotion.matches) return;

    window.clearTimeout(sleighTimer);
    sleighTimer = window.setTimeout(
      launchSleigh,
      delay ?? randomBetween(24000, 46000)
    );
  }

  function handleReducedMotionChange() {
    if (reducedMotion.matches) {
      window.clearTimeout(sleighTimer);
      if (sleigh) sleigh.classList.remove("is-flying");
      return;
    }

    scheduleSleigh(randomBetween(6000, 12000));
  }

  positionSleigh();
  scheduleSleigh(randomBetween(7000, 12000));

  /* ---------- Terminal natalino ---------- */
  const terminalOutput = document.getElementById("christmas-terminal-output");

  if (terminalOutput) {
    const terminalScroll = terminalOutput.parentElement;
    const terminalCommands = {
      "npm install natal": [
        "$ npm install natal",
        "> Resolvendo dependências festivas...",
        "+ natal@25.12.0",
        "+ renas@9.0.0",
        "+ neve@100.0.0",
        "+ alegria@infinito",
        "✔ 4 pacotes instalados em 0,25s. 0 vulnerabilidades.",
        "🎄 Feliz Natal! O espírito natalino já está em produção."
      ]
    };
    const autoLines = [
      "$ npm run build:natal",
      "> Compilando Natal... 100%",
      "> Baixando neve......... ok",
      "> Acendendo 16 lâmpadas. ok",
      "> Montando árvore de código... ok",
      "✔ Build concluído: 0 erros, 1 árvore, ∞ alegria."
    ];

    const lineQueue = [];
    let typing = false;
    let terminalGeneration = 0;

    function lineClassFor(text) {
      if (text.startsWith("$")) return "is-cmd";
      if (text.startsWith("✔") || text.startsWith("+")) return "is-ok";
      if (text.startsWith(">")) return "is-info";
      if (text.startsWith("!")) return "is-warn";
      return "";
    }

    function scrollTerminal() {
      terminalScroll.scrollTop = terminalScroll.scrollHeight;
    }

    function typeLine(text, generation, done) {
      const line = document.createElement("div");
      line.className = "christmas-terminal-line";

      const lineClass = lineClassFor(text);
      if (lineClass) line.classList.add(lineClass);

      terminalOutput.appendChild(line);
      scrollTerminal();

      if (reducedMotion.matches) {
        line.textContent = text;
        scrollTerminal();
        done();
        return;
      }

      // Baseado em tempo (não em número de timers) para manter o ritmo
      // mesmo quando o navegador atrasa os quadros.
      const charsPerSecond = 90;
      const startedAt = performance.now();

      function frame(now) {
        if (generation !== terminalGeneration) return;

        const visibleChars = Math.min(
          text.length,
          Math.floor(((now - startedAt) / 1000) * charsPerSecond)
        );

        line.textContent = text.slice(0, visibleChars);

        if (visibleChars < text.length) {
          window.requestAnimationFrame(frame);
        } else {
          line.textContent = text;
          scrollTerminal();
          done();
        }
      }

      window.requestAnimationFrame(frame);
    }

    function runQueue() {
      if (typing) return;

      const next = lineQueue.shift();

      if (!next) {
        typing = false;
        return;
      }

      typing = true;
      const generation = terminalGeneration;

      typeLine(next, generation, () => {
        if (generation !== terminalGeneration) {
          typing = false;
          runQueue();
          return;
        }

        window.setTimeout(() => {
          typing = false;
          runQueue();
        }, reducedMotion.matches ? 0 : 110);
      });
    }

    function enqueueTerminal(lines) {
      lineQueue.push(...lines);
      runQueue();
    }

    function clearTerminal() {
      terminalGeneration += 1;
      lineQueue.length = 0;
      typing = false;
      terminalOutput.replaceChildren();
    }

    const terminalPanel = terminalOutput.closest(".christmas-terminal-panel");
    let terminalStarted = false;

    if ("IntersectionObserver" in window && terminalPanel) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting) || terminalStarted) {
            return;
          }

          terminalStarted = true;
          observer.disconnect();
          enqueueTerminal(autoLines);
        },
        { threshold: 0.35 }
      );

      observer.observe(terminalPanel);
    } else {
      terminalStarted = true;
      enqueueTerminal(autoLines);
    }

    document
      .querySelectorAll("[data-christmas-command]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const command = button.dataset.christmasCommand;

          if (command === "clear") {
            clearTerminal();
            return;
          }

          const lines = terminalCommands[command];

          if (lines) {
            enqueueTerminal(lines);
            return;
          }

          enqueueTerminal([
            `$ ${command}`,
            "✔ Comando executado com espírito natalino."
          ]);
        });
      });
  }

  /* ---------- Presente surpresa ---------- */
  const gift = document.querySelector(".christmas-gift");
  const giftMessage = document.getElementById("christmas-gift-message");

  if (gift && giftMessage) {
    gift.addEventListener("click", () => {
      const isOpen = gift.classList.toggle("is-open");

      gift.setAttribute("aria-expanded", String(isOpen));
      gift.setAttribute(
        "aria-label",
        isOpen ? "Fechar o presente da equipe" : "Abrir o presente da equipe"
      );
      giftMessage.hidden = !isOpen;
    });
  }

  /* ---------- Papai Noel ---------- */
  const santa = document.querySelector(".christmas-santa");
  const santaBubble = document.getElementById("christmas-santa-bubble");
  let santaTimer = null;

  if (santa && santaBubble) {
    santa.addEventListener("click", () => {
      santa.classList.remove("is-ho-ho");
      santa.querySelectorAll(".christmas-ho").forEach((ho) => ho.remove());
      // Reinicia a animação de pulinho.
      void santa.offsetWidth;
      santa.classList.add("is-ho-ho");
      santaBubble.hidden = false;

      window.clearTimeout(santaTimer);
      santaTimer = window.setTimeout(() => {
        santaBubble.hidden = true;
        santa.classList.remove("is-ho-ho");
      }, 4200);

      if (reducedMotion.matches) return;

      [
        { left: "4%", top: "-4px" },
        { left: "78%", top: "6px" },
        { left: "42%", top: "20px" }
      ].forEach((spot, index) => {
        const ho = document.createElement("span");
        ho.className = "christmas-ho";
        ho.textContent = "Ho!";
        ho.setAttribute("aria-hidden", "true");
        ho.style.left = spot.left;
        ho.style.top = spot.top;
        ho.style.setProperty("--tilt", `${index % 2 ? 12 : -12}deg`);
        ho.style.animationDelay = `${index * 90}ms`;
        santa.appendChild(ho);
        ho.addEventListener("animationend", () => ho.remove(), { once: true });
      });
    });
  }

  /* ---------- Easter egg ---------- */
  const EGG_SEQUENCE = "feliz natal";
  let eggBuffer = "";
  let eggActive = false;

  function isTypingTarget(element) {
    if (!element) return false;

    return (
      element.tagName === "INPUT" ||
      element.tagName === "TEXTAREA" ||
      element.tagName === "SELECT" ||
      element.isContentEditable
    );
  }

  function triggerEasterEgg() {
    if (eggActive) return;

    eggActive = true;

    const overlay = document.createElement("div");
    overlay.className = "christmas-egg";
    overlay.setAttribute("role", "status");
    overlay.setAttribute("aria-live", "polite");
    overlay.innerHTML = `
      <div class="christmas-egg-card">
        <span class="christmas-egg-tree" aria-hidden="true">🎄</span>
        <p class="christmas-egg-title">FELIZ NATAL!</p>
        <p class="christmas-egg-text">
          Você encontrou o easter egg da Fábrica de Software. Que o seu código
          compile de primeira e as ideias não parem.
        </p>
      </div>
    `;

    if (!reducedMotion.matches) {
      const glyphs = ["🎄", "🎁", "⭐", "❄️", "✨", "🔔"];

      for (let index = 0; index < 34; index += 1) {
        const piece = document.createElement("span");
        piece.className = "christmas-egg-confetti";
        piece.setAttribute("aria-hidden", "true");
        piece.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
        piece.style.setProperty(
          "--left",
          `${randomBetween(0, 100).toFixed(1)}vw`
        );
        piece.style.setProperty("--size", `${randomBetween(1, 2).toFixed(1)}rem`);
        piece.style.setProperty(
          "--drift",
          `${randomBetween(-12, 12).toFixed(1)}vw`
        );
        piece.style.setProperty(
          "--duration",
          `${randomBetween(2.6, 4.8).toFixed(2)}s`
        );
        piece.style.setProperty("--delay", `${randomBetween(0, 1.2).toFixed(2)}s`);
        overlay.appendChild(piece);
      }
    }

    document.body.appendChild(overlay);
    window.requestAnimationFrame(() => overlay.classList.add("is-visible"));

    launchSleigh();

    window.setTimeout(() => {
      overlay.classList.remove("is-visible");
      window.setTimeout(() => {
        overlay.remove();
        eggActive = false;
      }, 450);
    }, reducedMotion.matches ? 3600 : 5200);
  }

  document.addEventListener("keydown", (event) => {
    if (
      event.defaultPrevented ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    ) {
      return;
    }

    if (typeof event.key !== "string" || event.key.length !== 1) return;
    if (isTypingTarget(document.activeElement)) return;

    eggBuffer = (eggBuffer + event.key.toLowerCase()).slice(-EGG_SEQUENCE.length);

    if (eggBuffer === EGG_SEQUENCE) {
      eggBuffer = "";
      triggerEasterEgg();
    }
  });

  syncState();
})();
