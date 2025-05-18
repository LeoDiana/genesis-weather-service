# 📬 Genesis Weather Service

A Node.js API for subscribing to weather updates via email. Users can subscribe with their city and frequency (hourly or daily), confirm via email, and unsubscribe anytime.  
Weather data is provided by WeatherAPI.com  

Demo:
genesis-weather-service.onrender.com/


## 🚀 Features
•	Subscribe to weather updates via email  
•	Frequency: daily or hourly  
•	Email confirmation system  
•	Unsubscribe via token  
•	Cron-based email scheduler  
•	Swagger API docs available at /api-docs route
•	Dockerized PostgreSQL + app  
•	ESLint + Prettier for code quality  


## ⚙️ Installation
```
git clone git@github.com:LeoDiana/genesis-weather-service.git
cd genesis-weather-service
npm install
```

## 🔧 Environment Variables
Copy .env.example file to .env.local or .env.docker and update values as needed


## 🐳 Run with Docker
`docker compose --env-file .env.docker up --build`

Then access:  
•	📘 Swagger UI: http://localhost:3000/api-docs  
•	🌤 Subscription page: http://localhost:3000/subscribe.html  


## 👩‍💻 Local Development
```
docker compose --env-file .env.docker up db
npm run dev
```
```
npx prisma generate
npx prisma migrate dev --name init
```