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
const config_1 = require("@/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: config_1.smtpUserName,
        pass: config_1.smtpPassword,
    },
});
const sendingEmail = (emailData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = {
            from: config_1.smtpUserName,
            to: emailData.email,
            subject: emailData.subject,
            html: emailData.html,
        };
        const info = yield transporter.sendMail(options);
        console.log("Message sent: %s", info.messageId);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.default = sendingEmail;
