import asyncHandler from "../utils/async-handler.js";
import ApiResponse from "../utils/api-response.js";
import { analyzeProposalWithAIService } from "../services/ai-proposal-review.service.js";

export const analyzeProposalWithAI = asyncHandler(async (req, res) => {
  const review = await analyzeProposalWithAIService({
    proposalId: req.params.id,
    collegeId: req.user.college,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, review, "Project proposal analyzed successfully"),
    );
});
