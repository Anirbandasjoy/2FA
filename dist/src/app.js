"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const response_1 = require("./helper/response");
const router_1 = __importDefault(require("./router"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes",
});
app.get("/", (_req, res) => {
    (0, response_1.successResponse)(res, { message: "Welcome to the Authtication API" });
});
app.use("/api/v1", limiter, router_1.default);
app.use((_req, _res, next) => {
    next((0, config_1.createError)(404, "route not found"));
});
app.use(((err, _req, res, _next) => {
    const statusCode = err.status || 500;
    const message = err.message || "An unexpected error occurred";
    (0, response_1.errorResponse)(res, { statusCode, message, payload: err });
}));
exports.default = app;
