import fs from "fs";
import path from "path";
import yaml from "yaml";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read swagger.yaml
const file = fs.readFileSync(path.join(__dirname, "swagger.yaml"), "utf8");

// Convert YAML → JS Object
const swaggerDocument = yaml.parse(file);

export const swaggerDocs = (app) => {
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      explorer: true,
      customSiteTitle: "Nexora API Docs",
    }),
  );
};
