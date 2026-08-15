import { jest } from "@jest/globals";

const mockProjectCreate = jest.fn();
const mockProjectFind = jest.fn();
const mockProjectFindOne = jest.fn();
const mockProjectCountDocuments = jest.fn();
const mockProjectDeleteOne = jest.fn();

const mockUploadToCloudinary = jest.fn();
const mockCloudinaryDestroy = jest.fn();

jest.unstable_mockModule("../../../src/models/project.model.js", () => ({
  Project: {
    create: mockProjectCreate,
    find: mockProjectFind,
    findOne: mockProjectFindOne,
    countDocuments: mockProjectCountDocuments,
    deleteOne: mockProjectDeleteOne,
  },
}));

jest.unstable_mockModule("../../../src/utils/cloudinary-upload.js", () => ({
  uploadToCloudinary: mockUploadToCloudinary,
}));

jest.unstable_mockModule("../../../src/config/cloudinary.js", () => ({
  default: {
    uploader: {
      destroy: mockCloudinaryDestroy,
    },
  },
}));

const {
  createProjectService,
  getProjectsService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService,
} = await import("../../../src/services/project.service.js");

describe("Project Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================================================
  // createProjectService
  // ==================================================

  describe("createProjectService", () => {
    const projectData = {
      title: "Hospital Management System",
      summary: "A hospital management system",
      description:
        "A complete hospital management system for managing patients and hospital operations.",
      technologies: ["React", "Node.js", "MongoDB"],
      domain: "WEB",
      department: "IT",
      academicYear: "2026-27",
      teamMembers: [
        {
          name: "Raja",
          role: "Backend Developer",
        },
      ],
    };

    test("should create a project successfully without files", async () => {
      const createdProject = {
        _id: "project123",
        ...projectData,
        screenshots: [],
        supportingDocuments: [],
        createdBy: "user123",
        college: "college123",
      };

      mockProjectCreate.mockResolvedValue(createdProject);

      const result = await createProjectService({
        projectData,
        files: {},
        userId: "user123",
        collegeId: "college123",
      });

      expect(mockProjectCreate).toHaveBeenCalledWith({
        ...projectData,
        screenshots: [],
        supportingDocuments: [],
        createdBy: "user123",
        college: "college123",
      });

      expect(result).toEqual(createdProject);
    });

    test("should upload screenshots and supporting documents", async () => {
      mockUploadToCloudinary
        .mockResolvedValueOnce({
          url: "https://cloudinary.com/screenshot.png",
          publicId: "screenshots/project123",
        })
        .mockResolvedValueOnce({
          url: "https://cloudinary.com/document.pdf",
          publicId: "documents/project123",
        });

      const createdProject = {
        _id: "project123",
        ...projectData,
      };

      mockProjectCreate.mockResolvedValue(createdProject);

      const files = {
        screenshots: [
          {
            buffer: Buffer.from("image"),
            originalname: "screenshot.png",
          },
        ],
        supportingDocuments: [
          {
            buffer: Buffer.from("pdf"),
            originalname: "report.pdf",
          },
        ],
      };

      const result = await createProjectService({
        projectData,
        files,
        userId: "user123",
        collegeId: "college123",
      });

      expect(mockUploadToCloudinary).toHaveBeenCalledTimes(2);

      expect(mockUploadToCloudinary).toHaveBeenNthCalledWith(
        1,
        files.screenshots[0].buffer,
        {
          folder: "nexora/projects/screenshots",
          resourceType: "image",
        },
      );

      expect(mockUploadToCloudinary).toHaveBeenNthCalledWith(
        2,
        files.supportingDocuments[0].buffer,
        {
          folder: "nexora/projects/documents",
          resourceType: "raw",
        },
      );

      expect(mockProjectCreate).toHaveBeenCalledWith({
        ...projectData,
        screenshots: [
          {
            url: "https://cloudinary.com/screenshot.png",
            publicId: "screenshots/project123",
          },
        ],
        supportingDocuments: [
          {
            name: "report.pdf",
            url: "https://cloudinary.com/document.pdf",
            publicId: "documents/project123",
            access: "public",
          },
        ],
        createdBy: "user123",
        college: "college123",
      });

      expect(result).toEqual(createdProject);
    });

    test("should cleanup uploaded files if project creation fails", async () => {
      mockUploadToCloudinary.mockResolvedValue({
        url: "https://cloudinary.com/screenshot.png",
        publicId: "screenshots/project123",
      });

      mockProjectCreate.mockRejectedValue(new Error("Database error"));

      const files = {
        screenshots: [
          {
            buffer: Buffer.from("image"),
            originalname: "screenshot.png",
          },
        ],
      };

      await expect(
        createProjectService({
          projectData,
          files,
          userId: "user123",
          collegeId: "college123",
        }),
      ).rejects.toMatchObject({
        statusCode: 500,
        message: "Failed to create project",
      });

      expect(mockCloudinaryDestroy).toHaveBeenCalledWith(
        "screenshots/project123",
        {
          resource_type: "image",
        },
      );
    });
  });

  // ==================================================
  // getProjectsService
  // ==================================================

  describe("getProjectsService", () => {
    test("should return projects with pagination", async () => {
      const projects = [
        {
          _id: "project1",
          title: "Project One",
        },
        {
          _id: "project2",
          title: "Project Two",
        },
      ];

      const mockLean = jest.fn().mockResolvedValue(projects);
      const mockLimit = jest.fn().mockReturnValue({
        lean: mockLean,
      });
      const mockSkip = jest.fn().mockReturnValue({
        limit: mockLimit,
      });
      const mockSort = jest.fn().mockReturnValue({
        skip: mockSkip,
      });
      const mockPopulate = jest.fn().mockReturnValue({
        sort: mockSort,
      });
      const mockSelect = jest.fn().mockReturnValue({
        populate: mockPopulate,
      });

      mockProjectFind.mockReturnValue({
        select: mockSelect,
      });

      mockProjectCountDocuments.mockResolvedValue(25);

      const result = await getProjectsService({
        collegeId: "college123",
        page: 2,
        limit: 10,
      });

      expect(mockProjectFind).toHaveBeenCalledWith({
        college: "college123",
      });

      expect(mockProjectCountDocuments).toHaveBeenCalledWith({
        college: "college123",
      });

      expect(mockSkip).toHaveBeenCalledWith(10);
      expect(mockLimit).toHaveBeenCalledWith(10);

      expect(result).toEqual({
        projects,
        pagination: {
          page: 2,
          limit: 10,
          totalProjects: 25,
          totalPages: 3,
          hasNextPage: true,
          hasPreviousPage: true,
        },
      });
    });

    test("should apply search and filters", async () => {
      const mockLean = jest.fn().mockResolvedValue([]);
      const mockLimit = jest.fn().mockReturnValue({
        lean: mockLean,
      });
      const mockSkip = jest.fn().mockReturnValue({
        limit: mockLimit,
      });
      const mockSort = jest.fn().mockReturnValue({
        skip: mockSkip,
      });
      const mockPopulate = jest.fn().mockReturnValue({
        sort: mockSort,
      });
      const mockSelect = jest.fn().mockReturnValue({
        populate: mockPopulate,
      });

      mockProjectFind.mockReturnValue({
        select: mockSelect,
      });

      mockProjectCountDocuments.mockResolvedValue(0);

      await getProjectsService({
        collegeId: "college123",
        search: "React",
        technology: "React",
        domain: "WEB",
        department: "IT",
        academicYear: "2026-27",
      });

      const expectedFilter = {
        college: "college123",
        $or: [
          {
            title: {
              $regex: "React",
              $options: "i",
            },
          },
          {
            summary: {
              $regex: "React",
              $options: "i",
            },
          },
          {
            technologies: {
              $regex: "React",
              $options: "i",
            },
          },
          {
            domain: {
              $regex: "React",
              $options: "i",
            },
          },
        ],
        technologies: {
          $regex: "React",
          $options: "i",
        },
        domain: {
          $regex: "WEB",
          $options: "i",
        },
        department: {
          $regex: "IT",
          $options: "i",
        },
        academicYear: "2026-27",
      };

      expect(mockProjectFind).toHaveBeenCalledWith(expectedFilter);
      expect(mockProjectCountDocuments).toHaveBeenCalledWith(expectedFilter);
    });
  });

  // ==================================================
  // getProjectByIdService
  // ==================================================

  describe("getProjectByIdService", () => {
    test("should return a project by ID", async () => {
      const project = {
        _id: "project123",
        title: "Hospital Management System",
      };

      const mockLean = jest.fn().mockResolvedValue(project);

      const mockPopulate = jest.fn().mockReturnValue({
        lean: mockLean,
      });

      mockProjectFindOne.mockReturnValue({
        populate: mockPopulate,
      });

      const result = await getProjectByIdService({
        projectId: "project123",
        collegeId: "college123",
      });

      expect(mockProjectFindOne).toHaveBeenCalledWith({
        _id: "project123",
        college: "college123",
      });

      expect(result).toEqual(project);
    });

    test("should throw 404 when project does not exist", async () => {
      const mockLean = jest.fn().mockResolvedValue(null);

      const mockPopulate = jest.fn().mockReturnValue({
        lean: mockLean,
      });

      mockProjectFindOne.mockReturnValue({
        populate: mockPopulate,
      });

      await expect(
        getProjectByIdService({
          projectId: "invalid-project",
          collegeId: "college123",
        }),
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Project not found",
      });
    });
  });

  // ==================================================
  // updateProjectService
  // ==================================================

  describe("updateProjectService", () => {
    const existingProject = {
      _id: "project123",
      title: "Old Project",
      summary: "Old summary",
      description: "Old description",
      technologies: ["React"],
      domain: "WEB",
      department: "IT",
      academicYear: "2026-27",
      teamMembers: [],
      github: {
        url: "https://github.com/old/project",
        access: "public",
      },
      deployedLink: {
        url: "https://old.vercel.app",
        access: "public",
      },
      screenshots: [
        {
          url: "https://cloudinary.com/old.png",
          publicId: "screenshots/old",
        },
      ],
      supportingDocuments: [
        {
          name: "old.pdf",
          url: "https://cloudinary.com/old.pdf",
          publicId: "documents/old",
          access: "public",
        },
      ],
      save: jest.fn(),
    };

    test("should update normal project fields", async () => {
      const project = {
        ...existingProject,
        save: jest.fn().mockResolvedValue(true),
      };

      mockProjectFindOne.mockResolvedValue(project);

      const result = await updateProjectService({
        projectId: "project123",
        projectData: {
          title: "Updated Project",
          domain: "AI",
        },
        files: {},
        userId: "user123",
        collegeId: "college123",
      });

      expect(project.title).toBe("Updated Project");
      expect(project.domain).toBe("AI");
      expect(project.save).toHaveBeenCalled();

      expect(result).toBe(project);
    });

    test("should replace screenshots and supporting documents", async () => {
      const project = {
        ...existingProject,
        screenshots: [
          {
            url: "https://cloudinary.com/old.png",
            publicId: "screenshots/old",
          },
        ],
        supportingDocuments: [
          {
            name: "old.pdf",
            url: "https://cloudinary.com/old.pdf",
            publicId: "documents/old",
            access: "public",
          },
        ],
        save: jest.fn().mockResolvedValue(true),
      };

      mockProjectFindOne.mockResolvedValue(project);

      mockUploadToCloudinary
        .mockResolvedValueOnce({
          url: "https://cloudinary.com/new.png",
          publicId: "screenshots/new",
        })
        .mockResolvedValueOnce({
          url: "https://cloudinary.com/new.pdf",
          publicId: "documents/new",
        });

      mockCloudinaryDestroy.mockResolvedValue({
        result: "ok",
      });

      const files = {
        screenshots: [
          {
            buffer: Buffer.from("new-image"),
            originalname: "new.png",
          },
        ],
        supportingDocuments: [
          {
            buffer: Buffer.from("new-pdf"),
            originalname: "new.pdf",
          },
        ],
      };

      const result = await updateProjectService({
        projectId: "project123",
        projectData: {},
        files,
        userId: "user123",
        collegeId: "college123",
      });

      expect(result.screenshots).toEqual([
        {
          url: "https://cloudinary.com/new.png",
          publicId: "screenshots/new",
        },
      ]);

      expect(result.supportingDocuments).toEqual([
        {
          name: "new.pdf",
          url: "https://cloudinary.com/new.pdf",
          publicId: "documents/new",
          access: "public",
        },
      ]);

      expect(mockCloudinaryDestroy).toHaveBeenCalledWith("screenshots/old", {
        resource_type: "image",
      });

      expect(mockCloudinaryDestroy).toHaveBeenCalledWith("documents/old", {
        resource_type: "raw",
      });

      expect(project.save).toHaveBeenCalled();
    });

    test("should throw 404 when student does not own the project", async () => {
      mockProjectFindOne.mockResolvedValue(null);

      await expect(
        updateProjectService({
          projectId: "project123",
          projectData: {
            title: "Updated Project",
          },
          files: {},
          userId: "wrong-user",
          collegeId: "college123",
        }),
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Project not found or you do not have permission to update it",
      });
    });

    test("should cleanup newly uploaded files when update fails", async () => {
      const project = {
        ...existingProject,
        save: jest.fn().mockRejectedValue(new Error("Database save failed")),
      };

      mockProjectFindOne.mockResolvedValue(project);

      mockUploadToCloudinary.mockResolvedValue({
        url: "https://cloudinary.com/new.png",
        publicId: "screenshots/new",
      });

      mockCloudinaryDestroy.mockResolvedValue({
        result: "ok",
      });

      await expect(
        updateProjectService({
          projectId: "project123",
          projectData: {},
          files: {
            screenshots: [
              {
                buffer: Buffer.from("image"),
                originalname: "new.png",
              },
            ],
          },
          userId: "user123",
          collegeId: "college123",
        }),
      ).rejects.toMatchObject({
        statusCode: 500,
        message: "Failed to update project",
      });

      expect(mockCloudinaryDestroy).toHaveBeenCalledWith("screenshots/new", {
        resource_type: "image",
      });
    });
  });

  // ==================================================
  // deleteProjectService
  // ==================================================

  describe("deleteProjectService", () => {
    test("should delete project and its Cloudinary files", async () => {
      const project = {
        _id: "project123",
        screenshots: [
          {
            publicId: "screenshots/project123",
          },
        ],
        supportingDocuments: [
          {
            publicId: "documents/project123",
          },
        ],
      };

      mockProjectFindOne.mockResolvedValue(project);

      mockCloudinaryDestroy.mockResolvedValue({
        result: "ok",
      });

      mockProjectDeleteOne.mockResolvedValue({
        acknowledged: true,
        deletedCount: 1,
      });

      const result = await deleteProjectService({
        projectId: "project123",
        userId: "user123",
        collegeId: "college123",
      });

      expect(mockProjectFindOne).toHaveBeenCalledWith({
        _id: "project123",
        createdBy: "user123",
        college: "college123",
      });

      expect(mockCloudinaryDestroy).toHaveBeenCalledWith(
        "screenshots/project123",
        {
          resource_type: "image",
        },
      );

      expect(mockCloudinaryDestroy).toHaveBeenCalledWith(
        "documents/project123",
        {
          resource_type: "raw",
        },
      );

      expect(mockProjectDeleteOne).toHaveBeenCalledWith({
        _id: "project123",
      });

      expect(result).toBe(project);
    });

    test("should throw 404 when project does not exist or user does not own it", async () => {
      mockProjectFindOne.mockResolvedValue(null);

      await expect(
        deleteProjectService({
          projectId: "project123",
          userId: "wrong-user",
          collegeId: "college123",
        }),
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Project not found or you do not have permission to delete it",
      });

      expect(mockProjectDeleteOne).not.toHaveBeenCalled();
    });

    test("should still delete the project if Cloudinary cleanup fails", async () => {
      const project = {
        _id: "project123",
        screenshots: [
          {
            publicId: "screenshots/project123",
          },
        ],
        supportingDocuments: [
          {
            publicId: "documents/project123",
          },
        ],
      };

      mockProjectFindOne.mockResolvedValue(project);

      mockCloudinaryDestroy.mockRejectedValue(
        new Error("Cloudinary unavailable"),
      );

      mockProjectDeleteOne.mockResolvedValue({
        acknowledged: true,
        deletedCount: 1,
      });

      const result = await deleteProjectService({
        projectId: "project123",
        userId: "user123",
        collegeId: "college123",
      });

      expect(mockProjectDeleteOne).toHaveBeenCalledWith({
        _id: "project123",
      });

      expect(result).toBe(project);
    });
  });
});
