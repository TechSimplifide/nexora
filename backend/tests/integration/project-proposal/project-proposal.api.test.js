import { jest } from "@jest/globals";
import request from "supertest";

// --------------------------------------------------
// Mocks
// --------------------------------------------------

const mockProjectProposalCreate = jest.fn();
const mockProjectProposalFind = jest.fn();
const mockProjectProposalFindOne = jest.fn();

const mockUploadToCloudinary = jest.fn();
const mockCloudinaryDestroy = jest.fn();

const mockUserFindById = jest.fn();
const mockJwtVerify = jest.fn();
const mockUserFindOne = jest.fn();

const mockCreateNotificationService = jest.fn();
const mockGetMyNotificationsService = jest.fn();
const mockGetUnreadNotificationCountService = jest.fn();
const mockMarkNotificationAsReadService = jest.fn();
const mockMarkAllNotificationsAsReadService = jest.fn();
const mockDeleteNotificationService = jest.fn();

jest.unstable_mockModule(
  "../../../src/models/project-proposal.model.js",
  () => ({
    ProjectProposal: {
      create: mockProjectProposalCreate,
      find: mockProjectProposalFind,
      findOne: mockProjectProposalFindOne,
    },
  }),
);

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

jest.unstable_mockModule("../../../src/models/user.model.js", () => ({
  User: {
    findById: mockUserFindById,
    findOne: mockUserFindOne,
  },
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify: mockJwtVerify,
  },
}));

// --------------------------------------------------
// Mock Notification Service
// --------------------------------------------------
jest.unstable_mockModule(
  "../../../src/services/notification.service.js",
  () => ({
    createNotificationService: mockCreateNotificationService,
    getMyNotificationsService: mockGetMyNotificationsService,
    getUnreadNotificationCountService: mockGetUnreadNotificationCountService,
    markNotificationAsReadService: mockMarkNotificationAsReadService,
    markAllNotificationsAsReadService: mockMarkAllNotificationsAsReadService,
    deleteNotificationService: mockDeleteNotificationService,
  }),
);

const { default: app } = await import("../../../src/app.js");

// --------------------------------------------------
// Constants
// --------------------------------------------------

const AUTH_TOKEN = "valid-access-token";

// --------------------------------------------------
// Mock Users
// --------------------------------------------------

const studentUser = {
  _id: "student123",
  fullName: "Raja",
  email: "raja@example.com",
  role: "student",
  college: "college123",
};

const adminUser = {
  _id: "admin123",
  fullName: "Admin",
  email: "admin@example.com",
  role: "admin",
  college: "college123",
};

// --------------------------------------------------
// Mock Proposal
// --------------------------------------------------

const proposal = {
  _id: "proposal123",
  title: "AI Based Student Project Recommendation System",
  team: {
    size: 2,
    members: [
      {
        name: "Raja",
      },
      {
        name: "Rahul",
      },
    ],
  },
  abstractPdf: {
    url: "https://cloudinary.com/proposal.pdf",
    publicId: "nexora/project-proposals/test123",
  },
  createdBy: "student123",
  college: "college123",
  status: "pending",
};

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const authenticateAs = (user) => {
  mockJwtVerify.mockReturnValue({
    _id: user._id,
  });

  mockUserFindById.mockReturnValue({
    select: jest.fn().mockResolvedValue(user),
  });
};

// --------------------------------------------------
// Tests
// --------------------------------------------------

describe("Project Proposal API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================================================
  // CREATE
  // ==================================================

  describe("POST /api/v1/project-proposals", () => {
    test("should return 401 if student is not authenticated", async () => {
      const response = await request(app)
        .post("/api/v1/project-proposals")
        .field("title", "AI Project");

      expect(response.status).toBe(401);

      expect(response.body.message).toBe("Unauthorized request");
    });

    test("should return 400 for invalid request", async () => {
      authenticateAs(studentUser);

      const response = await request(app)
        .post("/api/v1/project-proposals")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`)
        .send({});

      expect(response.status).toBe(400);

      expect(mockProjectProposalCreate).not.toHaveBeenCalled();
      expect(mockUploadToCloudinary).not.toHaveBeenCalled();
    });

    test("should create project proposal successfully", async () => {
      authenticateAs(studentUser);

      mockUploadToCloudinary.mockResolvedValue({
        url: "https://cloudinary.com/proposal.pdf",
        publicId: "nexora/project-proposals/test123",
      });

      mockProjectProposalCreate.mockResolvedValue(proposal);

      mockUserFindOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(adminUser),
      });

      const response = await request(app)
        .post("/api/v1/project-proposals")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`)
        .field("title", "AI Based Student Project Recommendation System")
        .field(
          "team",
          JSON.stringify({
            size: 2,
            members: [{ name: "Raja" }, { name: "Rahul" }],
          }),
        )
        .attach(
          "abstractPdf",
          Buffer.from("%PDF-1.4 fake pdf"),
          "abstract.pdf",
        );

      expect(response.status).toBe(201);

      expect(response.body.message).toBe(
        "Project proposal submitted successfully",
      );

      expect(response.body.data).toEqual(proposal);

      expect(mockUploadToCloudinary).toHaveBeenCalledWith(expect.any(Buffer), {
        folder: "nexora/project-proposals",
        resourceType: "image",
      });

      expect(mockProjectProposalCreate).toHaveBeenCalledWith({
        title: "AI Based Student Project Recommendation System",
        team: {
          size: 2,
          members: [{ name: "Raja" }, { name: "Rahul" }],
        },
        abstractPdf: {
          url: "https://cloudinary.com/proposal.pdf",
          publicId: "nexora/project-proposals/test123",
        },
        createdBy: "student123",
        college: "college123",
        status: "pending",
      });
    });

    test("should reject non-PDF files", async () => {
      authenticateAs(studentUser);

      const response = await request(app)
        .post("/api/v1/project-proposals")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`)
        .field("title", "AI Project")
        .field(
          "team",
          JSON.stringify({
            size: 2,
            members: [{ name: "Raja" }, { name: "Rahul" }],
          }),
        )
        .attach("abstractPdf", Buffer.from("fake image"), "image.png");

      expect(response.status).toBe(500);

      expect(mockUploadToCloudinary).not.toHaveBeenCalled();
      expect(mockProjectProposalCreate).not.toHaveBeenCalled();
    });
  });

  // ==================================================
  // GET MY PROPOSALS
  // ==================================================

  describe("GET /api/v1/project-proposals/my", () => {
    test("should return 401 if student is not authenticated", async () => {
      const response = await request(app).get("/api/v1/project-proposals/my");

      expect(response.status).toBe(401);

      expect(response.body.message).toBe("Unauthorized request");
    });

    test("should return student's project proposals", async () => {
      authenticateAs(studentUser);

      const proposals = [proposal];

      const mockSort = jest.fn().mockResolvedValue(proposals);

      const mockPopulateReviewedBy = jest.fn().mockReturnValue({
        sort: mockSort,
      });

      const mockPopulateCollege = jest.fn().mockReturnValue({
        populate: mockPopulateReviewedBy,
      });

      mockProjectProposalFind.mockReturnValue({
        populate: mockPopulateCollege,
      });

      const response = await request(app)
        .get("/api/v1/project-proposals/my")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(200);

      expect(response.body.message).toBe(
        "Project proposals fetched successfully",
      );

      expect(response.body.data).toEqual(proposals);

      expect(mockProjectProposalFind).toHaveBeenCalledWith({
        createdBy: "student123",
      });
    });
  });

  // ==================================================
  // GET PENDING
  // ==================================================

  describe("GET /api/v1/project-proposals/pending", () => {
    test("should return 401 if not authenticated", async () => {
      const response = await request(app).get(
        "/api/v1/project-proposals/pending",
      );

      expect(response.status).toBe(401);

      expect(response.body.message).toBe("Unauthorized request");
    });

    test("should return 403 if student tries to access pending proposals", async () => {
      authenticateAs(studentUser);

      const response = await request(app)
        .get("/api/v1/project-proposals/pending")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(403);

      expect(mockProjectProposalFind).not.toHaveBeenCalled();
    });

    test("should return pending proposals for admin", async () => {
      authenticateAs(adminUser);

      const proposals = [proposal];

      const mockSort = jest.fn().mockResolvedValue(proposals);

      const mockPopulateCollege = jest.fn().mockReturnValue({
        sort: mockSort,
      });

      const mockPopulateCreatedBy = jest.fn().mockReturnValue({
        populate: mockPopulateCollege,
      });

      mockProjectProposalFind.mockReturnValue({
        populate: mockPopulateCreatedBy,
      });

      const response = await request(app)
        .get("/api/v1/project-proposals/pending")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(200);

      expect(response.body.message).toBe(
        "Pending project proposals fetched successfully",
      );

      expect(response.body.data).toEqual(proposals);

      expect(mockProjectProposalFind).toHaveBeenCalledWith({
        college: "college123",
        status: "pending",
      });
    });
  });

  // ==================================================
  // APPROVE
  // ==================================================

  describe("PATCH /api/v1/project-proposals/:id/approve", () => {
    test("should return 403 if student tries to approve proposal", async () => {
      authenticateAs(studentUser);

      const response = await request(app)
        .patch("/api/v1/project-proposals/proposal123/approve")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(403);

      expect(mockProjectProposalFindOne).not.toHaveBeenCalled();
    });

    test("should approve a pending proposal", async () => {
      authenticateAs(adminUser);

      const mockProposal = {
        ...proposal,
        save: jest.fn().mockResolvedValue(),
      };

      mockProjectProposalFindOne.mockResolvedValue(mockProposal);

      const response = await request(app)
        .patch("/api/v1/project-proposals/proposal123/approve")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(200);

      expect(response.body.message).toBe(
        "Project proposal approved successfully",
      );

      expect(mockProposal.status).toBe("approved");

      expect(mockProposal.reviewedBy).toBe("admin123");

      expect(mockProposal.adminRemarks).toBeNull();

      expect(mockProposal.save).toHaveBeenCalled();
    });

    test("should return 404 if pending proposal does not exist", async () => {
      authenticateAs(adminUser);

      mockProjectProposalFindOne.mockResolvedValue(null);

      const response = await request(app)
        .patch("/api/v1/project-proposals/unknown/approve")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(404);

      expect(response.body.message).toBe("Pending project proposal not found");
    });
  });

  // ==================================================
  // REJECT
  // ==================================================

  describe("PATCH /api/v1/project-proposals/:id/reject", () => {
    test("should return 403 if student tries to reject proposal", async () => {
      authenticateAs(studentUser);

      const response = await request(app)
        .patch("/api/v1/project-proposals/proposal123/reject")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`)
        .send({
          adminRemarks: "Please improve the project",
        });

      expect(response.status).toBe(403);

      expect(mockProjectProposalFindOne).not.toHaveBeenCalled();
    });

    test("should reject a pending proposal", async () => {
      authenticateAs(adminUser);

      const mockProposal = {
        ...proposal,
        save: jest.fn().mockResolvedValue(),
      };

      mockProjectProposalFindOne.mockResolvedValue(mockProposal);

      const response = await request(app)
        .patch("/api/v1/project-proposals/proposal123/reject")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`)
        .send({
          adminRemarks: "Please improve the problem statement",
        });

      expect(response.status).toBe(200);

      expect(response.body.message).toBe(
        "Project proposal rejected successfully",
      );

      expect(mockProposal.status).toBe("rejected");

      expect(mockProposal.adminRemarks).toBe(
        "Please improve the problem statement",
      );

      expect(mockProposal.reviewedBy).toBe("admin123");

      expect(mockProposal.save).toHaveBeenCalled();
    });

    test("should return 404 if proposal is not pending", async () => {
      authenticateAs(adminUser);

      mockProjectProposalFindOne.mockResolvedValue(null);

      const response = await request(app)
        .patch("/api/v1/project-proposals/proposal123/reject")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`)
        .send({
          adminRemarks: "Rejected",
        });

      expect(response.status).toBe(404);

      expect(response.body.message).toBe("Pending project proposal not found");
    });
  });

  // ==================================================
  // UPDATE
  // ==================================================

  describe("PATCH /api/v1/project-proposals/:id", () => {
    test("should return 403 if admin tries to update proposal", async () => {
      authenticateAs(adminUser);

      const response = await request(app)
        .patch("/api/v1/project-proposals/proposal123")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`)
        .field("title", "Updated Project");

      expect(response.status).toBe(403);

      expect(mockProjectProposalFindOne).not.toHaveBeenCalled();
    });

    test("should update rejected proposal without replacing PDF", async () => {
      authenticateAs(studentUser);

      const mockProposal = {
        ...proposal,
        status: "rejected",
        save: jest.fn().mockResolvedValue(),
      };

      mockProjectProposalFindOne.mockResolvedValue(mockProposal);

      mockUserFindOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(adminUser),
      });

      const response = await request(app)
        .patch("/api/v1/project-proposals/proposal123")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`)
        .field("title", "Updated AI Project")
        .field(
          "team",
          JSON.stringify({
            size: 2,
            members: [{ name: "Raja" }, { name: "Rahul" }],
          }),
        );

      expect(response.status).toBe(200);

      expect(response.body.message).toBe(
        "Project proposal updated and resubmitted successfully",
      );

      expect(mockUploadToCloudinary).not.toHaveBeenCalled();

      expect(mockCloudinaryDestroy).not.toHaveBeenCalled();

      expect(mockProposal.status).toBe("pending");

      expect(mockProposal.adminRemarks).toBeNull();

      expect(mockProposal.reviewedBy).toBeNull();

      expect(mockProposal.reviewedAt).toBeNull();

      expect(mockProposal.save).toHaveBeenCalled();
    });

    test("should update rejected proposal and replace PDF", async () => {
      authenticateAs(studentUser);

      const mockProposal = {
        ...proposal,
        status: "rejected",
        save: jest.fn().mockResolvedValue(),
      };

      mockProjectProposalFindOne.mockResolvedValue(mockProposal);

      mockUserFindOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(adminUser),
      });

      mockUploadToCloudinary.mockResolvedValue({
        url: "https://cloudinary.com/new-proposal.pdf",
        publicId: "new-public-id",
      });

      mockCloudinaryDestroy.mockResolvedValue({
        result: "ok",
      });

      const response = await request(app)
        .patch("/api/v1/project-proposals/proposal123")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`)
        .field("title", "Updated AI Project")
        .field(
          "team",
          JSON.stringify({
            size: 2,
            members: [{ name: "Raja" }, { name: "Rahul" }],
          }),
        )
        .attach(
          "abstractPdf",
          Buffer.from("%PDF-1.4 new pdf"),
          "new-abstract.pdf",
        );

      expect(response.status).toBe(200);

      expect(response.body.message).toBe(
        "Project proposal updated and resubmitted successfully",
      );

      expect(mockUploadToCloudinary).toHaveBeenCalledWith(expect.any(Buffer), {
        folder: "nexora/project-proposals",
        resourceType: "image",
      });

      expect(mockCloudinaryDestroy).toHaveBeenCalledWith(
        "nexora/project-proposals/test123",
        {
          resource_type: "image",
        },
      );

      expect(mockProposal.abstractPdf).toEqual({
        url: "https://cloudinary.com/new-proposal.pdf",
        publicId: "new-public-id",
      });

      expect(mockProposal.status).toBe("pending");

      expect(mockProposal.save).toHaveBeenCalled();
    });

    test("should return 404 if rejected proposal does not exist", async () => {
      authenticateAs(studentUser);

      mockProjectProposalFindOne.mockResolvedValue(null);

      const response = await request(app)
        .patch("/api/v1/project-proposals/unknown")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`)
        .field("title", "Updated Project");

      expect(response.status).toBe(404);

      expect(response.body.message).toBe("Rejected project proposal not found");
    });
  });

  // ==================================================
  // DELETE
  // ==================================================

  describe("DELETE /api/v1/project-proposals/:id", () => {
    test("should return 403 if admin tries to delete proposal", async () => {
      authenticateAs(adminUser);

      const response = await request(app)
        .delete("/api/v1/project-proposals/proposal123")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(403);

      expect(mockProjectProposalFindOne).not.toHaveBeenCalled();
    });

    test("should delete pending proposal and its PDF", async () => {
      authenticateAs(studentUser);

      const mockProposal = {
        ...proposal,
        deleteOne: jest.fn().mockResolvedValue(),
      };

      mockProjectProposalFindOne.mockResolvedValue(mockProposal);

      mockCloudinaryDestroy.mockResolvedValue({
        result: "ok",
      });

      const response = await request(app)
        .delete("/api/v1/project-proposals/proposal123")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(200);

      expect(response.body.message).toBe(
        "Project proposal deleted successfully",
      );

      expect(response.body.data).toEqual({
        id: "proposal123",
      });

      expect(mockCloudinaryDestroy).toHaveBeenCalledWith(
        "nexora/project-proposals/test123",
        {
          resource_type: "image",
        },
      );

      expect(mockProposal.deleteOne).toHaveBeenCalled();
    });

    test("should return 404 if proposal cannot be deleted", async () => {
      authenticateAs(studentUser);

      mockProjectProposalFindOne.mockResolvedValue(null);

      const response = await request(app)
        .delete("/api/v1/project-proposals/proposal123")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(404);

      expect(response.body.message).toBe(
        "Project proposal not found or cannot be deleted",
      );

      expect(mockCloudinaryDestroy).not.toHaveBeenCalled();
    });
  });
});
