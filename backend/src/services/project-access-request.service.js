import { Project } from "../models/project.model.js";
import { ProjectAccessRequest } from "../models/project-access-request.model.js";
import ApiError from "../utils/api-error.js";

export const createProjectAccessRequestService = async ({
  projectId,
  requestedBy,
  collegeId,
  resourceType,
}) => {
  // Find project within the student's college
  const project = await Project.findOne({
    _id: projectId,
    college: collegeId,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Student cannot request access to their own project
  if (project.createdBy.toString() === requestedBy.toString()) {
    throw new ApiError(400, "You cannot request access to your own project");
  }

  let resource;

  // Determine requested resource
  switch (resourceType) {
    case "github":
      resource = project.github;
      break;

    case "deployedLink":
      resource = project.deployedLink;
      break;

    case "supportingDocument":
      resource = project.supportingDocument;
      break;

    default:
      throw new ApiError(400, "Invalid resource type");
  }

  // Resource does not exist
  if (!resource?.url) {
    const resourceNames = {
      github: "GitHub link",
      deployedLink: "Deployed link",
      supportingDocument: "Supporting document",
    };

    throw new ApiError(404, `${resourceNames[resourceType]} not found`);
  }

  // Resource must be protected
  if (resource.access !== "protected") {
    throw new ApiError(400, "This resource is publicly accessible");
  }

  // Prevent duplicate active requests
  const existingRequest = await ProjectAccessRequest.findOne({
    project: projectId,
    requestedBy,
    resourceType,
    status: {
      $in: ["pending", "approved"],
    },
  });

  if (existingRequest) {
    if (existingRequest.status === "pending") {
      throw new ApiError(409, "Access request already exists");
    }

    throw new ApiError(409, "Access has already been granted");
  }

  // Create access request
  const accessRequest = await ProjectAccessRequest.create({
    project: projectId,
    requestedBy,
    resourceType,
  });

  return accessRequest;
};

export const getMyProjectAccessRequestsService = async ({
  requestedBy,
  collegeId,
}) => {
  const accessRequests = await ProjectAccessRequest.find({
    requestedBy,
  })
    .populate({
      path: "project",
      select: "title summary domain department academicYear createdBy college",
      match: {
        college: collegeId,
      },
    })
    .sort({ createdAt: -1 })
    .lean();

  // Remove requests whose project does not belong to the user's college
  const filteredRequests = accessRequests.filter(
    (request) => request.project !== null,
  );

  return filteredRequests;
};

export const getProjectAccessRequestsService = async ({
  projectId,
  userId,
  collegeId,
}) => {
  // Verify that the authenticated user owns the project
  const project = await Project.findOne({
    _id: projectId,
    createdBy: userId,
    college: collegeId,
  });

  if (!project) {
    throw new ApiError(
      404,
      "Project not found or you do not have permission to view access requests",
    );
  }

  const accessRequests = await ProjectAccessRequest.find({
    project: projectId,
  })
    .populate("requestedBy", "fullName username email")
    .sort({ createdAt: -1 })
    .lean();

  return accessRequests;
};

export const approveProjectAccessRequestService = async ({
  requestId,
  userId,
  collegeId,
}) => {
  const accessRequest = await ProjectAccessRequest.findById(requestId);

  if (!accessRequest) {
    throw new ApiError(404, "Access request not found");
  }

  // Find the project and verify ownership
  const project = await Project.findOne({
    _id: accessRequest.project,
    createdBy: userId,
    college: collegeId,
  });

  if (!project) {
    throw new ApiError(
      404,
      "Project not found or you do not have permission to approve this request",
    );
  }

  // Request can only be approved while pending
  if (accessRequest.status !== "pending") {
    throw new ApiError(
      409,
      `Access request has already been ${accessRequest.status}`,
    );
  }

  accessRequest.status = "approved";
  accessRequest.respondedAt = new Date();

  await accessRequest.save();

  return accessRequest;
};

export const rejectProjectAccessRequestService = async ({
  requestId,
  userId,
  collegeId,
}) => {
  const accessRequest = await ProjectAccessRequest.findById(requestId);

  if (!accessRequest) {
    throw new ApiError(404, "Access request not found");
  }

  // Verify that the authenticated user owns the project
  const project = await Project.findOne({
    _id: accessRequest.project,
    createdBy: userId,
    college: collegeId,
  });

  if (!project) {
    throw new ApiError(
      404,
      "Project not found or you do not have permission to reject this request",
    );
  }

  // Only pending requests can be rejected
  if (accessRequest.status !== "pending") {
    throw new ApiError(
      409,
      `Access request has already been ${accessRequest.status}`,
    );
  }

  accessRequest.status = "rejected";
  accessRequest.respondedAt = new Date();

  await accessRequest.save();

  return accessRequest;
};

export const cancelProjectAccessRequestService = async ({
  requestId,
  requestedBy,
  collegeId,
}) => {
  const accessRequest = await ProjectAccessRequest.findOne({
    _id: requestId,
    requestedBy,
  }).populate({
    path: "project",
    select: "college",
  });

  if (!accessRequest || !accessRequest.project) {
    throw new ApiError(
      404,
      "Access request not found or you do not have permission to cancel it",
    );
  }

  // Ensure the project belongs to the user's college
  if (accessRequest.project.college.toString() !== collegeId.toString()) {
    throw new ApiError(
      404,
      "Access request not found or you do not have permission to cancel it",
    );
  }

  // Only pending requests can be cancelled
  if (accessRequest.status !== "pending") {
    throw new ApiError(
      409,
      `Cannot cancel an access request that has already been ${accessRequest.status}`,
    );
  }

  await ProjectAccessRequest.deleteOne({
    _id: accessRequest._id,
  });

  return accessRequest;
};
