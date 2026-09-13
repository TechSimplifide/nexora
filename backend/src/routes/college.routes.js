import { Router } from "express";

import { registerCollege } from "../controllers/college.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { collegeRegisterSchema } from "../validators/college.validator.js";
import { authLimiter } from "../middlewares/rate-limit.middleware.js";

const router = Router();

router
  .route("/college/register")
  .post(authLimiter, validate(collegeRegisterSchema), registerCollege);

export default router;
