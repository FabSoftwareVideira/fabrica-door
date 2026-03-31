const createPages = require("../data/pages");

module.exports = function createPageService(rootDir) {
    const pages = createPages(rootDir);

    function getAllPages() {
        return pages;
    }

    function getPageBySlug(slug) {
        return pages[slug] || null;
    }

    return {
        getAllPages,
        getPageBySlug
    };
};
