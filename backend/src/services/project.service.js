import { Project } from "../models/project.model.js";
import { ProjectAccessRequest } from "../models/project-access-request.model.js";
import { uploadToCloudinary } from "../utils/cloudinary-upload.js";
import cloudinary from "../config/cloudinary.js";
import ApiError from "../utils/api-error.js";
import escapeRegex from "../utils/escape-regex.js";

export const createProjectService = async ({
  projectData,
  files,
  userId,
  collegeId,
}) => {
  const uploadedFiles = [];

  try {
    const screenshots = [];
    let supportingDocument = null;

    // Upload screenshots

    if (files?.screenshots?.length) {
      for (const file of files.screenshots) {
        const uploaded = await uploadToCloudinary(file.buffer, {
          folder: "nexora/projects/screenshots",
          resourceType: "image",
        });

        screenshots.push({
          url: uploaded.url,
          publicId: uploaded.publicId,
        });

        uploadedFiles.push({
          publicId: uploaded.publicId,
          resourceType: "image",
        });
      }
    }

    // Upload supporting documents

    if (files?.supportingDocument?.length) {
      const file = files.supportingDocument[0];

      const uploaded = await uploadToCloudinary(file.buffer, {
        folder: "nexora/projects/documents",
        resourceType: "image", // p - raw
      });

      supportingDocument = {
        name: file.originalname,
        url: uploaded.url,
        publicId: uploaded.publicId,
        access: "public",
      };

      uploadedFiles.push({
        publicId: uploaded.publicId,
        resourceType: "image", // p - raw
      });
    }

    // Create project

    const project = await Project.create({
      ...projectData,

      screenshots,

      supportingDocument,

      createdBy: userId,

      college: collegeId,
    });

    return project;
  } catch (error) {
    // Cleanup Cloudinary files if project creation fails

    for (const file of uploadedFiles) {
      try {
        await cloudinary.uploader.destroy(file.publicId, {
          resource_type: file.resourceType,
        });
      } catch (cleanupError) {
        console.error(
          `Failed to cleanup Cloudinary file ${file.publicId}:`,
          cleanupError,
        );
      }
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, "Failed to create project");
  }
};

export const getProjectsService = async ({
  collegeId,
  search,
  technology,
  domain,
  department,
  academicYear,
  page = 1,
  limit = 10,
}) => {
  const filter = {
    college: collegeId,
  };

  // Search

  if (search) {
    const escapedSearch = escapeRegex(search);
    filter.$or = [
      {
        title: {
          $regex: escapedSearch,
          $options: "i",
        },
      },
      {
        summary: {
          $regex: escapedSearch,
          $options: "i",
        },
      },
      {
        technologies: {
          $regex: escapedSearch,
          $options: "i",
        },
      },
      {
        domain: {
          $regex: escapedSearch,
          $options: "i",
        },
      },
    ];
  }

  // Filters

  if (technology) {
    filter.technologies = {
      $regex: escapeRegex(technology),
      $options: "i",
    };
  }

  if (domain) {
    filter.domain = {
      $regex: escapeRegex(domain),
      $options: "i",
    };
  }

  if (department) {
    filter.department = {
      $regex: escapeRegex(department),
      $options: "i",
    };
  }

  if (academicYear) {
    filter.academicYear = academicYear;
  }

  // Pagination

  const skip = (page - 1) * limit;

  const [projects, totalProjects] = await Promise.all([
    Project.find(filter)
      .select(
        "title summary technologies domain department academicYear teamMembers screenshots github deployedLink supportingDocument createdBy college createdAt updatedAt",
      )
      .populate("createdBy", "fullName username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Project.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalProjects / limit);

  return {
    projects,
    pagination: {
      page,
      limit,
      totalProjects,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

const sanitizeResource = (resource, hasAccess) => {
  if (!resource) {
    return null;
  }

  // Public resources are always accessible
  if (resource.access === "public") {
    return resource;
  }

  // Protected resource + approved access
  if (hasAccess) {
    return resource;
  }

  // Protected resource + no approval
  return {
    ...resource,
    url: null,
  };
};

export const getProjectByIdService = async ({
  projectId,
  collegeId,
  userId,
}) => {
  const project = await Project.findOne({
    _id: projectId,
    college: collegeId,
  })
    .populate("createdBy", "fullName username")
    .lean();

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Project owner has access to all project resources
  const ownerId = project.createdBy?._id?.toString();

  if (ownerId === userId.toString()) {
    return project;
  }

  // Find approved resource-level access requests for this student
  const approvedRequests = await ProjectAccessRequest.find({
    project: projectId,
    requestedBy: userId,
    status: "approved",
  })
    .select("resourceType")
    .lean();

  const approvedResources = new Set(
    approvedRequests.map((request) => request.resourceType),
  );

  // Protect individual resources
  const protectedProject = {
    ...project,

    github: sanitizeResource(project.github, approvedResources.has("github")),

    deployedLink: sanitizeResource(
      project.deployedLink,
      approvedResources.has("deployedLink"),
    ),

    supportingDocument: sanitizeResource(
      project.supportingDocument,
      approvedResources.has("supportingDocument"),
    ),
  };

  return protectedProject;
};

export const updateProjectService = async ({
  projectId,
  projectData,
  files,
  userId,
  collegeId,
}) => {
  const uploadedFiles = [];
  const filesToDelete = [];

  try {
    const project = await Project.findOne({
      _id: projectId,
      createdBy: userId,
      college: collegeId,
    });

    if (!project) {
      throw new ApiError(
        404,
        "Project not found or you do not have permission to update it",
      );
    }

    // Update normal fields

    const allowedFields = [
      "title",
      "summary",
      "description",
      "technologies",
      "domain",
      "department",
      "academicYear",
      "teamMembers",
      "github",
      "deployedLink",
    ];

    for (const field of allowedFields) {
      if (projectData[field] !== undefined) {
        project[field] = projectData[field];
      }
    }

    // Replace screenshots

    if (files?.screenshots?.length) {
      for (const file of project.screenshots) {
        filesToDelete.push({
          publicId: file.publicId,
          resourceType: "image",
        });
      }

      const screenshots = [];

      for (const file of files.screenshots) {
        const uploaded = await uploadToCloudinary(file.buffer, {
          folder: "nexora/projects/screenshots",
          resourceType: "image",
        });

        screenshots.push({
          url: uploaded.url,
          publicId: uploaded.publicId,
        });

        uploadedFiles.push({
          publicId: uploaded.publicId,
          resourceType: "image",
        });
      }

      project.screenshots = screenshots;
    }

    // Replace supporting documents

    if (files?.supportingDocument?.length) {
      if (project.supportingDocument?.publicId) {
        filesToDelete.push({
          publicId: project.supportingDocument.publicId,
          resourceType: "image", // p - raw
        });
      }

      const file = files.supportingDocument[0];

      const uploaded = await uploadToCloudinary(file.buffer, {
        folder: "nexora/projects/documents",
        resourceType: "image", // p- raw
      });

      project.supportingDocument = {
        name: file.originalname,
        url: uploaded.url,
        publicId: uploaded.publicId,
        access: "public",
      };

      uploadedFiles.push({
        publicId: uploaded.publicId,
        resourceType: "image", // p - raw
      });
    }

    // Save project

    await project.save();

    // Delete old Cloudinary files

    for (const file of filesToDelete) {
      try {
        const result = await cloudinary.uploader.destroy(file.publicId, {
          resource_type: file.resourceType,
        });

        console.log(`🗑️ Deleted old Cloudinary file: ${file.publicId}`, result);
      } catch (cleanupError) {
        console.error(
          `Failed to delete old Cloudinary file ${file.publicId}:`,
          cleanupError,
        );
      }
    }

    return project;
  } catch (error) {
    // Cleanup newly uploaded files if update fails

    for (const file of uploadedFiles) {
      try {
        await cloudinary.uploader.destroy(file.publicId, {
          resource_type: file.resourceType,
        });
      } catch (cleanupError) {
        console.error(
          `Failed to cleanup uploaded Cloudinary file ${file.publicId}:`,
          cleanupError,
        );
      }
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, "Failed to update project");
  }
};

export const deleteProjectService = async ({
  projectId,
  userId,
  collegeId,
}) => {
  const project = await Project.findOne({
    _id: projectId,
    createdBy: userId,
    college: collegeId,
  });

  if (!project) {
    throw new ApiError(
      404,
      "Project not found or you do not have permission to delete it",
    );
  }

  // Delete screenshots from Cloudinary

  for (const screenshot of project.screenshots) {
    try {
      const result = await cloudinary.uploader.destroy(screenshot.publicId, {
        resource_type: "image",
      });

      console.log(
        `🗑️ Deleted project screenshot: ${screenshot.publicId}`,
        result,
      );
    } catch (error) {
      console.error(
        `Failed to delete screenshot ${screenshot.publicId}:`,
        error,
      );
    }
  }

  // Delete supporting documents from Cloudinary

  if (project.supportingDocument?.publicId) {
    try {
      const result = await cloudinary.uploader.destroy(
        project.supportingDocument.publicId,
        {
          resource_type: "image", // p - raw
        },
      );

      console.log(
        `🗑️ Deleted project document: ${project.supportingDocument.publicId}`,
        result,
      );
    } catch (error) {
      console.error(
        `Failed to delete document ${project.supportingDocument.publicId}:`,
        error,
      );
    }
  }

  // Delete project from MongoDB

  await Project.deleteOne({
    _id: project._id,
  });

  return project;
};

export const featureProjectService = async ({ projectId, collegeId }) => {
  const project = await Project.findOne({
    _id: projectId,
    college: collegeId,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const currentYear = new Date().getFullYear();
  const nextYear = String(currentYear + 1).slice(-2);
  const currentAcademicYear = `${currentYear}-${nextYear}`;

  if (project.academicYear !== currentAcademicYear) {
    throw new ApiError(
      400,
      "Only projects from the current academic year can be featured",
    );
  }

  if (project.isFeatured) {
    throw new ApiError(409, "Project is already featured");
  }

  project.isFeatured = true;

  await project.save();

  return project;
};

export const unfeatureProjectService = async ({ projectId, collegeId }) => {
  const project = await Project.findOne({
    _id: projectId,
    college: collegeId,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (!project.isFeatured) {
    throw new ApiError(409, "Project is not currently featured");
  }

  project.isFeatured = false;

  await project.save();

  return project;
};

export const getFeaturedProjectsService = async ({ collegeId }) => {
  const currentYear = new Date().getFullYear();
  const nextYear = String(currentYear + 1).slice(-2);
  const currentAcademicYear = `${currentYear}-${nextYear}`;

  const projects = await Project.find({
    college: collegeId,
    academicYear: currentAcademicYear,
    isFeatured: true,
  })
    .populate("createdBy", "fullName username")
    .sort({ updatedAt: -1 })
    .lean();

  return projects;
};
