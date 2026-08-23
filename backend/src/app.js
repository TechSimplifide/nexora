import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import errorHandler from "./middlewares/error.middleware.js";
import { limiter } from "./middlewares/rate-limit.middleware.js";

const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(limiter);
app.use(cookieParser());
app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

import healthCheckRouter from "./routes/healthcheck.routes.js";
import { swaggerDocs } from "./docs/swagger.js";
import collegeRouter from "./routes/college.routes.js";
import authRouter from "./routes/auth.routes.js";
import projectProposalRouter from "./routes/project-proposal.routes.js";
import projectRoutes from "./routes/project.routes.js";
import projectAccessRequestRouter from "./routes/project-access-request.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";
import notificationRoutes from "./routes/notification.routes.js";


app.use("/api/v1/healthcheck", healthCheckRouter);
swaggerDocs(app);
app.use("/api/v1/auth", collegeRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/project-proposals", projectProposalRouter);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/projects", projectAccessRequestRouter);
app.use("/api/v1/recommendations", recommendationRoutes);
app.use("/api/v1/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send(`Welcome to Nexora...`);
});

app.use(errorHandler);

export default app;
