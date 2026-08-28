import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import errorHandler from "./middlewares/error.middleware.js";
import {
  limiter,
  aiReviewLimiter,
  aiRecommendationLimiter,
} from "./middlewares/rate-limit.middleware.js";

import healthCheckRouter from "./routes/healthcheck.routes.js";
import { swaggerDocs } from "./docs/swagger.js";
import collegeRouter from "./routes/college.routes.js";
import authRouter from "./routes/auth.routes.js";
import projectProposalRouter from "./routes/project-proposal.routes.js";
import projectRoutes from "./routes/project.routes.js";
import projectAccessRequestRouter from "./routes/project-access-request.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";
import projectReviewCriteriaRoutes from "./routes/project-review-criteria.routes.js";
import aiProposalReviewRoutes from "./routes/ai-proposal-review.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

// Proxy Configuration

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Security

app.use(helmet());

// CORS

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Request Parsing

app.use(express.json({ limit: "16kb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  }),
);

app.use(cookieParser());

// Health Check
app.use("/api/v1/healthcheck", healthCheckRouter);

// Rate Limiting
app.use(limiter);

// API Routes

swaggerDocs(app);

app.use("/api/v1/auth", collegeRouter);
app.use("/api/v1/auth", authRouter);

app.use("/api/v1/project-proposals", projectProposalRouter);

app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/projects", projectAccessRequestRouter);

app.use("/api/v1/project-review-criteria", projectReviewCriteriaRoutes);

app.use("/api/v1/ai-proposal-review/", aiReviewLimiter, aiProposalReviewRoutes);

app.use(
  "/api/v1/recommendations",
  aiRecommendationLimiter,
  recommendationRoutes,
);

app.use("/api/v1/notifications", notificationRoutes);

app.use("/api/v1/dashboard", dashboardRoutes);

// Root Route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to Nexora...");
});

// Error Handler
app.use(errorHandler);

export default app;
