import { Recommendation } from "../models/recommendation.model.js";
import ApiError from "../utils/api-error.js";
import { recommendationResponseSchema } from "../validators/recommendation-response.validator.js";
import { geminiModel } from "../config/gemini.js";
import recommendationSystemPrompt from "../prompts/recommendation.system-prompt.js";

const buildRecommendationPrompt = ({
  skills,
  domain,
  teamSize,
  difficulty,
  projectType,
}) => `
${recommendationSystemPrompt}

STUDENT INFORMATION

Skills:
${skills.join(", ")}

Domain:
${domain}

Team Size:
${teamSize}

Difficulty:
${difficulty}

Project Type:
${projectType}
`;

export const createProjectRecommendationService = async ({
  studentId,
  collegeId,
  skills,
  domain,
  teamSize,
  difficulty,
  projectType,
}) => {
  const prompt = buildRecommendationPrompt({
    skills,
    domain,
    teamSize,
    difficulty,
    projectType,
  });

  let result;

  try {
    result = await geminiModel.generateContent(prompt);
  } catch (error) {
    console.error("Gemini recommendation error:", error);

    throw new ApiError(
      503,
      "Project recommendation service is currently unavailable",
    );
  }

  const responseText = result.response.text().trim();

  let recommendationData;

  try {
    recommendationData = JSON.parse(responseText);
  } catch {
    console.error("Invalid Gemini JSON response:", responseText);

    throw new ApiError(
      502,
      "Invalid response received from recommendation service",
    );
  }

  const validationResult =
    recommendationResponseSchema.safeParse(recommendationData);

  if (!validationResult.success) {
    console.error(
      "Invalid Gemini recommendation structure:",
      validationResult.error,
    );

    throw new ApiError(
      502,
      "Recommendation service returned an invalid response",
    );
  }

  const recommendation = await Recommendation.create({
    student: studentId,
    college: collegeId,

    skills,
    domain,
    teamSize,
    difficulty,
    projectType,

    ...validationResult.data,
  });

  return recommendation;
};

export const getStudentRecommendationsService = async (studentId) => {
  const recommendations = await Recommendation.find({
    student: studentId,
  }).sort({ createdAt: -1 });

  return recommendations;
};

export const deleteStudentRecommendationService = async ({
  recommendationId,
  studentId,
}) => {
  const recommendation = await Recommendation.findOneAndDelete({
    _id: recommendationId,
    student: studentId,
  });

  if (!recommendation) {
    throw new ApiError(404, "Recommendation not found");
  }

  return recommendation;
};
