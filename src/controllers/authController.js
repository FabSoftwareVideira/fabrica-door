const renderPage = require("../utils/renderPage");

module.exports = function createAuthController({ site, authService }) {
    function getRequestIp(req) {
        return req.ip || req.socket?.remoteAddress || "unknown";
    }

    function renderLoginWithError(res, email, errorMessage, statusCode = 200) {
        res.status(statusCode);
        return renderPage(res, site, {
            currentPath: "",
            template: "auth/login.html",
            page: {
                title: "Login"
            },
            extra: {
                errorMessage,
                formEmail: email
            }
        });
    }

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
        const ip = getRequestIp(req);

        const blockStatus = authService.getLoginBlockStatus(email, ip);

        if (blockStatus.blocked) {
            const waitMinutes = Math.ceil(blockStatus.remainingMs / 60000);
            return renderLoginWithError(
                res,
                email,
                `Muitas tentativas de login. Tente novamente em ${waitMinutes} minuto(s).`,
                429
            );
        }

        const user = await authService.authenticate(email, password);

        if (!user) {
            const failedStatus = authService.registerFailedLogin(email, ip);

            if (failedStatus.blocked) {
                return renderLoginWithError(
                    res,
                    email,
                    "Muitas tentativas de login. Tente novamente em alguns minutos.",
                    429
                );
            }

            return renderLoginWithError(res, email, "E-mail ou senha inválidos.", 401);
        }

        authService.clearFailedLogins(email, ip);

        const token = authService.signToken(user);

        res.cookie("auth_token", token, authService.getCookieOptions());
        return res.redirect("/admin/projetos");
    }

    function logout(_req, res) {
        res.clearCookie("auth_token", authService.getCookieClearOptions());
        return res.redirect("/auth/login");
    }

    return {
        showLogin,
        login,
        logout
    };
};
