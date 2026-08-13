import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import { USER_ROLES } from "../constants/roles.js";
import { uploadProposalPdf } from "../middlewares/upload.middleware.js";
import { validateRejectProjectProposal } from "../validators/project-proposal-review.validator.js";
import {
  validateCreateProjectProposal,
  validateUpdateProjectProposal,
} from "../validators/project-proposal.validator.js";
import {
  createProjectProposal,
  getMyProjectProposals,
  getPendingProjectProposals,
  approveProjectProposal,
  rejectProjectProposal,
  updateRejectedProjectProposal,
  deleteProjectProposal,
} from "../controllers/project-proposal.controller.js";

const router = Router();

router
  .route("/")
  .post(
    verifyJWT,
    authorizeRoles(USER_ROLES.STUDENT),
    uploadProposalPdf,
    validateCreateProjectProposal,
    createProjectProposal,
  );

router
  .route("/my")
  .get(verifyJWT, authorizeRoles(USER_ROLES.STUDENT), getMyProjectProposals);

router
  .route("/:id")
  .patch(
    verifyJWT,
    authorizeRoles(USER_ROLES.STUDENT),
    uploadProposalPdf,
    validateUpdateProjectProposal,
    updateRejectedProjectProposal,
  );

router
  .route("/:id")
  .delete(verifyJWT, authorizeRoles(USER_ROLES.STUDENT), deleteProjectProposal);

router
  .route("/pending")
  .get(verifyJWT, authorizeRoles(USER_ROLES.ADMIN), getPendingProjectProposals);

router
  .route("/:id/approve")
  .patch(verifyJWT, authorizeRoles(USER_ROLES.ADMIN), approveProjectProposal);

router
  .route("/:id/reject")
  .patch(
    verifyJWT,
    authorizeRoles(USER_ROLES.ADMIN),
    validateRejectProjectProposal,
    rejectProjectProposal,
  );

export default router;
