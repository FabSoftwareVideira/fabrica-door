const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = function createAuthService(adminUserModel) {
    const jwtSecret = process.env.JWT_SECRET || "change_me_in_production";
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "8h";
    const maxFailedAttempts = Number(process.env.AUTH_MAX_FAILED_ATTEMPTS || 5);
    const lockoutWindowMs = Number(
        process.env.AUTH_LOCKOUT_WINDOW_MS || 5 * 60 * 1000
    );
    const attemptRetentionMs = Number(
        process.env.AUTH_ATTEMPT_RETENTION_MS || 24 * 60 * 60 * 1000
    );

    const loginAttempts = new Map();

    // Hash usado para reduzir diferença de tempo quando o usuário não existe.
    const dummyHash = bcrypt.hashSync("invalid-password", 10);

    if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET deve ser definido em produção.");
    }

    function makeAttemptKey(email, ip) {
        return `${(email || "").trim().toLowerCase()}::${ip || "unknown"}`;
    }

    function cleanupExpiredAttempts(now = Date.now()) {
        for (const [key, entry] of loginAttempts.entries()) {
            if ((entry.blockedUntil || 0) < now && now - entry.lastAttemptAt > attemptRetentionMs) {
                loginAttempts.delete(key);
            }
        }
    }

    function getLoginBlockStatus(email, ip) {
        cleanupExpiredAttempts();
        const key = makeAttemptKey(email, ip);
        const entry = loginAttempts.get(key);

        if (!entry || !entry.blockedUntil) {
            return { blocked: false, remainingMs: 0 };
        }

        const remainingMs = entry.blockedUntil - Date.now();

        if (remainingMs <= 0) {
            loginAttempts.delete(key);
            return { blocked: false, remainingMs: 0 };
        }

        return { blocked: true, remainingMs };
    }

    function registerFailedLogin(email, ip) {
        const now = Date.now();
        const key = makeAttemptKey(email, ip);
        const current = loginAttempts.get(key);

        if (!current) {
            loginAttempts.set(key, {
                count: 1,
                firstAttemptAt: now,
                lastAttemptAt: now,
                blockedUntil: null
            });
            return getLoginBlockStatus(email, ip);
        }

        current.count += 1;
        current.lastAttemptAt = now;

        if (current.count >= maxFailedAttempts) {
            current.blockedUntil = now + lockoutWindowMs;
        }

        loginAttempts.set(key, current);
        return getLoginBlockStatus(email, ip);
    }

    function clearFailedLogins(email, ip) {
        const key = makeAttemptKey(email, ip);
        loginAttempts.delete(key);
    }

    function isAllowedAdminEmail(email) {
        const normalized = (email || "").trim().toLowerCase();
        return /@ifc\.edu\.br$/i.test(normalized);
    }

    async function authenticate(email, password) {
        const normalizedEmail = (email || "").trim().toLowerCase();

        if (!isAllowedAdminEmail(normalizedEmail)) {
            await bcrypt.compare(password, dummyHash);
            return null;
        }

        const user = await adminUserModel.findByEmail(normalizedEmail);

        if (!user) {
            await bcrypt.compare(password, dummyHash);
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

    async function findOrCreateByEmail(email) {
        const normalizedEmail = (email || "").trim().toLowerCase();

        if (!isAllowedAdminEmail(normalizedEmail)) {
            throw new Error("Acesso permitido apenas para e-mails do domínio @ifc.edu.br.");
        }

        const user = await adminUserModel.findByEmail(normalizedEmail);

        if (user) {
            return { id: user.id, email: user.email };
        }

        const created = await adminUserModel.create(normalizedEmail);
        return { id: created.id, email: created.email };
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
            path: "/",
            maxAge: 1000 * 60 * 60 * 8
        };
    }

    function getCookieClearOptions() {
        return {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/"
        };
    }

    return {
        authenticate,
        findOrCreateByEmail,
        signToken,
        verifyToken,
        getCookieOptions,
        getCookieClearOptions,
        getLoginBlockStatus,
        registerFailedLogin,
        clearFailedLogins
    };
};
