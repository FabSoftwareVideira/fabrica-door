const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");

module.exports = function createAuthRoutes(authController) {
    const router = express.Router();

    router.get("/auth/login", authController.showLogin);
    router.post("/auth/login", asyncHandler(authController.login));
    router.post("/auth/logout", authController.logout);

    return router;
};
