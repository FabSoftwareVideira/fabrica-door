const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = function createAuthService(adminUserModel) {
    const jwtSecret = process.env.JWT_SECRET || "change_me_in_production";
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "8h";

    async function authenticate(email, password) {
        const user = await adminUserModel.findByEmail(email);

        if (!user) {
            return null;
        }

        const valid = await bcrypt.compare(password, user.password_hash);

        if (!valid) {
            return null;
        }

        return {
            id: user.id,
            email: user.email
        };
    }

    function signToken(user) {
        return jwt.sign(
            {
                sub: user.id,
                email: user.email
            },
            jwtSecret,
            { expiresIn: jwtExpiresIn }
        );
    }

    function verifyToken(token) {
        return jwt.verify(token, jwtSecret);
    }

    function getCookieOptions() {
        return {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 8
        };
    }

    return {
        authenticate,
        signToken,
        verifyToken,
        getCookieOptions
    };
};
