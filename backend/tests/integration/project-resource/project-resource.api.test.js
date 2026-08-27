import { jest } from "@jest/globals";
import request from "supertest";

import ApiError from "../../../src/utils/api-error.js";

const mockGetProjectResourceService = jest.fn();

// --------------------------------------------------
// Mock Authentication Middleware
// --------------------------------------------------

jest.unstable_mockModule("../../../src/middlewares/auth.middleware.js", () => ({
  verifyJWT: (req, res, next) => {
    req.user = {
      _id: "student123",
      role: "student",
      college: "college123",
    };

    next();
  },
}));

// --------------------------------------------------
// Mock Project Resource Service
// --------------------------------------------------

jest.unstable_mockModule(
  "../../../src/services/project-resource.service.js",
  () => ({
    getProjectResourceService: mockGetProjectResourceService,
  }),
);

// Import app AFTER mocks
const { default: app } = await import("../../../src/app.js");

// --------------------------------------------------
// Test Data
// --------------------------------------------------

const mockGitHubResource = {
  resourceType: "github",
  url: "https://github.com/example/project",
  accessStatus: "approved",
};

const mockDeployedLinkResource = {
  resourceType: "deployedLink",
  url: "https://example.vercel.app",
  accessStatus: "approved",
};

const mockSupportingDocumentResource = {
  resourceType: "supportingDocument",
  url: "https://cloudinary.com/document.pdf",
  accessStatus: "approved",
};

// ==================================================
// PROJECT RESOURCE API
// ==================================================

describe("Project Resource API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================================================
  // GET /api/v1/projects/:projectId/resources/:resourceType
  // ==================================================

  describe("GET /api/v1/projects/:projectId/resources/:resourceType", () => {
    // --------------------------------------------------
    // GitHub
    // --------------------------------------------------

    test("should return GitHub resource successfully", async () => {
      mockGetProjectResourceService.mockResolvedValue(mockGitHubResource);

      const response = await request(app).get(
        "/api/v1/projects/project123/resources/github",
      );

      expect(response.status).toBe(200);

      expect(response.body.message).toBe(
        "Project resource fetched successfully",
      );

      expect(response.body.data).toEqual(mockGitHubResource);

      expect(mockGetProjectResourceService).toHaveBeenCalledTimes(1);

      expect(mockGetProjectResourceService).toHaveBeenCalledWith({
        projectId: "project123",
        resourceType: "github",
        userId: "student123",
        collegeId: "college123",
      });
    });

    // --------------------------------------------------
    // Deployed Link
    // --------------------------------------------------

    test("should return deployed link successfully", async () => {
      mockGetProjectResourceService.mockResolvedValue(mockDeployedLinkResource);

      const response = await request(app).get(
        "/api/v1/projects/project123/resources/deployedLink",
      );

      expect(response.status).toBe(200);

      expect(response.body.message).toBe(
        "Project resource fetched successfully",
      );

      expect(response.body.data).toEqual(mockDeployedLinkResource);

      expect(mockGetProjectResourceService).toHaveBeenCalledWith({
        projectId: "project123",
        resourceType: "deployedLink",
        userId: "student123",
        collegeId: "college123",
      });
    });

    // --------------------------------------------------
    // Supporting Document
    // --------------------------------------------------

    test("should return supporting document successfully", async () => {
      mockGetProjectResourceService.mockResolvedValue(
        mockSupportingDocumentResource,
      );

      const response = await request(app).get(
        "/api/v1/projects/project123/resources/supportingDocument",
      );

      expect(response.status).toBe(200);

      expect(response.body.message).toBe(
        "Project resource fetched successfully",
      );

      expect(response.body.data).toEqual(mockSupportingDocumentResource);

      expect(mockGetProjectResourceService).toHaveBeenCalledWith({
        projectId: "project123",
        resourceType: "supportingDocument",
        userId: "student123",
        collegeId: "college123",
      });
    });

    // --------------------------------------------------
    // Invalid Resource
    // --------------------------------------------------

    test("should return 400 for invalid resource type", async () => {
      mockGetProjectResourceService.mockRejectedValue(
        new ApiError(400, "Invalid resource type"),
      );

      const response = await request(app).get(
        "/api/v1/projects/project123/resources/invalidResource",
      );

      expect(response.status).toBe(400);

      expect(response.body.message).toBe("Invalid resource type");

      expect(mockGetProjectResourceService).toHaveBeenCalledWith({
        projectId: "project123",
        resourceType: "invalidResource",
        userId: "student123",
        collegeId: "college123",
      });
    });

    // --------------------------------------------------
    // Project Not Found
    // --------------------------------------------------

    test("should return 404 if project does not exist", async () => {
      mockGetProjectResourceService.mockRejectedValue(
        new ApiError(404, "Project not found"),
      );

      const response = await request(app).get(
        "/api/v1/projects/project123/resources/github",
      );

      expect(response.status).toBe(404);

      expect(response.body.message).toBe("Project not found");
    });

    // --------------------------------------------------
    // Resource Not Found
    // --------------------------------------------------

    test("should return 404 if resource does not exist", async () => {
      mockGetProjectResourceService.mockRejectedValue(
        new ApiError(404, "Resource not found"),
      );

      const response = await request(app).get(
        "/api/v1/projects/project123/resources/github",
      );

      expect(response.status).toBe(404);

      expect(response.body.message).toBe("Resource not found");
    });

    // --------------------------------------------------
    // Protected Resource
    // --------------------------------------------------

    test("should return 403 when user does not have access to protected resource", async () => {
      mockGetProjectResourceService.mockRejectedValue(
        new ApiError(403, "You do not have access to this protected resource"),
      );

      const response = await request(app).get(
        "/api/v1/projects/project123/resources/github",
      );

      expect(response.status).toBe(403);

      expect(response.body.message).toBe(
        "You do not have access to this protected resource",
      );
    });

    // --------------------------------------------------
    // Owner Access
    // --------------------------------------------------

    test("should return owner access successfully", async () => {
      const ownerResource = {
        ...mockGitHubResource,
        accessStatus: "owner",
      };

      mockGetProjectResourceService.mockResolvedValue(ownerResource);

      const response = await request(app).get(
        "/api/v1/projects/project123/resources/github",
      );

      expect(response.status).toBe(200);

      expect(response.body.data).toEqual(ownerResource);
    });

    // --------------------------------------------------
    // Public Resource
    // --------------------------------------------------

    test("should return public resource successfully", async () => {
      const publicResource = {
        ...mockGitHubResource,
        accessStatus: "public",
      };

      mockGetProjectResourceService.mockResolvedValue(publicResource);

      const response = await request(app).get(
        "/api/v1/projects/project123/resources/github",
      );

      expect(response.status).toBe(200);

      expect(response.body.data).toEqual(publicResource);
    });

    // --------------------------------------------------
    // Access Denied
    // --------------------------------------------------

    test("should return 403 when access is denied", async () => {
      mockGetProjectResourceService.mockRejectedValue(
        new ApiError(403, "Access denied"),
      );

      const response = await request(app).get(
        "/api/v1/projects/project123/resources/github",
      );

      expect(response.status).toBe(403);

      expect(response.body.message).toBe("Access denied");
    });

    // ==================================================
    // ⭐ PER-RESOURCE ACCESS ISOLATION
    // ==================================================

    test("should allow GitHub when GitHub access is approved", async () => {
      mockGetProjectResourceService.mockResolvedValue(mockGitHubResource);

      const response = await request(app).get(
        "/api/v1/projects/project123/resources/github",
      );

      expect(response.status).toBe(200);

      expect(response.body.data).toEqual(mockGitHubResource);

      expect(mockGetProjectResourceService).toHaveBeenCalledWith({
        projectId: "project123",
        resourceType: "github",
        userId: "student123",
        collegeId: "college123",
      });
    });

    test("should deny deployed link when only GitHub access is approved", async () => {
      mockGetProjectResourceService.mockRejectedValue(
        new ApiError(403, "You do not have access to this protected resource"),
      );

      const response = await request(app).get(
        "/api/v1/projects/project123/resources/deployedLink",
      );

      expect(response.status).toBe(403);

      expect(response.body.message).toBe(
        "You do not have access to this protected resource",
      );

      expect(mockGetProjectResourceService).toHaveBeenCalledWith({
        projectId: "project123",
        resourceType: "deployedLink",
        userId: "student123",
        collegeId: "college123",
      });
    });

    test("should deny supporting document when only GitHub access is approved", async () => {
      mockGetProjectResourceService.mockRejectedValue(
        new ApiError(403, "You do not have access to this protected resource"),
      );

      const response = await request(app).get(
        "/api/v1/projects/project123/resources/supportingDocument",
      );

      expect(response.status).toBe(403);

      expect(response.body.message).toBe(
        "You do not have access to this protected resource",
      );

      expect(mockGetProjectResourceService).toHaveBeenCalledWith({
        projectId: "project123",
        resourceType: "supportingDocument",
        userId: "student123",
        collegeId: "college123",
      });
    });
  });
});
