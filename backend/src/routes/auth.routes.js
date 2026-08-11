import { Router } from "express";

import {
  loginUser,
  registerStudent,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/auth.controller.js";

import validate from "../middlewares/validate.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  loginSchema,
  studentRegisterSchema,
  resendVerificationEmailSchema,
} from "../validators/auth.validator.js";

const router = Router();

router
  .route("/student/register")
  .post(validate(studentRegisterSchema), registerStudent);

router.route("/login").post(validate(loginSchema), loginUser);

router.route("/verify-email/:token").get(verifyEmail);

router
  .route("/resend-verification-email")
  .post(validate(resendVerificationEmailSchema), resendVerificationEmail);

router.route("/me").get(verifyJWT, getCurrentUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

export default router;
