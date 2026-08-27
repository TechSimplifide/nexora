import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/async-handler.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validators/project.validator.js";
import {
  createProjectService,
  getProjectsService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService,
  featureProjectService,
  unfeatureProjectService,
  getFeaturedProjectsService,
} from "../services/project.service.js";

export const createProject = asyncHandler(async (req, res) => {
  // Parse multipart form data
  let projectData = {
    ...req.body,
  };

  // Convert JSON fields from multipart/form-data
  if (typeof projectData.technologies === "string") {
    try {
      projectData.technologies = JSON.parse(projectData.technologies);
    } catch {
      throw new ApiError(400, "Invalid technologies format");
    }
  }

  if (typeof projectData.teamMembers === "string") {
    try {
      projectData.teamMembers = JSON.parse(projectData.teamMembers);
    } catch {
      throw new ApiError(400, "Invalid team members format");
    }
  }

  if (typeof projectData.github === "string") {
    try {
      projectData.github = JSON.parse(projectData.github);
    } catch {
      throw new ApiError(400, "Invalid GitHub configuration format");
    }
  }

  if (typeof projectData.deployedLink === "string") {
    try {
      projectData.deployedLink = JSON.parse(projectData.deployedLink);
    } catch {
      throw new ApiError(400, "Invalid deployed link configuration format");
    }
  }

  // Validate request

  const validationResult = createProjectSchema.safeParse(projectData);

  if (!validationResult.success) {
    throw new ApiError(
      400,
      validationResult.error.issues[0]?.message || "Invalid project data",
    );
  }

  // Get authenticated user

  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  // Get college

  const collegeId = req.user?.college;

  if (!collegeId) {
    throw new ApiError(400, "User is not associated with a college");
  }

  // Create project

  const project = await createProjectService({
    projectData: validationResult.data,
    files: req.files,
    userId,
    collegeId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project created successfully"));
});

export const getProjects = asyncHandler(async (req, res) => {
  const collegeId = req.user?.college;

  if (!collegeId) {
    throw new ApiError(400, "User is not associated with a college");
  }

  const { search, technology, domain, department, academicYear } = req.query;

  const page = Number.parseInt(req.query.page, 10) || 1;
  const limit = Number.parseInt(req.query.limit, 10) || 10;

  if (page < 1) {
    throw new ApiError(400, "Page must be greater than 0");
  }

  if (limit < 1 || limit > 50) {
    throw new ApiError(400, "Limit must be between 1 and 50");
  }

  const result = await getProjectsService({
    collegeId,
    search,
    technology,
    domain,
    department,
    academicYear,
    page,
    limit,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Projects fetched successfully"));
});

export const getProjectById = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;

  const collegeId = req.user?.college;

  if (!collegeId) {
    throw new ApiError(400, "User is not associated with a college");
  }

  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  const project = await getProjectByIdService({
    projectId,
    collegeId,
    userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project fetched successfully"));
});

export const updateProject = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;

  let projectData = {
    ...req.body,
  };

  // Convert JSON fields from multipart/form-data

  if (typeof projectData.technologies === "string") {
    try {
      projectData.technologies = JSON.parse(projectData.technologies);
    } catch {
      throw new ApiError(400, "Invalid technologies format");
    }
  }

  if (typeof projectData.teamMembers === "string") {
    try {
      projectData.teamMembers = JSON.parse(projectData.teamMembers);
    } catch {
      throw new ApiError(400, "Invalid team members format");
    }
  }

  if (typeof projectData.github === "string") {
    try {
      projectData.github = JSON.parse(projectData.github);
    } catch {
      throw new ApiError(400, "Invalid GitHub configuration format");
    }
  }

  if (typeof projectData.deployedLink === "string") {
    try {
      projectData.deployedLink = JSON.parse(projectData.deployedLink);
    } catch {
      throw new ApiError(400, "Invalid deployed link configuration format");
    }
  }

  // Validate request

  const validationResult = updateProjectSchema.safeParse(projectData);

  if (!validationResult.success) {
    throw new ApiError(
      400,
      validationResult.error.issues[0]?.message || "Invalid project data",
    );
  }

  // Authentication

  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  const collegeId = req.user?.college;

  if (!collegeId) {
    throw new ApiError(400, "User is not associated with a college");
  }

  // Update project

  const project = await updateProjectService({
    projectId,
    projectData: validationResult.data,
    files: req.files,
    userId,
    collegeId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project updated successfully"));
});

export const deleteProject = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;

  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  const collegeId = req.user?.college;

  if (!collegeId) {
    throw new ApiError(400, "User is not associated with a college");
  }

  await deleteProjectService({
    projectId,
    userId,
    collegeId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Project deleted successfully"));
});

export const featureProject = asyncHandler(async (req, res) => {
  const project = await featureProjectService({
    projectId: req.params.projectId,
    collegeId: req.user.college,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project featured successfully"));
});

export const unfeatureProject = asyncHandler(async (req, res) => {
  const project = await unfeatureProjectService({
    projectId: req.params.projectId,
    collegeId: req.user.college,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project unfeatured successfully"));
});

export const getFeaturedProjects = asyncHandler(async (req, res) => {
  const projects = await getFeaturedProjectsService({
    collegeId: req.user.college,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, projects, "Featured projects fetched successfully"),
    );
});
