"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isLogOut = exports.isLogin = void 0;
const config_1 = require("@/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isLogin = (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return next((0, config_1.createError)(401, "Access token not found, please loggedIn"));
        }
        const decode = jsonwebtoken_1.default.verify(accessToken, config_1.jwt_access_secret);
        if (!decode) {
            return next((0, config_1.createError)(401, "Invalid token"));
        }
        if (!decode.user) {
            return next((0, config_1.createError)(401, "Token does not contain user information"));
        }
        req.user = decode.user;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.isLogin = isLogin;
const isLogOut = (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (accessToken) {
            return next((0, config_1.createError)(401, "User already logged in"));
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.isLogOut = isLogOut;
const isAdmin = (req, res, next) => {
    try {
        if (req.user) {
            if (req.user.role !== "admin") {
                return next((0, config_1.createError)(403, "Fobidden access"));
            }
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.isAdmin = isAdmin;
