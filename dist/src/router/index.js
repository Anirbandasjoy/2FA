"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_router_1 = __importDefault(require("./user.router"));
const auth_router_1 = __importDefault(require("./auth.router"));
const rootRouter = (0, express_1.Router)();
rootRouter.use("/user", user_router_1.default);
rootRouter.use("/auth", auth_router_1.default);
exports.default = rootRouter;
