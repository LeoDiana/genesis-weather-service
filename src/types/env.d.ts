declare namespace NodeJS {
  interface ProcessEnv {
    WEATHER_API_KEY: string;
    APP_PORT: string;
    SMTP_USER: string;
    SMTP_PASS: string;
    BASE_URL: string;
  }
}
