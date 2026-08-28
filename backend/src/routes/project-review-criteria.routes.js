import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import { USER_ROLES } from "../constants/roles.js";
import { validateUpdateProjectReviewCriteria } from "../validators/project-review-criteria.validator.js";
import {
  getProjectReviewCriteria,
  updateProjectReviewCriteria,
} from "../controllers/project-review-criteria.controller.js";

const router = Router();

router
  .route("/")
  .get(verifyJWT, authorizeRoles(USER_ROLES.ADMIN), getProjectReviewCriteria)
  .put(
    verifyJWT,
    authorizeRoles(USER_ROLES.ADMIN),
    validateUpdateProjectReviewCriteria,
    updateProjectReviewCriteria,
  );

export default router;
