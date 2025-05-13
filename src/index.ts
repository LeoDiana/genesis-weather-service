import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const app = express();
const port = process.env.PORT || 4000;

const swaggerDocument = YAML.load(path.join(__dirname, "../swagger.yaml"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (_req, res) => {
    res.send("Check /api-docs");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});