import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import { USER_ROLES } from "../constants/roles.js";
import { analyzeProposalWithAI } from "../controllers/ai-proposal-review.controller.js";

const router = Router();

router
  .route("/:id/analyze")
  .post(verifyJWT, authorizeRoles(USER_ROLES.ADMIN), analyzeProposalWithAI);

export default router;
