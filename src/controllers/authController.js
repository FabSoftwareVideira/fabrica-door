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

    function showLogin(req, res) {
        const isInvalidDomain = req.query?.error === "dominio";
        renderPage(res, site, {
            currentPath: "",
            template: "auth/login.html",
            page: {
                title: "Login"
            },
            extra: {
                errorMessage: isInvalidDomain
                    ? "Acesso permitido apenas para e-mails do domínio @ifc.edu.br."
                    : ""
            }
        });
    }

    async function login(req, res) {
        const email = (req.body.email || "").trim().toLowerCase();
        const ip = getRequestIp(req);

        if (email) {
            authService.registerFailedLogin(email, ip);
        }

        return renderLoginWithError(
            res,
            "",
            "Acesso administrativo permitido apenas via Google. Use sua conta do IFC para continuar.",
            403
        );
    }

    function logout(_req, res) {
        res.clearCookie("auth_token", authService.getCookieClearOptions());
        return res.redirect("/auth/login");
    }

    function buildGoogleRedirectUri(req) {
        const configured = process.env.GOOGLE_OAUTH_REDIRECT || site.SITE_URL;
        if (configured) {
            return configured.endsWith("/auth/google/callback")
                ? configured
                : `${configured.replace(/\/$/, "")}/auth/google/callback`;
        }

        const host = req.get("host") || "localhost";
        const protocol = req.protocol || "http";
        return `${protocol}://${host}/auth/google/callback`;
    }

    async function googleLogin(req, res) {
        const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
        if (!clientId || !clientSecret) {
            return renderLoginWithError(
                res,
                "",
                "Google OAuth não está configurado. Defina GOOGLE_OAUTH_CLIENT_ID e GOOGLE_OAUTH_CLIENT_SECRET."
            );
        }

        const redirectUri = buildGoogleRedirectUri(req);
        const state = Math.random().toString(36).slice(2);
        res.cookie("oauth_state", state, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/"
        });

        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: "code",
            scope: "openid email profile",
            access_type: "online",
            prompt: "select_account",
            state
        });

        return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
    }

    async function googleCallback(req, res) {
        try {
            const code = req.query.code;
            const state = req.query.state;
            const savedState = req.cookies?.oauth_state;
            res.clearCookie("oauth_state");

            if (!code || !state || state !== savedState) {
                return renderLoginWithError(res, "", "Falha na autenticação com Google.");
            }

            const redirectUri = buildGoogleRedirectUri(req);
            const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    code,
                    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
                    client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
                    redirect_uri: redirectUri,
                    grant_type: "authorization_code"
                })
            });

            const tokenJson = await tokenResponse.json();
            if (!tokenResponse.ok || !tokenJson?.access_token) {
                console.error("Google token error:", tokenJson);
                return renderLoginWithError(res, "", "Falha ao obter token do Google.");
            }

            const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${tokenJson.access_token}` }
            });

            const userInfo = await userInfoRes.json();
            const email = userInfo?.email;

            if (!email) {
                return renderLoginWithError(res, "", "E-mail não disponível no perfil Google.");
            }

            if (!/[@]ifc[.]edu[.]br$/i.test(email.trim())) {
                return res.redirect("/auth/login?error=dominio");
            }

            const user = await authService.findOrCreateByEmail(email);
            const token = authService.signToken(user);
            res.cookie("auth_token", token, authService.getCookieOptions());
            return res.redirect("/admin/projetos");
        } catch (err) {
            console.error("Google OAuth callback error:", err);
            return renderLoginWithError(res, "", "Erro ao autenticar com Google. Tente novamente.");
        }
    }

    return {
        showLogin,
        login,
        logout,
        googleLogin,
        googleCallback
    };
};
