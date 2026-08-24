import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import { USER_ROLES } from "../constants/roles.js";

import {
  getAdminDashboardAnalytics,
  getStudentDashboard,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.get(
  "/admin",
  verifyJWT,
  authorizeRoles(USER_ROLES.ADMIN),
  getAdminDashboardAnalytics,
);

router.get(
  "/student",
  verifyJWT,
  authorizeRoles(USER_ROLES.STUDENT),
  getStudentDashboard,
);

export default router;
