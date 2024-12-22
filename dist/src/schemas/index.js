"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("@/helper/response");
const validateRequest = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const validationErrors = result.error.errors.map((err) => ({
                path: err.path.join("."),
                message: err.message,
            }));
            return (0, response_1.errorResponse)(res, {
                statusCode: 400,
                message: "Validation failed",
                payload: validationErrors,
            });
        }
        next();
    };
};
exports.default = validateRequest;
