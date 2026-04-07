const renderPage = require("../utils/renderPage");

module.exports = function createAuthController({ site, authService }) {
    function showLogin(_req, res) {
        renderPage(res, site, {
            currentPath: "",
            template: "auth/login.html",
            page: {
                title: "Login"
            },
            extra: {
                errorMessage: ""
            }
        });
    }

    async function login(req, res) {
        const email = (req.body.email || "").trim().toLowerCase();
        const password = req.body.password || "";

        const user = await authService.authenticate(email, password);

        if (!user) {
            return renderPage(res, site, {
                currentPath: "",
                template: "auth/login.html",
                page: {
                    title: "Login"
                },
                extra: {
                    errorMessage: "E-mail ou senha inválidos.",
                    formEmail: email
                }
            });
        }

        const token = authService.signToken(user);

        res.cookie("auth_token", token, authService.getCookieOptions());
        return res.redirect("/admin/projetos");
    }

    function logout(_req, res) {
        res.clearCookie("auth_token");
        return res.redirect("/auth/login");
    }

    return {
        showLogin,
        login,
        logout
    };
};
