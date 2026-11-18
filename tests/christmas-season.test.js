const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const nunjucks = require("nunjucks");

const {
    isChristmasSeason,
    getChristmasStatus,
    parseMonthDay
} = require("../src/utils/christmasSeason");

const templates = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(path.join(__dirname, "..", "src", "views")),
    { autoescape: true }
);

const CONFIG = {
    mode: "auto",
    start: "12-01",
    end: "12-30",
    timeZone: "UTC"
};

test("ativa na janela padrão e desativa fora dela", () => {
    assert.equal(
        isChristmasSeason(CONFIG, new Date("2026-11-30T12:00:00Z")),
        false
    );
    assert.equal(
        isChristmasSeason(CONFIG, new Date("2026-12-01T00:00:01Z")),
        true
    );
    assert.equal(
        isChristmasSeason(CONFIG, new Date("2026-12-25T15:00:00Z")),
        true
    );
    assert.equal(
        isChristmasSeason(CONFIG, new Date("2026-12-30T23:59:00Z")),
        true
    );
    assert.equal(
        isChristmasSeason(CONFIG, new Date("2026-12-31T00:00:01Z")),
        false
    );
});

test("a janela se repete automaticamente em todos os anos", () => {
    for (const year of [2027, 2028, 2030, 2035]) {
        assert.equal(
            isChristmasSeason(CONFIG, new Date(`${year}-12-01T12:00:00Z`)),
            true,
            `deveria ativar em ${year}`
        );
        assert.equal(
            isChristmasSeason(CONFIG, new Date(`${year}-11-30T12:00:00Z`)),
            false,
            `não deveria ativar em novembro de ${year}`
        );
    }
});

test("aceita janela que atravessa a virada do ano", () => {
    const config = { ...CONFIG, start: "12-20", end: "01-06" };

    assert.equal(isChristmasSeason(config, new Date("2026-12-19T12:00:00Z")), false);
    assert.equal(isChristmasSeason(config, new Date("2026-12-20T12:00:00Z")), true);
    assert.equal(isChristmasSeason(config, new Date("2027-01-01T12:00:00Z")), true);
    assert.equal(isChristmasSeason(config, new Date("2027-01-06T12:00:00Z")), true);
    assert.equal(isChristmasSeason(config, new Date("2027-01-07T12:00:00Z")), false);
});

test("modo on força e modo off desativa o tema", () => {
    const july = new Date("2026-07-10T12:00:00Z");

    assert.equal(isChristmasSeason({ ...CONFIG, mode: "on" }, july), true);
    assert.equal(
        isChristmasSeason(
            { ...CONFIG, mode: "off" },
            new Date("2026-12-25T12:00:00Z")
        ),
        false
    );
});

test("usa o fuso configurado para decidir o dia", () => {
    const config = { ...CONFIG, timeZone: "America/Sao_Paulo" };

    // 01/12 02:00 UTC ainda é 30/11 23:00 em São Paulo.
    assert.equal(
        isChristmasSeason(config, new Date("2026-12-01T02:00:00Z")),
        false
    );
    // 01/12 03:00 UTC já é 01/12 00:00 em São Paulo.
    assert.equal(
        isChristmasSeason(config, new Date("2026-12-01T03:00:00Z")),
        true
    );
});

test("datas inválidas caem nos padrões", () => {
    assert.deepEqual(parseMonthDay("13-01", { month: 12, day: 1 }), {
        month: 12,
        day: 1
    });
    assert.deepEqual(parseMonthDay("02-31", { month: 12, day: 30 }), {
        month: 12,
        day: 30
    });
    assert.deepEqual(parseMonthDay("1/12", { month: 12, day: 1 }), {
        month: 1,
        day: 12
    });

    const status = getChristmasStatus(
        { ...CONFIG, start: "invalido", end: "02-31" },
        new Date("2026-12-25T12:00:00Z")
    );

    assert.equal(status.active, true);
    assert.deepEqual(status.start, { month: 12, day: 1 });
    assert.deepEqual(status.end, { month: 12, day: 30 });
});

test("o layout só carrega os assets de Natal quando o tema está ativo", () => {
    const base = {
        SITEURL: "",
        SITENAME: "Fábrica",
        MENUITEMS: [],
        SOCIAL_LINKS: [],
        current_year: 2026
    };

    const withoutChristmas = templates.render("base.html", {
        ...base,
        isChristmas: false
    });

    assert.match(withoutChristmas, /data-season=""/);
    assert.doesNotMatch(withoutChristmas, /christmas\.css/);
    assert.doesNotMatch(withoutChristmas, /christmas-snow/);
    assert.doesNotMatch(withoutChristmas, /christmas-sleigh/);

    const withChristmas = templates.render("base.html", {
        ...base,
        isChristmas: true
    });

    assert.match(withChristmas, /data-season="christmas"/);
    assert.match(withChristmas, /assets\/css\/christmas\.css/);
    assert.match(withChristmas, /assets\/js\/christmas\.js/);
    assert.match(withChristmas, /id="christmas-snow"/);
    assert.match(withChristmas, /id="christmas-sleigh"/);
    assert.match(withChristmas, /class="santa-hat"/);
    assert.match(withChristmas, /class="christmas-lights"/);
});

test("a home e a equipe recebem os enfeites de Natal", () => {
    const index = templates.render("index.html", {
        SITEURL: "",
        SITENAME: "Fábrica",
        MENUITEMS: [],
        SOCIAL_LINKS: [],
        current_year: 2026,
        isChristmas: true,
        featuredProjects: []
    });

    assert.match(index, /christmas-eyebrow/);
    assert.match(index, /Feliz Natal da Fábrica de Software/);
    assert.match(index, /christmas-lab/);
    assert.match(index, /christmas-ascii-tree/);
    assert.match(index, /data-christmas-command="npm install natal"/);
    assert.match(index, /FELIZ NATAL<\/kbd>/);

    const regularIndex = templates.render("index.html", {
        SITEURL: "",
        SITENAME: "Fábrica",
        MENUITEMS: [],
        SOCIAL_LINKS: [],
        current_year: 2026,
        isChristmas: false,
        featuredProjects: []
    });

    assert.doesNotMatch(regularIndex, /christmas-lab/);
    assert.doesNotMatch(regularIndex, /christmas-ascii-tree/);

    const team = templates.render("team.html", {
        SITEURL: "",
        SITENAME: "Fábrica",
        MENUITEMS: [],
        SOCIAL_LINKS: [],
        current_year: 2026,
        isChristmas: true,
        page: { title: "Nossa Equipe", content: "<h2>Coordenação</h2>" }
    });

    assert.match(team, /team-greeting/);
    assert.match(team, /class="team-hat"/);

    const regularTeam = templates.render("team.html", {
        SITEURL: "",
        SITENAME: "Fábrica",
        MENUITEMS: [],
        SOCIAL_LINKS: [],
        current_year: 2026,
        isChristmas: false,
        page: { title: "Nossa Equipe", content: "<h2>Coordenação</h2>" }
    });

    assert.doesNotMatch(regularTeam, /team-hat/);
});
