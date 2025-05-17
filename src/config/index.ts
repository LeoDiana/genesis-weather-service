import dotenv from "dotenv";

dotenv.config();

export const config = {
  weatherApiKey: process.env.WEATHER_API_KEY || "",
  port: process.env.APP_PORT || 4000,
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  baseUrl: process.env.BASE_URL || "localhost",
  weatherApiBaseUrl:
    process.env.WEATHER_API_BASE_URL || "http://api.weatherapi.com/v1",
  mailSender: process.env.MAIL_SENDER || "no-reply@weather.com",
};
