"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required field"],
    },
    email: {
        type: String,
        required: [true, "Email is required field"],
        unique: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isActive: { type: Boolean, default: false },
    verificationCode: { type: String, required: false },
    verificationCodeExpiresAt: { type: Date, required: false },
    twoFactorCode: { type: String, required: false },
    twoFactorCodeExpiresAt: { type: Date, required: false },
    twoFactorEnabled: { type: Boolean, default: false },
}, { timestamps: true });
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
