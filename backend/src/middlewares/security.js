import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import sanitize from "mongo-sanitize"

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

    // NoSQL injection
    app.use((req, res, next) => {
    // Lọc dữ liệu trong body
    req.body = sanitize(req.body); 

    // Lọc dữ liệu trong query
    if (req.query) {
        const cleanQuery = sanitize(req.query);
        // Xóa hết key cũ trong req.query
        for (const key in req.query) {
            delete req.query[key];
        }
        // Copy key từ cleanQuery bỏ vào lại req.query
        Object.assign(req.query, cleanQuery);
    }

    // Lọc dữ liệu trong params
    if (req.params) {
        const cleanParams = sanitize(req.params);
        // Xóa hết key cũ trong req.params
        for (const key in req.params) {
            delete req.params[key];
        }
        // Copy key từ cleanParams bỏ vào lại req.params
        Object.assign(req.params, cleanParams);
    }

    next();
    });

    // Chặn HTTP parameter pollution
    app.use(hpp());
};