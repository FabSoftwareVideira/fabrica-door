module.exports = function renderPage(res, site, options) {
    const {
        template,
        currentPath = "",
        page = null,
        extra = {}
    } = options;

    res.render(template, {
        SITENAME: site.SITE_NAME,
        SITEURL: site.SITE_URL,
        EMAIL_FABRICA: site.EMAIL_FABRICA,
        API_KEY: site.API_KEY,
        GOOGLE_ANALYTICS: site.GOOGLE_ANALYTICS,
        MENUITEMS: site.MENUITEMS,
        SOCIAL_LINKS: site.SOCIAL_LINKS,
        current_year: new Date().getFullYear(),
        currentPath,
        isAuthenticated: Boolean(res.locals?.isAuthenticated),
        page,
        ...extra
    });
};
