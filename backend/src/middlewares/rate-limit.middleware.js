import rateLimit from "express-rate-limit";

const createLimiter = ({ windowMs, limit, message }) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skip: (req) => req.method === "OPTIONS",
    message: {
      success: false,
      message,
    },
  });

// General API protection
export const limiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  message: "Too many requests. Please try again later.",
});

// Authentication protection
export const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: "Too many authentication requests. Please try again later.",
});

// Email verification protection
export const verificationLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: "Too many verification requests. Please try again later.",
});

// AI proposal review protection
export const aiReviewLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: "Too many AI review requests. Please try again later.",
});

// AI recommendation protection
export const aiRecommendationLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: "Too many AI recommendation requests. Please try again later.",
});
