const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");

module.exports = function createAuthRoutes(authController) {
    const router = express.Router();

    router.get("/auth/login", authController.showLogin);
    router.post("/auth/login", asyncHandler(authController.login));
    router.post("/auth/logout", authController.logout);

    // Google OAuth
    router.get("/auth/google", authController.googleLogin);
    router.get("/auth/google/callback", asyncHandler(authController.googleCallback));

    // Login automático para desenvolvimento (só ativo quando DEV_AUTO_LOGIN=true)
    router.post("/auth/dev-login", asyncHandler(authController.devLogin));

    return router;
};
