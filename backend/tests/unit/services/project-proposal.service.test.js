import { jest } from "@jest/globals";

// -----------------------------
// Mocks
// -----------------------------

const mockProjectProposalCreate = jest.fn();
const mockProjectProposalFind = jest.fn();
const mockProjectProposalFindOne = jest.fn();
const mockUserFindOne = jest.fn();
const mockCreateNotificationService = jest.fn();
const mockUploadToCloudinary = jest.fn();
const mockCloudinaryDestroy = jest.fn();

// Mock User model
jest.unstable_mockModule("../../../src/models/user.model.js", () => ({
  User: {
    findOne: mockUserFindOne,
  },
}));
// Mock ProjectProposal model
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

jest.unstable_mockModule(
  "../../../src/services/notification.service.js",
  () => ({
    createNotificationService: mockCreateNotificationService,
  }),
);

// Mock Cloudinary upload utility
jest.unstable_mockModule("../../../src/utils/cloudinary-upload.js", () => ({
  uploadToCloudinary: mockUploadToCloudinary,
}));

// Mock Cloudinary
jest.unstable_mockModule("../../../src/config/cloudinary.js", () => ({
  default: {
    uploader: {
      destroy: mockCloudinaryDestroy,
    },
  },
}));

// Mock ApiError
jest.unstable_mockModule("../../../src/utils/api-error.js", () => ({
  default: class ApiError extends Error {
    constructor(statusCode, message) {
      super(message);
      this.statusCode = statusCode;
    }
  },
}));

// Import service AFTER mocks
const {
  createProjectProposalService,
  getMyProjectProposalsService,
  getPendingProjectProposalsService,
  approveProjectProposalService,
  rejectProjectProposalService,
  updateRejectedProjectProposalService,
  deleteProjectProposalService,
} = await import("../../../src/services/project-proposal.service.js");

// -----------------------------
// Reset mocks
// -----------------------------

// beforeEach(() => {
//   jest.clearAllMocks();
// });

beforeEach(() => {
  jest.clearAllMocks();

  mockCreateNotificationService.mockResolvedValue({});
});

// ============================================================
// createProjectProposalService
// ============================================================

describe("createProjectProposalService", () => {
  const user = {
    _id: "user123",
    college: "college123",
  };

  const abstractPdf = {
    buffer: Buffer.from("fake pdf"),
  };

  test("should create a project proposal successfully", async () => {
    const uploadedPdf = {
      url: "https://cloudinary.com/proposal.pdf",
      publicId: "nexora/project-proposals/test123",
    };

    const createdProposal = {
      _id: "proposal123",
      title: "AI Project",
      team: {
        size: 2,
        members: [{ name: "Raja" }, { name: "Rahul" }],
      },
      abstractPdf: uploadedPdf,
      createdBy: user._id,
      college: user.college,
      status: "pending",
    };

    mockUploadToCloudinary.mockResolvedValue(uploadedPdf);
    mockProjectProposalCreate.mockResolvedValue(createdProposal);

    const mockSelect = jest.fn().mockResolvedValue({
      _id: "admin123",
    });

    mockUserFindOne.mockReturnValue({
      select: mockSelect,
    });

    const result = await createProjectProposalService({
      title: "AI Project",
      team: {
        size: 2,
        members: [{ name: "Raja" }, { name: "Rahul" }],
      },
      abstractPdf,
      user,
    });

    expect(mockUploadToCloudinary).toHaveBeenCalledWith(abstractPdf.buffer, {
      folder: "nexora/project-proposals",
      resourceType: "raw",
    });

    expect(mockProjectProposalCreate).toHaveBeenCalledWith({
      title: "AI Project",
      team: {
        size: 2,
        members: [{ name: "Raja" }, { name: "Rahul" }],
      },
      abstractPdf: uploadedPdf,
      createdBy: user._id,
      college: user.college,
      status: "pending",
    });

    expect(result).toEqual(createdProposal);

    expect(mockCreateNotificationService).toHaveBeenCalledWith({
      recipient: "admin123",
      type: "PROJECT_PROPOSAL_SUBMITTED",
      title: "New Project Proposal",
      message: `A new project proposal "${createdProposal.title}" has been submitted for review.`,
      relatedResource: createdProposal._id,
    });
  });

  test("should throw error when abstract PDF is missing", async () => {
    await expect(
      createProjectProposalService({
        title: "AI Project",
        team: {
          size: 2,
          members: [{ name: "Raja" }, { name: "Rahul" }],
        },
        abstractPdf: null,
        user,
      }),
    ).rejects.toThrow("Project abstract PDF is required");

    expect(mockUploadToCloudinary).not.toHaveBeenCalled();
    expect(mockProjectProposalCreate).not.toHaveBeenCalled();
  });
});

// ============================================================
// getMyProjectProposalsService
// ============================================================

// describe("getMyProjectProposalsService", () => {
//   test("should return proposals created by the student", async () => {
//     const proposals = [
//       {
//         _id: "proposal1",
//         title: "AI Project",
//       },
//       {
//         _id: "proposal2",
//         title: "Web Project",
//       },
//     ];

//     const mockSort = jest.fn().mockResolvedValue(proposals);
//     const mockPopulateReviewedBy = jest.fn().mockReturnValue({
//       sort: mockSort,
//     });

//     const mockPopulateCollege = jest.fn().mockReturnValue({
//       populate: mockPopulateReviewedBy,
//     });

//     mockProjectProposalFind.mockReturnValue({
//       populate: mockPopulateCollege,
//     });

//     const result = await getMyProjectProposalsService("user123");

//     expect(mockProjectProposalFind).toHaveBeenCalledWith({
//       createdBy: "user123",
//     });

//     expect(mockPopulateCollege).toHaveBeenCalledWith(
//       "college",
//       "name collegeCode",
//     );

//     expect(mockPopulateReviewedBy).toHaveBeenCalledWith(
//       "reviewedBy",
//       "fullName email",
//     );

//     expect(mockSort).toHaveBeenCalledWith({
//       createdAt: -1,
//     });

//     expect(result).toEqual(proposals);
//   });
// });
describe("getMyProjectProposalsService", () => {
  test("should return proposals created by the student", async () => {
    const proposals = [
      {
        _id: "proposal1",
        title: "AI Project",
      },
      {
        _id: "proposal2",
        title: "Web Project",
      },
    ];

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

    const result = await getMyProjectProposalsService("user123");

    // Verify query
    expect(mockProjectProposalFind).toHaveBeenCalledWith({
      createdBy: "user123",
    });

    // Verify college population
    expect(mockPopulateCollege).toHaveBeenCalledWith(
      "college",
      "name collegeCode",
    );

    // Verify reviewer population
    expect(mockPopulateReviewedBy).toHaveBeenCalledWith(
      "reviewedBy",
      "fullName email",
    );

    // Verify sorting
    expect(mockSort).toHaveBeenCalledWith({
      createdAt: -1,
    });

    // Verify result
    expect(result).toEqual(proposals);
  });
});

// ============================================================
// getPendingProjectProposalsService
// ============================================================

describe("getPendingProjectProposalsService", () => {
  test("should return pending proposals for the college", async () => {
    const proposals = [
      {
        _id: "proposal1",
        status: "pending",
      },
    ];

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

    const result = await getPendingProjectProposalsService("college123");

    expect(mockProjectProposalFind).toHaveBeenCalledWith({
      college: "college123",
      status: "pending",
    });

    expect(mockPopulateCreatedBy).toHaveBeenCalledWith(
      "createdBy",
      "fullName email",
    );

    expect(mockPopulateCollege).toHaveBeenCalledWith(
      "college",
      "name collegeCode",
    );

    expect(mockSort).toHaveBeenCalledWith({
      createdAt: 1,
    });

    expect(result).toEqual(proposals);
  });
});

// ============================================================
// approveProjectProposalService
// ============================================================

describe("approveProjectProposalService", () => {
  test("should approve a pending project proposal", async () => {
    const proposal = {
      _id: "proposal123",
      status: "pending",
      reviewedBy: null,
      reviewedAt: null,
      adminRemarks: "Needs improvement",
      save: jest.fn().mockResolvedValue(),
    };

    mockProjectProposalFindOne.mockResolvedValue(proposal);

    const result = await approveProjectProposalService({
      proposalId: "proposal123",
      adminId: "admin123",
      collegeId: "college123",
    });

    expect(mockProjectProposalFindOne).toHaveBeenCalledWith({
      _id: "proposal123",
      college: "college123",
      status: "pending",
    });

    expect(proposal.status).toBe("approved");
    expect(proposal.reviewedBy).toBe("admin123");
    expect(proposal.reviewedAt).toBeInstanceOf(Date);
    expect(proposal.adminRemarks).toBeNull();

    expect(proposal.save).toHaveBeenCalled();
    expect(result).toBe(proposal);
  });

  test("should throw error when pending proposal is not found", async () => {
    mockProjectProposalFindOne.mockResolvedValue(null);

    await expect(
      approveProjectProposalService({
        proposalId: "proposal123",
        adminId: "admin123",
        collegeId: "college123",
      }),
    ).rejects.toThrow("Pending project proposal not found");
  });
});

// ============================================================
// rejectProjectProposalService
// ============================================================

describe("rejectProjectProposalService", () => {
  test("should reject a pending project proposal", async () => {
    const proposal = {
      _id: "proposal123",
      status: "pending",
      save: jest.fn().mockResolvedValue(),
    };

    mockProjectProposalFindOne.mockResolvedValue(proposal);

    const result = await rejectProjectProposalService({
      proposalId: "proposal123",
      adminId: "admin123",
      collegeId: "college123",
      adminRemarks: "Please improve the problem statement",
    });

    expect(mockProjectProposalFindOne).toHaveBeenCalledWith({
      _id: "proposal123",
      college: "college123",
      status: "pending",
    });

    expect(proposal.status).toBe("rejected");
    expect(proposal.adminRemarks).toBe("Please improve the problem statement");
    expect(proposal.reviewedBy).toBe("admin123");
    expect(proposal.reviewedAt).toBeInstanceOf(Date);

    expect(proposal.save).toHaveBeenCalled();
    expect(result).toBe(proposal);
  });

  test("should throw error when pending proposal is not found", async () => {
    mockProjectProposalFindOne.mockResolvedValue(null);

    await expect(
      rejectProjectProposalService({
        proposalId: "proposal123",
        adminId: "admin123",
        collegeId: "college123",
        adminRemarks: "Rejected",
      }),
    ).rejects.toThrow("Pending project proposal not found");
  });
});

// ============================================================
// updateRejectedProjectProposalService
// ============================================================

describe("updateRejectedProjectProposalService", () => {
  test("should update rejected proposal without replacing PDF", async () => {
    const proposal = {
      _id: "proposal123",
      status: "rejected",
      title: "Old Title",
      team: {
        size: 2,
        members: [{ name: "Raja" }, { name: "Rahul" }],
      },
      abstractPdf: {
        url: "old-url",
        publicId: "old-public-id",
      },
      adminRemarks: "Please improve",
      reviewedBy: "admin123",
      reviewedAt: new Date(),
      save: jest.fn().mockResolvedValue(),
    };

    mockProjectProposalFindOne.mockResolvedValue(proposal);

    const result = await updateRejectedProjectProposalService({
      proposalId: "proposal123",
      userId: "user123",
      title: "Updated Title",
    });

    expect(proposal.title).toBe("Updated Title");

    expect(mockUploadToCloudinary).not.toHaveBeenCalled();
    expect(mockCloudinaryDestroy).not.toHaveBeenCalled();

    expect(proposal.status).toBe("pending");
    expect(proposal.adminRemarks).toBeNull();
    expect(proposal.reviewedBy).toBeNull();
    expect(proposal.reviewedAt).toBeNull();

    expect(proposal.save).toHaveBeenCalled();
    expect(result).toBe(proposal);
  });

  test("should replace PDF when a new PDF is provided", async () => {
    const proposal = {
      _id: "proposal123",
      status: "rejected",
      title: "Old Title",
      team: {
        size: 2,
        members: [{ name: "Raja" }, { name: "Rahul" }],
      },
      abstractPdf: {
        url: "old-url",
        publicId: "old-public-id",
      },
      save: jest.fn().mockResolvedValue(),
    };

    const newPdf = {
      buffer: Buffer.from("new pdf"),
    };

    const uploadedPdf = {
      url: "new-url",
      publicId: "new-public-id",
    };

    mockProjectProposalFindOne.mockResolvedValue(proposal);
    mockUploadToCloudinary.mockResolvedValue(uploadedPdf);
    mockCloudinaryDestroy.mockResolvedValue({
      result: "ok",
    });

    const result = await updateRejectedProjectProposalService({
      proposalId: "proposal123",
      userId: "user123",
      title: "Updated Title",
      abstractPdf: newPdf,
    });

    expect(mockUploadToCloudinary).toHaveBeenCalledWith(newPdf.buffer, {
      folder: "nexora/project-proposals",
      resourceType: "raw",
    });

    expect(mockCloudinaryDestroy).toHaveBeenCalledWith("old-public-id", {
      resource_type: "raw",
    });

    expect(proposal.abstractPdf).toEqual(uploadedPdf);

    expect(proposal.status).toBe("pending");
    expect(proposal.adminRemarks).toBeNull();
    expect(proposal.reviewedBy).toBeNull();
    expect(proposal.reviewedAt).toBeNull();

    expect(proposal.save).toHaveBeenCalled();
    expect(result).toBe(proposal);
  });

  test("should throw error when rejected proposal is not found", async () => {
    mockProjectProposalFindOne.mockResolvedValue(null);

    await expect(
      updateRejectedProjectProposalService({
        proposalId: "proposal123",
        userId: "user123",
        title: "Updated Title",
      }),
    ).rejects.toThrow("Rejected project proposal not found");
  });
});

// ============================================================
// deleteProjectProposalService
// ============================================================

describe("deleteProjectProposalService", () => {
  test("should delete a pending proposal and its PDF", async () => {
    const proposal = {
      _id: "proposal123",
      status: "pending",
      abstractPdf: {
        publicId: "proposal-pdf-123",
      },
      deleteOne: jest.fn().mockResolvedValue(),
    };

    mockProjectProposalFindOne.mockResolvedValue(proposal);
    mockCloudinaryDestroy.mockResolvedValue({
      result: "ok",
    });

    const result = await deleteProjectProposalService({
      proposalId: "proposal123",
      userId: "user123",
    });

    expect(mockProjectProposalFindOne).toHaveBeenCalledWith({
      _id: "proposal123",
      createdBy: "user123",
      status: {
        $in: ["pending", "rejected"],
      },
    });

    expect(mockCloudinaryDestroy).toHaveBeenCalledWith("proposal-pdf-123", {
      resource_type: "raw",
    });

    expect(proposal.deleteOne).toHaveBeenCalled();

    expect(result).toEqual({
      id: "proposal123",
    });
  });

  test("should throw error when proposal cannot be deleted", async () => {
    mockProjectProposalFindOne.mockResolvedValue(null);

    await expect(
      deleteProjectProposalService({
        proposalId: "proposal123",
        userId: "user123",
      }),
    ).rejects.toThrow("Project proposal not found or cannot be deleted");

    expect(mockCloudinaryDestroy).not.toHaveBeenCalled();
  });
});
