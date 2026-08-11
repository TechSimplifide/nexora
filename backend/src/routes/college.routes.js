import { Router } from "express";

import { registerCollege } from "../controllers/college.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { collegeRegisterSchema } from "../validators/college.validator.js";

const router = Router();

router
  .route("/college/register")
  .post(validate(collegeRegisterSchema), registerCollege);

export default router;
