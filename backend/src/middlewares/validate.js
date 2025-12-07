import { body, validationResult } from "express-validator";

// CHECK RESULT
export const validate = (rules) => {
    return async (req, res, next) => {
        await Promise.all(rules.map(rule => rule.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: "fail",
                errors: errors.array()
            });
        }
        next();
    };
};

// RULES — signup
export const signupRules = [
    body("EMAIL")
        .isEmail().withMessage("Invalid email")
        .normalizeEmail(),

    body("PASSWORD")
        .isLength({ min: 8 }).withMessage("Password too short")
];
