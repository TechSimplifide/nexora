import asyncHandler from "../utils/async-handler.js";
import ApiResponse from "../utils/api-response.js";
import { getProjectResourceService } from "../services/project-resource.service.js";

export const getProjectResource = asyncHandler(async (req, res) => {
  const resource = await getProjectResourceService({
    projectId: req.params.projectId,
    resourceType: req.params.resourceType,
    userId: req.user._id,
    collegeId: req.user.college,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, resource, "Project resource fetched successfully"),
    );
});
