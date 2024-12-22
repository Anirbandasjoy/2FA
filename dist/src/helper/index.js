"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessRefreshTokenAndCookieSeter = exports.setRefreshTokenCookie = exports.setAccessTokenCookie = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("@/config");
const createToken = (payload, secretKey, expiresIn) => {
    if (typeof payload !== "object" ||
        payload === null ||
        Array.isArray(payload)) {
        throw new Error("Payload must be a non-empty object");
    }
    if (typeof secretKey !== "string" || secretKey.trim().length === 0) {
        throw new Error("SecretKey must be a non-empty string");
    }
    try {
        const token = jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn });
        return token;
    }
    catch (error) {
        console.error("Failed to sign in JWT:", error);
        throw error;
    }
};
exports.createToken = createToken;
// cookie setter
const setAccessTokenCookie = (res, accessToken) => {
    try {
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000,
        });
    }
    catch (error) {
        console.error("Error setting cookie:", error);
        throw new Error("Failed to set cookie");
    }
};
exports.setAccessTokenCookie = setAccessTokenCookie;
const setRefreshTokenCookie = (res, refreshToken) => {
    try {
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 365 * 24 * 60 * 60 * 1000,
        });
    }
    catch (error) {
        console.error("Error setting cookie:", error);
        throw new Error("Failed to set cookie");
    }
};
exports.setRefreshTokenCookie = setRefreshTokenCookie;
const accessRefreshTokenAndCookieSeter = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = (0, exports.createToken)({
            user: {
                _id: data.user._id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role,
            },
        }, config_1.jwt_access_secret, "15m");
        if (!accessToken) {
            return data.next((0, config_1.createError)(401, "not created accessToken"));
        }
        (0, exports.setAccessTokenCookie)(data.res, accessToken);
        const refreshToken = (0, exports.createToken)({
            user: {
                _id: data.user._id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role,
            },
        }, config_1.jwt_refresh_secret, "30d");
        if (!refreshToken) {
            return data.next((0, config_1.createError)(401, "not created refreshToken"));
        }
        (0, exports.setRefreshTokenCookie)(data.res, refreshToken);
    }
    catch (error) {
        console.log(error);
    }
});
exports.accessRefreshTokenAndCookieSeter = accessRefreshTokenAndCookieSeter;
