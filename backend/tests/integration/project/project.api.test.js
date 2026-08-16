import { jest } from "@jest/globals";

const mockCreateProjectService = jest.fn();
const mockGetProjectsService = jest.fn();
const mockGetProjectByIdService = jest.fn();
const mockUpdateProjectService = jest.fn();
const mockDeleteProjectService = jest.fn();

const mockFeatureProjectService = jest.fn();
const mockUnfeatureProjectService = jest.fn();
const mockGetFeaturedProjectsService = jest.fn();

import { USER_ROLES } from "../../../src/constants/roles.js";

// --------------------------------------------------
// Mock Authentication Middleware
// --------------------------------------------------

let mockUserRole = USER_ROLES.STUDENT;

jest.unstable_mockModule("../../../src/middlewares/auth.middleware.js", () => ({
  verifyJWT: (req, res, next) => {
    req.user = {
      _id: "student123",
      role: mockUserRole,
      college: "college123",
    };

    next();
  },
}));

// --------------------------------------------------
// Mock Project Service
// --------------------------------------------------

jest.unstable_mockModule("../../../src/services/project.service.js", () => ({
  createProjectService: mockCreateProjectService,
  getProjectsService: mockGetProjectsService,
  getProjectByIdService: mockGetProjectByIdService,
  updateProjectService: mockUpdateProjectService,
  deleteProjectService: mockDeleteProjectService,
  featureProjectService: mockFeatureProjectService,
  unfeatureProjectService: mockUnfeatureProjectService,
  getFeaturedProjectsService: mockGetFeaturedProjectsService,
}));

// Import app AFTER mocks
const { default: app } = await import("../../../src/app.js");

import request from "supertest";
import ApiError from "../../../src/utils/api-error.js";

// --------------------------------------------------
// Test Data
// --------------------------------------------------

const mockProject = {
  _id: "project123",
  title: "Hospital Management System",
  summary: "A hospital management system for managing hospital operations",
  description:
    "This is a complete hospital management system designed to manage patients, doctors, appointments and hospital operations.",
  technologies: ["React", "Node.js", "MongoDB"],
  domain: "WEB",
  department: "IT",
  academicYear: "2026-27",
  teamMembers: [
    {
      _id: "member123",
      name: "Raja",
      role: "Backend Developer",
    },
  ],
  screenshots: [
    {
      url: "https://cloudinary.com/screenshot.png",
      publicId: "projects/screenshot",
    },
  ],
  github: {
    url: "https://github.com/example/project",
    access: "protected",
  },
  deployedLink: {
    url: "https://example.vercel.app",
    access: "public",
  },
  supportingDocument: {
    name: "documentation.pdf",
    url: "https://cloudinary.com/document.pdf",
    publicId: "projects/document",
    access: "public",
  },
  createdBy: "student123",
  college: "college123",
};

// ==================================================
// PROJECT API
// ==================================================

describe("Project API", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default authenticated user for normal project operations
    mockUserRole = USER_ROLES.STUDENT;
  });

  // ==================================================
  // POST /api/v1/projects
  // ==================================================

  describe("POST /api/v1/projects", () => {
    test("should return validation error for invalid request", async () => {
      const response = await request(app)
        .post("/api/v1/projects")
        .field("title", "A")
        .field("summary", "Short")
        .field("description", "Short description")
        .field("technologies", JSON.stringify([]))
        .field("domain", "W")
        .field("department", "I")
        .field("academicYear", "2026")
        .field("teamMembers", JSON.stringify([]));

      expect(response.status).toBe(400);

      expect(mockCreateProjectService).not.toHaveBeenCalled();
    });

    test("should create project successfully", async () => {
      mockCreateProjectService.mockResolvedValue(mockProject);

      const response = await request(app)
        .post("/api/v1/projects")
        .field("title", "Hospital Management System")
        .field(
          "summary",
          "A hospital management system for managing hospital operations",
        )
        .field(
          "description",
          "This is a complete hospital management system designed to manage patients, doctors, appointments and hospital operations.",
        )
        .field("technologies", JSON.stringify(["React", "Node.js", "MongoDB"]))
        .field("domain", "WEB")
        .field("department", "IT")
        .field("academicYear", "2026-27")
        .field(
          "teamMembers",
          JSON.stringify([
            {
              name: "Raja",
              role: "Backend Developer",
            },
          ]),
        )
        .field(
          "github",
          JSON.stringify({
            url: "https://github.com/example/project",
            access: "protected",
          }),
        )
        .field(
          "deployedLink",
          JSON.stringify({
            url: "https://example.vercel.app",
            access: "public",
          }),
        );

      expect(response.status).toBe(201);

      expect(response.body.message).toBe("Project created successfully");

      expect(response.body.data).toEqual(mockProject);

      expect(mockCreateProjectService).toHaveBeenCalledTimes(1);

      expect(mockCreateProjectService).toHaveBeenCalledWith({
        projectData: expect.objectContaining({
          title: "Hospital Management System",
          technologies: ["React", "Node.js", "MongoDB"],
          domain: "WEB",
          academicYear: "2026-27",
        }),
        files: {},
        userId: "student123",
        collegeId: "college123",
      });
    });

    test("should create project with uploaded files", async () => {
      mockCreateProjectService.mockResolvedValue(mockProject);

      const response = await request(app)
        .post("/api/v1/projects")
        .field("title", "Hospital Management System")
        .field(
          "summary",
          "A hospital management system for managing hospital operations",
        )
        .field(
          "description",
          "This is a complete hospital management system designed to manage patients, doctors, appointments and hospital operations.",
        )
        .field("technologies", JSON.stringify(["React", "Node.js", "MongoDB"]))
        .field("domain", "WEB")
        .field("department", "IT")
        .field("academicYear", "2026-27")
        .field(
          "teamMembers",
          JSON.stringify([
            {
              name: "Raja",
              role: "Backend Developer",
            },
          ]),
        )
        .attach("screenshots", Buffer.from("fake-image"), "screenshot.png")
        .attach("supportingDocument", Buffer.from("fake-pdf"), "document.pdf");

      expect(response.status).toBe(201);

      expect(response.body.message).toBe("Project created successfully");

      expect(mockCreateProjectService).toHaveBeenCalledTimes(1);

      const serviceCall = mockCreateProjectService.mock.calls[0][0];

      expect(serviceCall.files.screenshots).toHaveLength(1);
      expect(serviceCall.files.supportingDocument).toHaveLength(1);
    });

    test("should return 400 for invalid technologies JSON", async () => {
      const response = await request(app)
        .post("/api/v1/projects")
        .field("title", "Hospital Management System")
        .field(
          "summary",
          "A hospital management system for managing hospital operations",
        )
        .field(
          "description",
          "This is a complete hospital management system designed to manage patients, doctors, appointments and hospital operations.",
        )
        .field("technologies", "invalid-json")
        .field("domain", "WEB")
        .field("department", "IT")
        .field("academicYear", "2026-27")
        .field(
          "teamMembers",
          JSON.stringify([
            {
              name: "Raja",
              role: "Backend Developer",
            },
          ]),
        );

      expect(response.status).toBe(400);

      expect(response.body.message).toBe("Invalid technologies format");

      expect(mockCreateProjectService).not.toHaveBeenCalled();
    });
  });

  // ==================================================
  // GET /api/v1/projects
  // ==================================================

  describe("GET /api/v1/projects", () => {
    test("should return projects successfully", async () => {
      const serviceResponse = {
        projects: [mockProject],
        pagination: {
          page: 1,
          limit: 10,
          totalProjects: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      mockGetProjectsService.mockResolvedValue(serviceResponse);

      const response = await request(app).get("/api/v1/projects");

      expect(response.status).toBe(200);

      expect(response.body.message).toBe("Projects fetched successfully");

      expect(response.body.data).toEqual(serviceResponse);

      expect(mockGetProjectsService).toHaveBeenCalledTimes(1);

      expect(mockGetProjectsService).toHaveBeenCalledWith(
        expect.objectContaining({
          collegeId: "college123",
        }),
      );
    });

    test("should apply search and filters", async () => {
      mockGetProjectsService.mockResolvedValue({
        projects: [mockProject],
        pagination: {
          page: 1,
          limit: 5,
          totalProjects: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });

      const response = await request(app).get("/api/v1/projects").query({
        search: "Hospital",
        technology: "React",
        domain: "WEB",
        department: "IT",
        academicYear: "2026-27",
        page: 1,
        limit: 5,
      });

      expect(response.status).toBe(200);

      expect(mockGetProjectsService).toHaveBeenCalledWith(
        expect.objectContaining({
          collegeId: "college123",
          search: "Hospital",
          technology: "React",
          domain: "WEB",
          department: "IT",
          academicYear: "2026-27",
          page: 1,
          limit: 5,
        }),
      );
    });
  });

  // ==================================================
  // GET /api/v1/projects/:id
  // ==================================================

  describe("GET /api/v1/projects/:id", () => {
    test("should return project successfully", async () => {
      mockGetProjectByIdService.mockResolvedValue(mockProject);

      const response = await request(app).get("/api/v1/projects/project123");

      expect(response.status).toBe(200);

      expect(response.body.message).toBe("Project fetched successfully");

      expect(response.body.data).toEqual(mockProject);

      expect(mockGetProjectByIdService).toHaveBeenCalledWith({
        projectId: "project123",
        collegeId: "college123",
      });
    });

    test("should return 404 if project does not exist", async () => {
      mockGetProjectByIdService.mockRejectedValue(
        new ApiError(404, "Project not found"),
      );

      const response = await request(app).get(
        "/api/v1/projects/unknown-project",
      );

      expect(response.status).toBe(404);

      expect(response.body.message).toBe("Project not found");
    });
  });

  // ==================================================
  // PATCH /api/v1/projects/:id
  // ==================================================

  describe("PATCH /api/v1/projects/:id", () => {
    test("should update project successfully", async () => {
      const updatedProject = {
        ...mockProject,
        title: "Updated Hospital Management System",
      };

      mockUpdateProjectService.mockResolvedValue(updatedProject);

      const response = await request(app)
        .patch("/api/v1/projects/project123")
        .field("title", "Updated Hospital Management System");

      expect(response.status).toBe(200);

      expect(response.body.message).toBe("Project updated successfully");

      expect(response.body.data).toEqual(updatedProject);

      expect(mockUpdateProjectService).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId: "project123",
          userId: "student123",
          collegeId: "college123",
          projectData: expect.objectContaining({
            title: "Updated Hospital Management System",
          }),
        }),
      );
    });

    test("should replace project files successfully", async () => {
      mockUpdateProjectService.mockResolvedValue(mockProject);

      const response = await request(app)
        .patch("/api/v1/projects/project123")
        .field("title", "Updated Project")
        .attach("screenshots", Buffer.from("new-image"), "new.png")
        .attach(
          "supportingDocument",
          Buffer.from("new-pdf"),
          "new-document.pdf",
        );

      expect(response.status).toBe(200);

      expect(response.body.message).toBe("Project updated successfully");

      expect(mockUpdateProjectService).toHaveBeenCalledTimes(1);

      const serviceCall = mockUpdateProjectService.mock.calls[0][0];

      expect(serviceCall.files.screenshots).toHaveLength(1);
      expect(serviceCall.files.supportingDocument).toHaveLength(1);
    });

    test("should return 404 if student does not own the project", async () => {
      mockUpdateProjectService.mockRejectedValue(
        new ApiError(
          404,
          "Project not found or you do not have permission to update it",
        ),
      );

      const response = await request(app)
        .patch("/api/v1/projects/project123")
        .field("title", "Updated Project");

      expect(response.status).toBe(404);

      expect(response.body.message).toBe(
        "Project not found or you do not have permission to update it",
      );
    });
  });

  // ==================================================
  // DELETE /api/v1/projects/:id
  // ==================================================

  describe("DELETE /api/v1/projects/:id", () => {
    test("should delete project successfully", async () => {
      mockDeleteProjectService.mockResolvedValue(mockProject);

      const response = await request(app).delete("/api/v1/projects/project123");

      expect(response.status).toBe(200);

      expect(response.body.message).toBe("Project deleted successfully");

      expect(mockDeleteProjectService).toHaveBeenCalledWith({
        projectId: "project123",
        userId: "student123",
        collegeId: "college123",
      });
    });

    test("should return 404 if student does not own the project", async () => {
      mockDeleteProjectService.mockRejectedValue(
        new ApiError(
          404,
          "Project not found or you do not have permission to delete it",
        ),
      );

      const response = await request(app).delete("/api/v1/projects/project123");

      expect(response.status).toBe(404);

      expect(response.body.message).toBe(
        "Project not found or you do not have permission to delete it",
      );
    });
  });

  // ==================================================
  // FEATURED PROJECT API
  // ==================================================

  describe("Featured Project API", () => {
    // ==================================================
    // GET /api/v1/projects/featured
    // ==================================================

    describe("GET /api/v1/projects/featured", () => {
      test("should return featured projects successfully", async () => {
        const featuredProjects = [
          {
            _id: "project123",
            title: "Library Management System",
            summary: "Library Management System Web based",
            domain: "WEB",
            department: "IT",
            academicYear: "2026-27",
            isFeatured: true,
            createdBy: {
              _id: "student123",
              fullName: "Raja",
              username: "raja",
            },
            college: "college123",
          },
        ];

        mockGetFeaturedProjectsService.mockResolvedValue(featuredProjects);

        const response = await request(app).get("/api/v1/projects/featured");

        expect(response.status).toBe(200);

        expect(response.body.message).toBe(
          "Featured projects fetched successfully",
        );

        expect(response.body.data).toEqual(featuredProjects);

        expect(mockGetFeaturedProjectsService).toHaveBeenCalledTimes(1);

        expect(mockGetFeaturedProjectsService).toHaveBeenCalledWith({
          collegeId: "college123",
        });
      });

      test("should return empty array when no featured projects exist", async () => {
        mockGetFeaturedProjectsService.mockResolvedValue([]);

        const response = await request(app).get("/api/v1/projects/featured");

        expect(response.status).toBe(200);

        expect(response.body.data).toEqual([]);

        expect(mockGetFeaturedProjectsService).toHaveBeenCalledWith({
          collegeId: "college123",
        });
      });
    });

    // ==================================================
    // PATCH /api/v1/projects/:projectId/feature
    // ==================================================

    describe("PATCH /api/v1/projects/:projectId/feature", () => {
      beforeEach(() => {
        // Feature/unfeature operations are ADMIN-only
        mockUserRole = USER_ROLES.ADMIN;
      });

      test("should feature project successfully", async () => {
        const featuredProject = {
          _id: "project123",
          title: "Library Management System",
          academicYear: "2026-27",
          isFeatured: true,
          college: "college123",
        };

        mockFeatureProjectService.mockResolvedValue(featuredProject);

        const response = await request(app).patch(
          "/api/v1/projects/project123/feature",
        );

        expect(response.status).toBe(200);

        expect(response.body.message).toBe("Project featured successfully");

        expect(response.body.data).toEqual(featuredProject);

        expect(mockFeatureProjectService).toHaveBeenCalledTimes(1);

        expect(mockFeatureProjectService).toHaveBeenCalledWith({
          projectId: "project123",
          collegeId: "college123",
        });
      });

      test("should return 404 if project does not exist", async () => {
        mockFeatureProjectService.mockRejectedValue(
          new ApiError(404, "Project not found"),
        );

        const response = await request(app).patch(
          "/api/v1/projects/project123/feature",
        );

        expect(response.status).toBe(404);

        expect(response.body.message).toBe("Project not found");
      });

      test("should return 400 if project is from another academic year", async () => {
        mockFeatureProjectService.mockRejectedValue(
          new ApiError(
            400,
            "Only projects from the current academic year can be featured",
          ),
        );

        const response = await request(app).patch(
          "/api/v1/projects/project123/feature",
        );

        expect(response.status).toBe(400);

        expect(response.body.message).toBe(
          "Only projects from the current academic year can be featured",
        );
      });

      test("should return 409 if project is already featured", async () => {
        mockFeatureProjectService.mockRejectedValue(
          new ApiError(409, "Project is already featured"),
        );

        const response = await request(app).patch(
          "/api/v1/projects/project123/feature",
        );

        expect(response.status).toBe(409);

        expect(response.body.message).toBe("Project is already featured");
      });
    });

    // ==================================================
    // PATCH /api/v1/projects/:projectId/unfeature
    // ==================================================

    describe("PATCH /api/v1/projects/:projectId/unfeature", () => {
      beforeEach(() => {
        // Feature/unfeature operations are ADMIN-only
        mockUserRole = USER_ROLES.ADMIN;
      });

      test("should unfeature project successfully", async () => {
        const unfeaturedProject = {
          _id: "project123",
          title: "Library Management System",
          academicYear: "2026-27",
          isFeatured: false,
          college: "college123",
        };

        mockUnfeatureProjectService.mockResolvedValue(unfeaturedProject);

        const response = await request(app).patch(
          "/api/v1/projects/project123/unfeature",
        );

        expect(response.status).toBe(200);

        expect(response.body.message).toBe("Project unfeatured successfully");

        expect(response.body.data).toEqual(unfeaturedProject);

        expect(mockUnfeatureProjectService).toHaveBeenCalledTimes(1);

        expect(mockUnfeatureProjectService).toHaveBeenCalledWith({
          projectId: "project123",
          collegeId: "college123",
        });
      });

      test("should return 404 if project does not exist", async () => {
        mockUnfeatureProjectService.mockRejectedValue(
          new ApiError(404, "Project not found"),
        );

        const response = await request(app).patch(
          "/api/v1/projects/project123/unfeature",
        );

        expect(response.status).toBe(404);

        expect(response.body.message).toBe("Project not found");
      });

      test("should return 409 if project is not currently featured", async () => {
        mockUnfeatureProjectService.mockRejectedValue(
          new ApiError(409, "Project is not currently featured"),
        );

        const response = await request(app).patch(
          "/api/v1/projects/project123/unfeature",
        );

        expect(response.status).toBe(409);

        expect(response.body.message).toBe("Project is not currently featured");
      });
    });
  });
});
