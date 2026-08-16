import { jest } from "@jest/globals";

const mockCreateProjectAccessRequestService = jest.fn();
const mockGetMyProjectAccessRequestsService = jest.fn();
const mockGetProjectAccessRequestsService = jest.fn();
const mockApproveProjectAccessRequestService = jest.fn();
const mockRejectProjectAccessRequestService = jest.fn();
const mockCancelProjectAccessRequestService = jest.fn();

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
// Mock Project Access Request Service
// --------------------------------------------------

jest.unstable_mockModule(
  "../../../src/services/project-access-request.service.js",
  () => ({
    createProjectAccessRequestService: mockCreateProjectAccessRequestService,

    getMyProjectAccessRequestsService: mockGetMyProjectAccessRequestsService,

    getProjectAccessRequestsService: mockGetProjectAccessRequestsService,

    approveProjectAccessRequestService: mockApproveProjectAccessRequestService,

    rejectProjectAccessRequestService: mockRejectProjectAccessRequestService,

    cancelProjectAccessRequestService: mockCancelProjectAccessRequestService,
  }),
);

// Import app AFTER mocks
const { default: app } = await import("../../../src/app.js");

import request from "supertest";
import ApiError from "../../../src/utils/api-error.js";

// --------------------------------------------------
// Test Data
// --------------------------------------------------

const mockAccessRequest = {
  _id: "request123",
  project: "project123",
  requestedBy: "student123",
  resourceType: "github",
  status: "pending",
  respondedAt: null,
  createdAt: "2026-08-15T10:00:00.000Z",
  updatedAt: "2026-08-15T10:00:00.000Z",
};

const mockProjectAccessRequests = [
  {
    ...mockAccessRequest,
    requestedBy: {
      _id: "student123",
      fullName: "Raja",
      username: "raja",
      email: "raja@example.com",
    },
  },
];

// ==================================================
// PROJECT ACCESS REQUEST API
// ==================================================

describe("Project Access Request API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================================================
  // POST /api/v1/projects/:projectId/access-requests
  // ==================================================

  describe("POST /api/v1/projects/:projectId/access-requests", () => {
    test("should return validation error for invalid resource type", async () => {
      const response = await request(app)
        .post("/api/v1/projects/project123/access-requests")
        .send({
          resourceType: "invalidResource",
        });

      expect(response.status).toBe(400);

      expect(mockCreateProjectAccessRequestService).not.toHaveBeenCalled();
    });

    test("should create GitHub access request successfully", async () => {
      mockCreateProjectAccessRequestService.mockResolvedValue(
        mockAccessRequest,
      );

      const response = await request(app)
        .post("/api/v1/projects/project123/access-requests")
        .send({
          resourceType: "github",
        });

      expect(response.status).toBe(201);

      expect(response.body.message).toBe(
        "Project access request created successfully",
      );

      expect(response.body.data).toEqual(mockAccessRequest);

      expect(mockCreateProjectAccessRequestService).toHaveBeenCalledTimes(1);

      expect(mockCreateProjectAccessRequestService).toHaveBeenCalledWith({
        projectId: "project123",
        requestedBy: "student123",
        collegeId: "college123",
        resourceType: "github",
      });
    });

    test("should create deployed link access request successfully", async () => {
      const requestData = {
        ...mockAccessRequest,
        resourceType: "deployedLink",
      };

      mockCreateProjectAccessRequestService.mockResolvedValue(requestData);

      const response = await request(app)
        .post("/api/v1/projects/project123/access-requests")
        .send({
          resourceType: "deployedLink",
        });

      expect(response.status).toBe(201);

      expect(response.body.message).toBe(
        "Project access request created successfully",
      );

      expect(response.body.data).toEqual(requestData);
    });

    test("should create supporting document access request successfully", async () => {
      const requestData = {
        ...mockAccessRequest,
        resourceType: "supportingDocument",
      };

      mockCreateProjectAccessRequestService.mockResolvedValue(requestData);

      const response = await request(app)
        .post("/api/v1/projects/project123/access-requests")
        .send({
          resourceType: "supportingDocument",
        });

      expect(response.status).toBe(201);

      expect(response.body.data).toEqual(requestData);
    });

    test("should return 409 if access request already exists", async () => {
      mockCreateProjectAccessRequestService.mockRejectedValue(
        new ApiError(409, "Access request already exists"),
      );

      const response = await request(app)
        .post("/api/v1/projects/project123/access-requests")
        .send({
          resourceType: "github",
        });

      expect(response.status).toBe(409);

      expect(response.body.message).toBe("Access request already exists");
    });
  });

  // ==================================================
  // GET /api/v1/projects/access-requests/my
  // ==================================================

  describe("GET /api/v1/projects/access-requests/my", () => {
    test("should return user's access requests successfully", async () => {
      mockGetMyProjectAccessRequestsService.mockResolvedValue(
        mockProjectAccessRequests,
      );

      const response = await request(app).get(
        "/api/v1/projects/access-requests/my",
      );

      expect(response.status).toBe(200);

      expect(response.body.message).toBe(
        "Your project access requests fetched successfully",
      );

      expect(response.body.data).toEqual(mockProjectAccessRequests);

      expect(mockGetMyProjectAccessRequestsService).toHaveBeenCalledTimes(1);

      expect(mockGetMyProjectAccessRequestsService).toHaveBeenCalledWith({
        requestedBy: "student123",
        collegeId: "college123",
      });
    });

    test("should return empty array when user has no access requests", async () => {
      mockGetMyProjectAccessRequestsService.mockResolvedValue([]);

      const response = await request(app).get(
        "/api/v1/projects/access-requests/my",
      );

      expect(response.status).toBe(200);

      expect(response.body.data).toEqual([]);
    });
  });

  // ==================================================
  // GET /api/v1/projects/:projectId/access-requests
  // ==================================================

  describe("GET /api/v1/projects/:projectId/access-requests", () => {
    test("should return project access requests successfully", async () => {
      mockGetProjectAccessRequestsService.mockResolvedValue(
        mockProjectAccessRequests,
      );

      const response = await request(app).get(
        "/api/v1/projects/project123/access-requests",
      );

      expect(response.status).toBe(200);

      expect(response.body.message).toBe(
        "Project access requests fetched successfully",
      );

      expect(response.body.data).toEqual(mockProjectAccessRequests);

      expect(mockGetProjectAccessRequestsService).toHaveBeenCalledTimes(1);

      expect(mockGetProjectAccessRequestsService).toHaveBeenCalledWith({
        projectId: "project123",
        userId: "student123",
        collegeId: "college123",
      });
    });

    test("should return 404 if user does not own the project", async () => {
      mockGetProjectAccessRequestsService.mockRejectedValue(
        new ApiError(
          404,
          "Project not found or you do not have permission to view access requests",
        ),
      );

      const response = await request(app).get(
        "/api/v1/projects/project123/access-requests",
      );

      expect(response.status).toBe(404);

      expect(response.body.message).toBe(
        "Project not found or you do not have permission to view access requests",
      );
    });
  });

  // ==================================================
  // PATCH /api/v1/projects/access-requests/:requestId/approve
  // ==================================================

  describe("PATCH /api/v1/projects/access-requests/:requestId/approve", () => {
    test("should approve access request successfully", async () => {
      const approvedRequest = {
        ...mockAccessRequest,
        status: "approved",
        respondedAt: "2026-08-15T12:00:00.000Z",
      };

      mockApproveProjectAccessRequestService.mockResolvedValue(approvedRequest);

      const response = await request(app).patch(
        "/api/v1/projects/access-requests/request123/approve",
      );

      expect(response.status).toBe(200);

      expect(response.body.message).toBe(
        "Project access request approved successfully",
      );

      expect(response.body.data).toEqual(approvedRequest);

      expect(mockApproveProjectAccessRequestService).toHaveBeenCalledWith({
        requestId: "request123",
        userId: "student123",
        collegeId: "college123",
      });
    });

    test("should return 409 if request is already approved", async () => {
      mockApproveProjectAccessRequestService.mockRejectedValue(
        new ApiError(409, "Access request has already been approved"),
      );

      const response = await request(app).patch(
        "/api/v1/projects/access-requests/request123/approve",
      );

      expect(response.status).toBe(409);

      expect(response.body.message).toBe(
        "Access request has already been approved",
      );
    });
  });

  // ==================================================
  // PATCH /api/v1/projects/access-requests/:requestId/reject
  // ==================================================

  describe("PATCH /api/v1/projects/access-requests/:requestId/reject", () => {
    test("should reject access request successfully", async () => {
      const rejectedRequest = {
        ...mockAccessRequest,
        status: "rejected",
        respondedAt: "2026-08-15T12:00:00.000Z",
      };

      mockRejectProjectAccessRequestService.mockResolvedValue(rejectedRequest);

      const response = await request(app).patch(
        "/api/v1/projects/access-requests/request123/reject",
      );

      expect(response.status).toBe(200);

      expect(response.body.message).toBe(
        "Project access request rejected successfully",
      );

      expect(response.body.data).toEqual(rejectedRequest);

      expect(mockRejectProjectAccessRequestService).toHaveBeenCalledWith({
        requestId: "request123",
        userId: "student123",
        collegeId: "college123",
      });
    });

    test("should return 409 if request is already rejected", async () => {
      mockRejectProjectAccessRequestService.mockRejectedValue(
        new ApiError(409, "Access request has already been rejected"),
      );

      const response = await request(app).patch(
        "/api/v1/projects/access-requests/request123/reject",
      );

      expect(response.status).toBe(409);

      expect(response.body.message).toBe(
        "Access request has already been rejected",
      );
    });
  });

  // ==================================================
  // DELETE /api/v1/projects/access-requests/:requestId
  // ==================================================

  describe("DELETE /api/v1/projects/access-requests/:requestId", () => {
    test("should cancel access request successfully", async () => {
      mockCancelProjectAccessRequestService.mockResolvedValue(
        mockAccessRequest,
      );

      const response = await request(app).delete(
        "/api/v1/projects/access-requests/request123",
      );

      expect(response.status).toBe(200);

      expect(response.body.message).toBe(
        "Project access request cancelled successfully",
      );

      expect(response.body.data).toBeNull();

      expect(mockCancelProjectAccessRequestService).toHaveBeenCalledWith({
        requestId: "request123",
        requestedBy: "student123",
        collegeId: "college123",
      });
    });

    test("should return 409 if request cannot be cancelled", async () => {
      mockCancelProjectAccessRequestService.mockRejectedValue(
        new ApiError(
          409,
          "Cannot cancel an access request that has already been approved",
        ),
      );

      const response = await request(app).delete(
        "/api/v1/projects/access-requests/request123",
      );

      expect(response.status).toBe(409);

      expect(response.body.message).toBe(
        "Cannot cancel an access request that has already been approved",
      );
    });
  });
});
