import asyncHandler from "../utils/async-handler.js";
import ApiResponse from "../utils/api-response.js";
import {
  getProjectReviewCriteriaService,
  updateProjectReviewCriteriaService,
} from "../services/project-review-criteria.service.js";

export const getProjectReviewCriteria = asyncHandler(async (req, res) => {
  const criteria = await getProjectReviewCriteriaService(req.user.college);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        criteria,
        "Project review criteria fetched successfully",
      ),
    );
});

export const updateProjectReviewCriteria = asyncHandler(async (req, res) => {
  const criteria = await updateProjectReviewCriteriaService({
    collegeId: req.user.college,
    standardCriteria: req.body.standardCriteria,
    customCriteria: req.body.customCriteria,
    autoReview: req.body.autoReview,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        criteria,
        "Project review criteria updated successfully",
      ),
    );
});
