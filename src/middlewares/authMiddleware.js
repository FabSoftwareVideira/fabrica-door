module.exports = function createAuthMiddleware(authService) {
    return function requireAuth(req, res, next) {
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
