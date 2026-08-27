import { Project } from "../models/project.model.js";
import { ProjectAccessRequest } from "../models/project-access-request.model.js";
import ApiError from "../utils/api-error.js";

const RESOURCE_TYPES = ["github", "deployedLink", "supportingDocument"];

const getResource = (project, resourceType) => {
  switch (resourceType) {
    case "github":
      return project.github;

    case "deployedLink":
      return project.deployedLink;

    case "supportingDocument":
      return project.supportingDocument;

    default:
      throw new ApiError(400, "Invalid resource type");
  }
};

export const getProjectResourceService = async ({
  projectId,
  resourceType,
  userId,
  collegeId,
}) => {
  if (!RESOURCE_TYPES.includes(resourceType)) {
    throw new ApiError(400, "Invalid resource type");
  }

  const project = await Project.findOne({
    _id: projectId,
    college: collegeId,
  }).lean();

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const resource = getResource(project, resourceType);

  if (!resource?.url) {
    throw new ApiError(404, "Resource not found");
  }

  // Project owner automatically has access
  const isOwner = project.createdBy.toString() === userId.toString();

  if (isOwner) {
    return {
      resourceType,
      url: resource.url,
      accessStatus: "owner",
    };
  }

  // Public resource
  if (resource.access === "public") {
    return {
      resourceType,
      url: resource.url,
      accessStatus: "public",
    };
  }

  // Protected resource
  if (resource.access !== "protected") {
    throw new ApiError(403, "Access denied");
  }

  const accessRequest = await ProjectAccessRequest.findOne({
    project: projectId,
    requestedBy: userId,
    resourceType,
    status: "approved",
  }).lean();

  if (!accessRequest) {
    throw new ApiError(
      403,
      "You do not have access to this protected resource",
    );
  }

  return {
    resourceType,
    url: resource.url,
    accessStatus: "approved",
  };
};
