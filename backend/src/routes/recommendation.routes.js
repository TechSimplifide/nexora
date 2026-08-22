import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import { USER_ROLES } from "../constants/roles.js";
import validate from "../middlewares/validate.middleware.js";

import {
  createProjectRecommendation,
  getStudentRecommendations,
  deleteStudentRecommendation,
} from "../controllers/recommendation.controller.js";

import { createRecommendationSchema } from "../validators/recommendation.validator.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  authorizeRoles(USER_ROLES.STUDENT),
  validate(createRecommendationSchema),
  createProjectRecommendation,
);

router.get(
  "/",
  verifyJWT,
  authorizeRoles(USER_ROLES.STUDENT),
  getStudentRecommendations,
);

router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles(USER_ROLES.STUDENT),
  deleteStudentRecommendation,
);

export default router;
