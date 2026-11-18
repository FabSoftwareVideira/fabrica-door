/**
 * Janela anual do tema de Natal.
 *
 * As datas são configuradas no formato MM-DD (sem ano), então a mesma
 * configuração vale para todos os anos. A janela pode atravessar a virada
 * do ano (ex.: 12-20 até 01-06).
 */

const DEFAULT_START = "12-01";
const DEFAULT_END = "12-30";
const DEFAULT_TIME_ZONE = "America/Sao_Paulo";

const TRUTHY = new Set(["on", "true", "1", "yes", "sim", "ligado"]);
const FALSY = new Set(["off", "false", "0", "no", "nao", "não", "desligado"]);

function parseMonthDay(value, fallback) {
    const raw = String(value ?? "").trim();
    const match = /^(\d{1,2})\s*[-/.]\s*(\d{1,2})$/.exec(raw);

    if (!match) {
        return { ...fallback };
    }

    const month = Number(match[1]);
    const day = Number(match[2]);

    if (month < 1 || month > 12) {
        return { ...fallback };
    }

    // Usa um ano bissexto para validar 29/02 corretamente.
    const daysInMonth = new Date(Date.UTC(2000, month, 0)).getUTCDate();

    if (day < 1 || day > daysInMonth) {
        return { ...fallback };
    }

    return { month, day };
}

function normalizeMode(value) {
    const mode = String(value ?? "").trim().toLowerCase();

    if (TRUTHY.has(mode)) return "on";
    if (FALSY.has(mode)) return "off";
    return "auto";
}

function getMonthDay(now, timeZone) {
    try {
        const parts = new Intl.DateTimeFormat("en-US", {
            timeZone: timeZone || DEFAULT_TIME_ZONE,
            month: "numeric",
            day: "numeric"
        }).formatToParts(now);

        const month = Number(parts.find((part) => part.type === "month")?.value);
        const day = Number(parts.find((part) => part.type === "day")?.value);

        if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            return { month, day };
        }
    } catch (_error) {
        // Fuso horário inválido: cai no horário local do servidor.
    }

    return { month: now.getMonth() + 1, day: now.getDate() };
}

function toIndex({ month, day }) {
    return month * 100 + day;
}

/**
 * @param {object} [config]
 * @param {"auto"|"on"|"off"} [config.mode]
 * @param {string} [config.start] data inicial MM-DD
 * @param {string} [config.end] data final MM-DD
 * @param {string} [config.timeZone] fuso usado para decidir "hoje"
 * @param {Date} [now]
 * @returns {boolean}
 */
function isChristmasSeason(config = {}, now = new Date()) {
    const mode = normalizeMode(config.mode);

    if (mode === "on") return true;
    if (mode === "off") return false;

    const start = parseMonthDay(config.start, { month: 12, day: 1 });
    const end = parseMonthDay(config.end, { month: 12, day: 30 });
    const today = getMonthDay(now, config.timeZone);

    const startIndex = toIndex(start);
    const endIndex = toIndex(end);
    const todayIndex = toIndex(today);

    // Janela dentro do mesmo ano.
    if (startIndex <= endIndex) {
        return todayIndex >= startIndex && todayIndex <= endIndex;
    }

    // Janela que atravessa a virada do ano.
    return todayIndex >= startIndex || todayIndex <= endIndex;
}

/**
 * Versão detalhada, útil para logs e para exibir a janela configurada.
 */
function getChristmasStatus(config = {}, now = new Date()) {
    const mode = normalizeMode(config.mode);
    const start = parseMonthDay(config.start, { month: 12, day: 1 });
    const end = parseMonthDay(config.end, { month: 12, day: 30 });

    return {
        active: isChristmasSeason(config, now),
        mode,
        start,
        end,
        timeZone: config.timeZone || DEFAULT_TIME_ZONE
    };
}

module.exports = {
    DEFAULT_END,
    DEFAULT_START,
    DEFAULT_TIME_ZONE,
    isChristmasSeason,
    getChristmasStatus,
    parseMonthDay
};
