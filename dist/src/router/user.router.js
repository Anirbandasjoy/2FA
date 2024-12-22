"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("@/controller/user.controller");
const auth_middleware_1 = require("@/middlewares/auth.middleware");
const schemas_1 = __importDefault(require("@/schemas"));
const user_schema_1 = require("@/schemas/user.schema");
const express_1 = require("express");
const userRouter = (0, express_1.Router)();
userRouter.post("/registation", (0, schemas_1.default)(user_schema_1.validateUserSchema), user_controller_1.handleUserRegistation);
userRouter.post("/verify-user", (0, schemas_1.default)(user_schema_1.validateVerifyUser), user_controller_1.handleVerify);
userRouter.post("/resend-verification-code", (0, schemas_1.default)(user_schema_1.validateResendVarificationCode), user_controller_1.handleResendVerificationCode);
userRouter.get("/current-user", auth_middleware_1.isLogin, user_controller_1.handleGetCurrentUser);
userRouter.get("/find-all-users", auth_middleware_1.isLogin, auth_middleware_1.isAdmin, user_controller_1.handleFindAllUsers);
exports.default = userRouter;
