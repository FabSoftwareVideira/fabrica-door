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
    const BEAT_SECONDS = 0.4; // ~150 BPM, bem mais animado
    const STEPS_PER_BEAT = 2;
    const SWING = 0.05; // leve balanço nos contratempos
    const LOOKAHEAD_MS = 200;
    const SCHEDULE_AHEAD = 0.6;
    const VOLUME = 0.5;
    const STEP_SECONDS = BEAT_SECONDS / STEPS_PER_BEAT;
    const TOTAL_STEPS = 96;

    // Refrão de "Jingle Bells" em 12 compassos: [nota, duração em tempos].
    const TUNE = [
      ["E5", 1], ["E5", 1], ["E5", 2],
      ["E5", 1], ["E5", 1], ["E5", 2],
      ["E5", 1], ["G5", 1], ["C5", 1.5], ["D5", 0.5],
      ["E5", 4],
      ["F5", 1], ["F5", 1], ["F5", 1.5], ["F5", 0.5],
      ["F5", 1], ["E5", 1], ["E5", 1], ["E5", 0.5], ["E5", 0.5],
      ["E5", 1], ["D5", 1], ["D5", 1], ["E5", 1],
      ["D5", 2], ["G5", 2],
      ["F5", 1], ["F5", 1], ["F5", 1.5], ["F5", 0.5],
      ["F5", 1], ["E5", 1], ["E5", 1], ["E5", 0.5], ["E5", 0.5],
      ["G5", 1], ["G5", 1], ["F5", 1], ["D5", 1],
      ["C5", 4]
    ];

    // Harmonia por compasso, para o baixo saltitante.
    const BAR_ROOTS = [
      "C3", "C3", "C3", "C3",
      "F3", "C3", "G3", "G3",
      "F3", "C3", "G3", "C3"
    ];

    const melodyByStep = new Map();
    let tuneCursor = 0;

    TUNE.forEach(([note, beats]) => {
      melodyByStep.set(tuneCursor, { note, beats });
      tuneCursor += Math.round(beats * STEPS_PER_BEAT);
    });

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
    let noiseBuffer = null;
    let schedulerTimer = null;
    let loopStartTime = 0;
    let currentStep = 0;
    let nextStepTime = 0;
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

        const compressor = audioContext.createDynamicsCompressor();
        compressor.threshold.value = -16;
        compressor.knee.value = 20;
        compressor.ratio.value = 6;
        compressor.attack.value = 0.004;
        compressor.release.value = 0.2;

        masterGain.connect(compressor);
        compressor.connect(audioContext.destination);
      }

      if (audioContext.state === "suspended") {
        audioContext.resume().catch(() => {});
      }

      return audioContext;
    }

    function getNoiseBuffer() {
      if (noiseBuffer) return noiseBuffer;

      const length = Math.floor(audioContext.sampleRate * 0.5);
      noiseBuffer = audioContext.createBuffer(
        1,
        length,
        audioContext.sampleRate
      );

      const data = noiseBuffer.getChannelData(0);

      for (let index = 0; index < length; index += 1) {
        data[index] = Math.random() * 2 - 1;
      }

      return noiseBuffer;
    }

    function playTone(
      type,
      frequency,
      startAt,
      duration,
      level,
      filterFrequency,
      detune
    ) {
      const oscillator = audioContext.createOscillator();
      const filter = audioContext.createBiquadFilter();
      const envelope = audioContext.createGain();

      oscillator.type = type;
      oscillator.frequency.value = frequency;

      if (detune) oscillator.detune.value = detune;

      filter.type = "lowpass";
      filter.frequency.value = filterFrequency;
      filter.Q.value = 0.7;

      envelope.gain.setValueAtTime(0.0001, startAt);
      envelope.gain.exponentialRampToValueAtTime(level, startAt + 0.008);
      envelope.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

      oscillator.connect(filter);
      filter.connect(envelope);
      envelope.connect(masterGain);
      oscillator.start(startAt);
      oscillator.stop(startAt + duration + 0.05);
    }

    function playLead(note, startAt, beats) {
      const frequency = noteFrequency(note);
      const duration = Math.min(beats * BEAT_SECONDS * 0.94 + 0.06, 1.7);

      // Brilho metálico + corpo, bem mais "pra frente" que o sininho antigo.
      playTone("square", frequency, startAt, duration, 0.19, 3400, 4);
      playTone("triangle", frequency, startAt, duration, 0.12, 2800, -4);
    }

    function playBass(frequency, level, startAt) {
      playTone("triangle", frequency, startAt, 0.22, level, 720, 0);
      playTone("sine", frequency / 2, startAt, 0.2, level * 0.35, 420, 0);
    }

    function playNoise(startAt, options) {
      const source = audioContext.createBufferSource();
      const filter = audioContext.createBiquadFilter();
      const envelope = audioContext.createGain();

      source.buffer = getNoiseBuffer();
      filter.type = options.type;
      filter.frequency.value = options.frequency;
      filter.Q.value = options.q ?? 1;

      envelope.gain.setValueAtTime(options.level, startAt);
      envelope.gain.exponentialRampToValueAtTime(
        0.0001,
        startAt + options.duration
      );

      source.connect(filter);
      filter.connect(envelope);
      envelope.connect(masterGain);
      source.start(startAt);
      source.stop(startAt + options.duration + 0.02);
    }

    function playKick(startAt, level) {
      const oscillator = audioContext.createOscillator();
      const envelope = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(150, startAt);
      oscillator.frequency.exponentialRampToValueAtTime(48, startAt + 0.12);

      envelope.gain.setValueAtTime(0.85 * level, startAt);
      envelope.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.22);

      oscillator.connect(envelope);
      envelope.connect(masterGain);
      oscillator.start(startAt);
      oscillator.stop(startAt + 0.24);
    }

    function playSnare(startAt) {
      playNoise(startAt, {
        type: "bandpass",
        frequency: 1900,
        q: 0.9,
        level: 0.5,
        duration: 0.16
      });
    }

    function playShaker(startAt, level) {
      playNoise(startAt, {
        type: "highpass",
        frequency: 7000,
        q: 0.7,
        level,
        duration: 0.05
      });
    }

    function playSleigh(startAt) {
      playNoise(startAt, {
        type: "bandpass",
        frequency: 5200,
        q: 2.4,
        level: 0.07,
        duration: 0.13
      });
    }

    function playCrash(startAt) {
      playNoise(startAt, {
        type: "highpass",
        frequency: 3800,
        q: 0.5,
        level: 0.18,
        duration: 0.6
      });
    }

    function stepOffset(step) {
      return (
        step * STEP_SECONDS + (step % 2 === 1 ? SWING * BEAT_SECONDS : 0)
      );
    }

    function scheduleStep(step, startAt) {
      const bar = Math.floor(step / 8);
      const position = step % 8;
      const melody = melodyByStep.get(step);
      const root = noteFrequency(BAR_ROOTS[bar]);

      if (melody) {
        playLead(melody.note, startAt, melody.beats);
      }

      // Baixo saltitante: fundamental nos tempos, oitava nos contratempos.
      playBass(
        position % 2 === 0 ? root : root * 2,
        position % 2 === 0 ? 0.34 : 0.22,
        startAt
      );

      if (position === 0 || position === 4) playKick(startAt, 1);
      if (position === 7) playKick(startAt, 0.5);
      if (position === 2 || position === 6) playSnare(startAt);
      if (step === 0) playCrash(startAt);

      playShaker(startAt, position % 2 === 0 ? 0.08 : 0.045);
      if (position % 2 === 0) playSleigh(startAt);
    }

    function scheduleMusic() {
      if (!musicPlaying || !audioContext) return;

      const now = audioContext.currentTime;

      // Se a aba ficou parada, reancora a grade em vez de despejar notas atrasadas.
      if (nextStepTime < now - 0.4) {
        loopStartTime = now + 0.05 - stepOffset(currentStep);
        nextStepTime = now + 0.05;
      }

      while (nextStepTime < now + SCHEDULE_AHEAD) {
        scheduleStep(currentStep, nextStepTime);

        currentStep += 1;

        if (currentStep >= TOTAL_STEPS) {
          currentStep = 0;
          loopStartTime += TOTAL_STEPS * STEP_SECONDS;
        }

        nextStepTime = loopStartTime + stepOffset(currentStep);
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
      currentStep = 0;
      loopStartTime = now + 0.22;
      nextStepTime = loopStartTime;

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
          currentStep = 0;
          loopStartTime = audioContext.currentTime + 0.2;
          nextStepTime = loopStartTime;
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
