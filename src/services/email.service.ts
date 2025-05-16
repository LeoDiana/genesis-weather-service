import nodemailer from "nodemailer";
import {config} from "../config";

// This code is for development. It doesn't send actual mails, it just mocks them
export const sendConfirmationEmail = async (to: string, token: string) => {
    const testAccount = await nodemailer.createTestAccount(); // creates fake credentials

    const transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    const confirmLink = `${config.baseUrl}:${config.port}/api/confirm/${token}`;

    const info = await transporter.sendMail({
        from: '"Weather Bot" <no-reply@weather.com>',
        to,
        subject: "Confirm your subscription",
        html: `<a href="${confirmLink}">Click to confirm your subscription</a>`,
    });

    console.log("📩 Preview Email:", nodemailer.getTestMessageUrl(info));
};