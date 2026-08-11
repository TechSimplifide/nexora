import asyncHandler from "../utils/async-handler.js";
import ApiResponse from "../utils/api-response.js";

import { registerCollegeService } from "../services/college.service.js";

export const registerCollege = asyncHandler(async (req, res) => {
  const result = await registerCollegeService(req.body);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        collegeCode: result.college.collegeCode,
        admin: result.admin,
      },
      "College registered successfully",
    ),
  );
});
