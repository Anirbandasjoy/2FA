"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("@/controller/auth.controller");
const auth_middleware_1 = require("@/middlewares/auth.middleware");
const schemas_1 = __importDefault(require("@/schemas"));
const auth_schema_1 = require("@/schemas/auth.schema");
const express_1 = require("express");
const authRouter = (0, express_1.Router)();
authRouter.post("/login", auth_middleware_1.isLogOut, (0, schemas_1.default)(auth_schema_1.validateLogin), auth_controller_1.handleLogin);
authRouter.post("/logOut", auth_middleware_1.isLogin, auth_controller_1.handleLogOut);
authRouter.get("/refresh-token", auth_controller_1.handelRefreshToken);
authRouter.post("/enable-2fa", auth_middleware_1.isLogin, (0, schemas_1.default)(auth_schema_1.validate2FAEnabledDisabled), auth_controller_1.handleEnable2FA);
authRouter.post("/disable-2fa", auth_middleware_1.isLogin, (0, schemas_1.default)(auth_schema_1.validate2FAEnabledDisabled), auth_controller_1.handleDisable2FA);
authRouter.put("/verify-2fa", (0, schemas_1.default)(auth_schema_1.validate2FACode), auth_controller_1.handleVerify2FACode);
exports.default = authRouter;
