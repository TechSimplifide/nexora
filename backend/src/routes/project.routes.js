import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import { uploadProjectFiles } from "../middlewares/upload.middleware.js";
import { USER_ROLES } from "../constants/roles.js";
import { getProjectResource } from "../controllers/project-resource.controller.js";
import {
  createProject,
  getProjectById,
  getProjects,
  updateProject,
  deleteProject,
  featureProject,
  unfeatureProject,
  getFeaturedProjects,
} from "../controllers/project.controller.js";

const router = Router();

router
  .route("/")
  .post(
    verifyJWT,
    authorizeRoles(USER_ROLES.STUDENT),
    uploadProjectFiles,
    createProject,
  );

router
  .route("/")
  .get(
    verifyJWT,
    authorizeRoles(USER_ROLES.STUDENT, USER_ROLES.ADMIN),
    getProjects,
  );

router
  .route("/featured")
  .get(
    verifyJWT,
    authorizeRoles(USER_ROLES.STUDENT, USER_ROLES.ADMIN),
    getFeaturedProjects,
  );

router
  .route("/:projectId/resources/:resourceType")
  .get(
    verifyJWT,
    authorizeRoles(USER_ROLES.STUDENT, USER_ROLES.ADMIN),
    getProjectResource,
  );

router
  .route("/:id")
  .get(
    verifyJWT,
    authorizeRoles(USER_ROLES.STUDENT, USER_ROLES.ADMIN),
    getProjectById,
  );

router
  .route("/:id")
  .patch(
    verifyJWT,
    authorizeRoles(USER_ROLES.STUDENT),
    uploadProjectFiles,
    updateProject,
  );

router
  .route("/:id")
  .delete(verifyJWT, authorizeRoles(USER_ROLES.STUDENT), deleteProject);

router
  .route("/:projectId/feature")
  .patch(verifyJWT, authorizeRoles(USER_ROLES.ADMIN), featureProject);

router
  .route("/:projectId/unfeature")
  .patch(verifyJWT, authorizeRoles(USER_ROLES.ADMIN), unfeatureProject);

export default router;
