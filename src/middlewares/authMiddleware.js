module.exports = function createAuthMiddleware(authService) {
    return function requireAuth(req, res, next) {
        // Em modo dev com DEV_AUTO_LOGIN=true, injeta usuário padrão sem precisar de token
        if (
            process.env.NODE_ENV !== "production" &&
            process.env.DEV_AUTO_LOGIN === "true"
        ) {
            req.user = { id: 0, email: "dev@localhost" };
            return next();
        }

        const header = req.headers.authorization || "";
        const bearerToken = header.startsWith("Bearer ") ? header.slice(7) : null;
        const token = req.cookies?.auth_token || bearerToken;

        if (!token) {
            return res.redirect("/auth/login");
        }

        try {
            req.user = authService.verifyToken(token);
            return next();
        } catch (_error) {
            res.clearCookie("auth_token");
            return res.redirect("/auth/login");
        }
    };
};
