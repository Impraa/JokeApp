"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendJoke = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendJoke = async function (joke, email) {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
            user: 'biznisimpra@gmail.com',
            pass: 'gmzvtxwjpvvqrans',
        },
    });
    await transporter.sendMail({
        from: '"Joke App" <biznisimpra@gmail.com>',
        to: `${email}`,
        subject: "Joke App - Joke you requested",
        text: "Here is your joke :D",
        html: `<strong>${joke}</strong>`,
    });
};
exports.sendJoke = sendJoke;
