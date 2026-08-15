import asyncHandler from "../utils/async-handler.js";
import ApiResponse from "../utils/api-response.js";
import {
  createProjectAccessRequestService,
  getMyProjectAccessRequestsService,
  getProjectAccessRequestsService,
  approveProjectAccessRequestService,
  rejectProjectAccessRequestService,
  cancelProjectAccessRequestService,
} from "../services/project-access-request.service.js";

export const createProjectAccessRequest = asyncHandler(async (req, res) => {
  const accessRequest = await createProjectAccessRequestService({
    projectId: req.params.projectId,
    requestedBy: req.user._id,
    collegeId: req.user.college,
    resourceType: req.body.resourceType,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        accessRequest,
        "Project access request created successfully",
      ),
    );
});

export const getMyProjectAccessRequests = asyncHandler(async (req, res) => {
  const accessRequests = await getMyProjectAccessRequestsService({
    requestedBy: req.user._id,
    collegeId: req.user.college,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        accessRequests,
        "Your project access requests fetched successfully",
      ),
    );
});

export const getProjectAccessRequests = asyncHandler(async (req, res) => {
  const accessRequests = await getProjectAccessRequestsService({
    projectId: req.params.projectId,
    userId: req.user._id,
    collegeId: req.user.college,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        accessRequests,
        "Project access requests fetched successfully",
      ),
    );
});

export const approveProjectAccessRequest = asyncHandler(async (req, res) => {
  const accessRequest = await approveProjectAccessRequestService({
    requestId: req.params.requestId,
    userId: req.user._id,
    collegeId: req.user.college,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        accessRequest,
        "Project access request approved successfully",
      ),
    );
});

export const rejectProjectAccessRequest = asyncHandler(async (req, res) => {
  const accessRequest = await rejectProjectAccessRequestService({
    requestId: req.params.requestId,
    userId: req.user._id,
    collegeId: req.user.college,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        accessRequest,
        "Project access request rejected successfully",
      ),
    );
});

export const cancelProjectAccessRequest = asyncHandler(async (req, res) => {
  await cancelProjectAccessRequestService({
    requestId: req.params.requestId,
    requestedBy: req.user._id,
    collegeId: req.user.college,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Project access request cancelled successfully",
      ),
    );
});
