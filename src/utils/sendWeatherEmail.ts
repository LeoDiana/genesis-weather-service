import nodemailer from "nodemailer";
import { fetchWeather } from "../services/weather.service";
import { config } from "../config";

export async function sendWeatherEmail(to: string, city: string) {
  const weather = await fetchWeather(city);

  const transporter = nodemailer.createTransport({
    host: "in-v3.mailjet.com",
    port: 587,
    secure: false,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
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
