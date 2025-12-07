// security.js
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";

export const securityMiddleware = (app) => {
    // HTTP headers
    app.use(helmet());

    // Limit request spam
    app.use(rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 200,
        standardHeaders: true,
        legacyHeaders: false
    }));

    // Chặn NoSQL injection
    app.use(mongoSanitize());

    // Chặn XSS
    app.use(xss());

    // Chặn HTTP parameter pollution
    app.use(hpp());
};