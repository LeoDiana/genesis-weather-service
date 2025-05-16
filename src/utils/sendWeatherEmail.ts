import nodemailer from "nodemailer";
import { fetchWeather } from "../services/weather.service"; // you already have this

export async function sendWeatherEmail(to: string, city: string) {
    const weather = await fetchWeather(city);

    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    const info = await transporter.sendMail({
        from: '"Weather Bot" <no-reply@weather.com>',
        to,
        subject: `🌤 Weather in ${city}`,
        text: `Current temperature in ${city}: ${weather.temperature}°C, ${weather.description}`,
        html: `<p><strong>${city}</strong>: ${weather.temperature}°C, ${weather.description}</p>`,
    });

    console.log("Preview:", nodemailer.getTestMessageUrl(info));
}