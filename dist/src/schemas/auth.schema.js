"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate2FACode = exports.validate2FAEnabledDisabled = exports.validateLogin = void 0;
const zod_1 = require("zod");
exports.validateLogin = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
exports.validate2FAEnabledDisabled = zod_1.z.object({
    password: zod_1.z.string().min(8),
});
exports.validate2FACode = zod_1.z.object({
    email: zod_1.z.string().email(),
    code: zod_1.z.string(),
});
