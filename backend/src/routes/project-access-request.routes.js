import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { USER_ROLES } from "../constants/roles.js";

import {
  createProjectAccessRequest,
  getMyProjectAccessRequests,
  getProjectAccessRequests,
  approveProjectAccessRequest,
  rejectProjectAccessRequest,
  cancelProjectAccessRequest,
} from "../controllers/project-access-request.controller.js";

import { createProjectAccessRequestSchema } from "../validators/project-access-request.validator.js";

const router = Router();

router
  .route("/access-requests/my")
  .get(
    verifyJWT,
    authorizeRoles(USER_ROLES.STUDENT),
    getMyProjectAccessRequests,
  );

router
  .route("/:projectId/access-requests")
  .post(
    verifyJWT,
    authorizeRoles(USER_ROLES.STUDENT),
    validate(createProjectAccessRequestSchema),
    createProjectAccessRequest,
  );

router
  .route("/:projectId/access-requests")
  .get(verifyJWT, authorizeRoles(USER_ROLES.STUDENT), getProjectAccessRequests);

router
  .route("/access-requests/:requestId/approve")
  .patch(
    verifyJWT,
    authorizeRoles(USER_ROLES.STUDENT),
    approveProjectAccessRequest,
  );

router
  .route("/access-requests/:requestId/reject")
  .patch(
    verifyJWT,
    authorizeRoles(USER_ROLES.STUDENT),
    rejectProjectAccessRequest,
  );

router
  .route("/access-requests/:requestId")
  .delete(
    verifyJWT,
    authorizeRoles(USER_ROLES.STUDENT),
    cancelProjectAccessRequest,
  );

export default router;
