import asyncHandler from "../utils/async-handler.js";
import ApiResponse from "../utils/api-response.js";
import {
  createProjectRecommendationService,
  getStudentRecommendationsService,
  deleteStudentRecommendationService,
} from "../services/recommendation.service.js";

export const createProjectRecommendation = asyncHandler(async (req, res) => {
  const recommendation = await createProjectRecommendationService({
    studentId: req.user._id,
    collegeId: req.user.college,

    skills: req.body.skills,
    domain: req.body.domain,
    teamSize: req.body.teamSize,
    difficulty: req.body.difficulty,
    projectType: req.body.projectType,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        recommendation,
        "Project recommendation generated successfully",
      ),
    );
});

export const getStudentRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await getStudentRecommendationsService(req.user._id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        recommendations,
        "Project recommendations fetched successfully",
      ),
    );
});

export const deleteStudentRecommendation = asyncHandler(async (req, res) => {
  await deleteStudentRecommendationService({
    recommendationId: req.params.id,
    studentId: req.user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, null, "Project recommendation deleted successfully"),
    );
});
