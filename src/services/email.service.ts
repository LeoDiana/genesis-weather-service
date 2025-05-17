import nodemailer from "nodemailer";
import { config } from "../config";

export const sendConfirmationEmail = async (to: string, token: string) => {
  const transporter = nodemailer.createTransport({
    host: "in-v3.mailjet.com",
    port: 587,
    secure: false,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  });

  const confirmLink = `${config.baseUrl}:${config.port}/api/confirm/${token}`;

  const info = await transporter.sendMail({
    from: `"Weather Bot" <${config.mailSender}>`,
    to,
    subject: "Confirm your subscription",
    html: `<a href="${confirmLink}">Click to confirm your subscription</a>`,
  });

  console.log("📩 Preview Email:", info.response);
};
