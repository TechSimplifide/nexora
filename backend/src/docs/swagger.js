import fs from "fs";
import path from "path";
import yaml from "yaml";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";

// import { verifyJWT } from "../middlewares/auth.middleware.js";
// import authorizeRoles from "../middlewares/role.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read swagger.yaml
const file = fs.readFileSync(path.join(__dirname, "swagger.yaml"), "utf8");

// Convert YAML → JS Object
const swaggerDocument = yaml.parse(file);

export const swaggerDocs = (app) => {
  app.use(
    "/api/docs",
    // verifyJWT,
    // authorizeRoles("SUPER_ADMIN"),
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      explorer: true,
      customSiteTitle: "Nexora API Docs",
    }),
  );
};
