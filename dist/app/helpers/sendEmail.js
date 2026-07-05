"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const index_js_1 = __importDefault(require("../config/index.js"));
const sendEmail = async (options) => {
    const transporter = nodemailer_1.default.createTransport({
        host: index_js_1.default.email.SMTP_HOST,
        port: Number(index_js_1.default.email.SMTP_PORT),
        secure: false,
        auth: {
            user: index_js_1.default.email.SMTP_USER,
            pass: index_js_1.default.email.SMTP_PASS,
        },
    });
    await transporter.sendMail({
        from: `"SOM App" <${index_js_1.default.email.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
    });
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map