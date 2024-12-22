"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResendVarificationCode = exports.validateVerifyUser = exports.validateUserSchema = void 0;
const zod_1 = require("zod");
exports.validateUserSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
exports.validateVerifyUser = zod_1.z.object({
    email: zod_1.z.string().email(),
    verificationCode: zod_1.z.string(),
});
exports.validateResendVarificationCode = zod_1.z.object({
    email: zod_1.z.string().email(),
});
