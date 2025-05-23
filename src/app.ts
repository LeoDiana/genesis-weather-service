// app.ts
import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import weatherRoutes from "./routes/weather.routes";
import subscriptionRoutes from "./routes/subscription.routes";
import { startEmailScheduler } from "./scheduler/emailScheduler";

const app = express();

startEmailScheduler();

const swaggerDocument = YAML.load(path.join(__dirname, "../swagger.yaml"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", weatherRoutes);
app.use("/api", subscriptionRoutes);

app.get("/", (_req, res) => {
  res.send(
    "Check <a href='/api-docs'>/api-docs</a> or <a href='/subscribe.html'>/subscribe.html</a>",
  );
});

export default app;
