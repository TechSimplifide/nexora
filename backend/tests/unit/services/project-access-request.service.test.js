import { jest } from "@jest/globals";

const mockProjectFindOne = jest.fn();

const mockAccessRequestFindOne = jest.fn();
const mockAccessRequestFind = jest.fn();
const mockAccessRequestFindById = jest.fn();
const mockAccessRequestCreate = jest.fn();
const mockAccessRequestDeleteOne = jest.fn();

jest.unstable_mockModule("../../../src/models/project.model.js", () => ({
  Project: {
    findOne: mockProjectFindOne,
  },
}));

jest.unstable_mockModule(
  "../../../src/models/project-access-request.model.js",
  () => ({
    ProjectAccessRequest: {
      findOne: mockAccessRequestFindOne,
      find: mockAccessRequestFind,
      findById: mockAccessRequestFindById,
      create: mockAccessRequestCreate,
      deleteOne: mockAccessRequestDeleteOne,
    },
  }),
);

const {
  createProjectAccessRequestService,
  getMyProjectAccessRequestsService,
  getProjectAccessRequestsService,
  approveProjectAccessRequestService,
  rejectProjectAccessRequestService,
  cancelProjectAccessRequestService,
} = await import("../../../src/services/project-access-request.service.js");

const projectId = "project123";
const studentId = "student123";
const ownerId = "owner123";
const collegeId = "college123";

const mockProject = {
  _id: projectId,
  createdBy: ownerId,
  college: collegeId,

  github: {
    url: "https://github.com/example/project",
    access: "protected",
  },

  deployedLink: {
    url: "https://example.vercel.app",
    access: "protected",
  },

  supportingDocument: {
    url: "https://cloudinary.com/document.pdf",
    access: "protected",
  },
};

const mockAccessRequest = {
  _id: "request123",
  project: projectId,
  requestedBy: studentId,
  resourceType: "github",
  status: "pending",
  respondedAt: null,
};

describe("Project Access Request Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should throw 404 if project does not exist", async () => {
    mockProjectFindOne.mockResolvedValue(null);

    await expect(
      createProjectAccessRequestService({
        projectId,
        requestedBy: studentId,
        collegeId,
        resourceType: "github",
      }),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Project not found",
    });

    expect(mockProjectFindOne).toHaveBeenCalledWith({
      _id: projectId,
      college: collegeId,
    });
  });

  test("should throw 400 if student requests access to their own project", async () => {
    mockProjectFindOne.mockResolvedValue({
      ...mockProject,
      createdBy: studentId,
    });

    await expect(
      createProjectAccessRequestService({
        projectId,
        requestedBy: studentId,
        collegeId,
        resourceType: "github",
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "You cannot request access to your own project",
    });
  });

  test("should throw 404 if GitHub resource does not exist", async () => {
    mockProjectFindOne.mockResolvedValue({
      ...mockProject,
      github: null,
    });

    await expect(
      createProjectAccessRequestService({
        projectId,
        requestedBy: studentId,
        collegeId,
        resourceType: "github",
      }),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "GitHub link not found",
    });
  });

  test("should throw 404 if deployed link does not exist", async () => {
    mockProjectFindOne.mockResolvedValue({
      ...mockProject,
      deployedLink: null,
    });

    await expect(
      createProjectAccessRequestService({
        projectId,
        requestedBy: studentId,
        collegeId,
        resourceType: "deployedLink",
      }),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Deployed link not found",
    });
  });

  test("should throw 404 if supporting document does not exist", async () => {
    mockProjectFindOne.mockResolvedValue({
      ...mockProject,
      supportingDocument: null,
    });

    await expect(
      createProjectAccessRequestService({
        projectId,
        requestedBy: studentId,
        collegeId,
        resourceType: "supportingDocument",
      }),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Supporting document not found",
    });
  });

  test("should throw 400 if resource is publicly accessible", async () => {
    mockProjectFindOne.mockResolvedValue({
      ...mockProject,
      github: {
        url: "https://github.com/example/project",
        access: "public",
      },
    });

    await expect(
      createProjectAccessRequestService({
        projectId,
        requestedBy: studentId,
        collegeId,
        resourceType: "github",
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "This resource is publicly accessible",
    });
  });

  test("should throw 409 if a pending request already exists", async () => {
    mockProjectFindOne.mockResolvedValue(mockProject);

    mockAccessRequestFindOne.mockResolvedValue({
      ...mockAccessRequest,
      status: "pending",
    });

    await expect(
      createProjectAccessRequestService({
        projectId,
        requestedBy: studentId,
        collegeId,
        resourceType: "github",
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "Access request already exists",
    });
  });

  test("should throw 409 if access has already been granted", async () => {
    mockProjectFindOne.mockResolvedValue(mockProject);

    mockAccessRequestFindOne.mockResolvedValue({
      ...mockAccessRequest,
      status: "approved",
    });

    await expect(
      createProjectAccessRequestService({
        projectId,
        requestedBy: studentId,
        collegeId,
        resourceType: "github",
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "Access has already been granted",
    });
  });

  test("should create a GitHub access request successfully", async () => {
    mockProjectFindOne.mockResolvedValue(mockProject);
    mockAccessRequestFindOne.mockResolvedValue(null);
    mockAccessRequestCreate.mockResolvedValue(mockAccessRequest);

    const result = await createProjectAccessRequestService({
      projectId,
      requestedBy: studentId,
      collegeId,
      resourceType: "github",
    });

    expect(result).toEqual(mockAccessRequest);

    expect(mockAccessRequestCreate).toHaveBeenCalledWith({
      project: projectId,
      requestedBy: studentId,
      resourceType: "github",
    });
  });

  test("should create a deployed link access request successfully", async () => {
    mockProjectFindOne.mockResolvedValue(mockProject);
    mockAccessRequestFindOne.mockResolvedValue(null);
    mockAccessRequestCreate.mockResolvedValue({
      ...mockAccessRequest,
      resourceType: "deployedLink",
    });

    const result = await createProjectAccessRequestService({
      projectId,
      requestedBy: studentId,
      collegeId,
      resourceType: "deployedLink",
    });

    expect(result.resourceType).toBe("deployedLink");
  });

  test("should create a supporting document access request successfully", async () => {
    mockProjectFindOne.mockResolvedValue(mockProject);
    mockAccessRequestFindOne.mockResolvedValue(null);
    mockAccessRequestCreate.mockResolvedValue({
      ...mockAccessRequest,
      resourceType: "supportingDocument",
    });

    const result = await createProjectAccessRequestService({
      projectId,
      requestedBy: studentId,
      collegeId,
      resourceType: "supportingDocument",
    });

    expect(result.resourceType).toBe("supportingDocument");
  });

  describe("getMyProjectAccessRequestsService", () => {
    test("should return user's project access requests successfully", async () => {
      const requests = [
        {
          ...mockAccessRequest,
          project: {
            _id: projectId,
            title: "Library Management System",
            summary: "Library Management System Web based",
            domain: "WEB",
            department: "IT",
            academicYear: "2026-27",
            createdBy: ownerId,
            college: collegeId,
          },
        },
      ];

      const lean = jest.fn().mockResolvedValue(requests);
      const sort = jest.fn().mockReturnValue({ lean });

      const populate = jest.fn().mockReturnValue({ sort });

      mockAccessRequestFind.mockReturnValue({
        populate,
      });

      const result = await getMyProjectAccessRequestsService({
        requestedBy: studentId,
        collegeId,
      });

      expect(result).toEqual(requests);

      expect(mockAccessRequestFind).toHaveBeenCalledWith({
        requestedBy: studentId,
      });

      expect(populate).toHaveBeenCalledWith({
        path: "project",
        select:
          "title summary domain department academicYear createdBy college",
        match: {
          college: collegeId,
        },
      });

      expect(sort).toHaveBeenCalledWith({
        createdAt: -1,
      });
    });

    test("should remove requests whose project is outside user's college", async () => {
      const requests = [
        {
          ...mockAccessRequest,
          project: {
            _id: projectId,
            title: "Valid Project",
          },
        },
        {
          ...mockAccessRequest,
          _id: "request456",
          project: null,
        },
      ];

      const lean = jest.fn().mockResolvedValue(requests);
      const sort = jest.fn().mockReturnValue({ lean });
      const populate = jest.fn().mockReturnValue({ sort });

      mockAccessRequestFind.mockReturnValue({
        populate,
      });

      const result = await getMyProjectAccessRequestsService({
        requestedBy: studentId,
        collegeId,
      });

      expect(result).toHaveLength(1);
      expect(result[0].project).not.toBeNull();
    });

    test("should return empty array when no access requests exist", async () => {
      const lean = jest.fn().mockResolvedValue([]);
      const sort = jest.fn().mockReturnValue({ lean });
      const populate = jest.fn().mockReturnValue({ sort });

      mockAccessRequestFind.mockReturnValue({
        populate,
      });

      const result = await getMyProjectAccessRequestsService({
        requestedBy: studentId,
        collegeId,
      });

      expect(result).toEqual([]);
    });
  });

  describe("getProjectAccessRequestsService", () => {
    test("should return project access requests successfully", async () => {
      mockProjectFindOne.mockResolvedValue({
        ...mockProject,
        createdBy: ownerId,
      });

      const requests = [
        {
          ...mockAccessRequest,
          requestedBy: {
            _id: studentId,
            fullName: "Raja",
            username: "raja",
            email: "raja@example.com",
          },
        },
      ];

      const lean = jest.fn().mockResolvedValue(requests);
      const sort = jest.fn().mockReturnValue({ lean });

      const populate = jest.fn().mockReturnValue({ sort });

      mockAccessRequestFind.mockReturnValue({
        populate,
      });

      const result = await getProjectAccessRequestsService({
        projectId,
        userId: ownerId,
        collegeId,
      });

      expect(result).toEqual(requests);

      expect(mockProjectFindOne).toHaveBeenCalledWith({
        _id: projectId,
        createdBy: ownerId,
        college: collegeId,
      });

      expect(mockAccessRequestFind).toHaveBeenCalledWith({
        project: projectId,
      });

      expect(populate).toHaveBeenCalledWith(
        "requestedBy",
        "fullName username email",
      );

      expect(sort).toHaveBeenCalledWith({
        createdAt: -1,
      });
    });

    test("should throw 404 if user does not own the project", async () => {
      mockProjectFindOne.mockResolvedValue(null);

      await expect(
        getProjectAccessRequestsService({
          projectId,
          userId: studentId,
          collegeId,
        }),
      ).rejects.toMatchObject({
        statusCode: 404,
        message:
          "Project not found or you do not have permission to view access requests",
      });

      expect(mockAccessRequestFind).not.toHaveBeenCalled();
    });

    test("should return empty array when project has no access requests", async () => {
      mockProjectFindOne.mockResolvedValue(mockProject);

      const lean = jest.fn().mockResolvedValue([]);
      const sort = jest.fn().mockReturnValue({ lean });
      const populate = jest.fn().mockReturnValue({ sort });

      mockAccessRequestFind.mockReturnValue({
        populate,
      });

      const result = await getProjectAccessRequestsService({
        projectId,
        userId: ownerId,
        collegeId,
      });

      expect(result).toEqual([]);
    });
  });

  describe("approveProjectAccessRequestService", () => {
    test("should throw 404 if access request does not exist", async () => {
      mockAccessRequestFindById.mockResolvedValue(null);

      await expect(
        approveProjectAccessRequestService({
          requestId: "request123",
          userId: ownerId,
          collegeId,
        }),
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Access request not found",
      });

      expect(mockProjectFindOne).not.toHaveBeenCalled();
    });

    test("should throw 404 if user does not own the project", async () => {
      mockAccessRequestFindById.mockResolvedValue(mockAccessRequest);
      mockProjectFindOne.mockResolvedValue(null);

      await expect(
        approveProjectAccessRequestService({
          requestId: "request123",
          userId: studentId,
          collegeId,
        }),
      ).rejects.toMatchObject({
        statusCode: 404,
        message:
          "Project not found or you do not have permission to approve this request",
      });
    });

    test("should throw 409 if access request is already approved", async () => {
      mockAccessRequestFindById.mockResolvedValue({
        ...mockAccessRequest,
        status: "approved",
      });

      mockProjectFindOne.mockResolvedValue(mockProject);

      await expect(
        approveProjectAccessRequestService({
          requestId: "request123",
          userId: ownerId,
          collegeId,
        }),
      ).rejects.toMatchObject({
        statusCode: 409,
        message: "Access request has already been approved",
      });
    });

    test("should throw 409 if access request is already rejected", async () => {
      mockAccessRequestFindById.mockResolvedValue({
        ...mockAccessRequest,
        status: "rejected",
      });

      mockProjectFindOne.mockResolvedValue(mockProject);

      await expect(
        approveProjectAccessRequestService({
          requestId: "request123",
          userId: ownerId,
          collegeId,
        }),
      ).rejects.toMatchObject({
        statusCode: 409,
        message: "Access request has already been rejected",
      });
    });

    test("should approve pending access request successfully", async () => {
      const save = jest.fn().mockResolvedValue();

      const request = {
        ...mockAccessRequest,
        status: "pending",
        respondedAt: null,
        save,
      };

      mockAccessRequestFindById.mockResolvedValue(request);
      mockProjectFindOne.mockResolvedValue(mockProject);

      const result = await approveProjectAccessRequestService({
        requestId: "request123",
        userId: ownerId,
        collegeId,
      });

      expect(result.status).toBe("approved");
      expect(result.respondedAt).toBeInstanceOf(Date);

      expect(save).toHaveBeenCalledTimes(1);
    });
  });

  describe("rejectProjectAccessRequestService", () => {
    test("should throw 404 if access request does not exist", async () => {
      mockAccessRequestFindById.mockResolvedValue(null);

      await expect(
        rejectProjectAccessRequestService({
          requestId: "request123",
          userId: ownerId,
          collegeId,
        }),
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Access request not found",
      });
    });

    test("should throw 404 if user does not own the project", async () => {
      mockAccessRequestFindById.mockResolvedValue(mockAccessRequest);
      mockProjectFindOne.mockResolvedValue(null);

      await expect(
        rejectProjectAccessRequestService({
          requestId: "request123",
          userId: studentId,
          collegeId,
        }),
      ).rejects.toMatchObject({
        statusCode: 404,
        message:
          "Project not found or you do not have permission to reject this request",
      });
    });

    test("should throw 409 if request has already been approved", async () => {
      mockAccessRequestFindById.mockResolvedValue({
        ...mockAccessRequest,
        status: "approved",
      });

      mockProjectFindOne.mockResolvedValue(mockProject);

      await expect(
        rejectProjectAccessRequestService({
          requestId: "request123",
          userId: ownerId,
          collegeId,
        }),
      ).rejects.toMatchObject({
        statusCode: 409,
        message: "Access request has already been approved",
      });
    });

    test("should reject pending access request successfully", async () => {
      const save = jest.fn().mockResolvedValue();

      const request = {
        ...mockAccessRequest,
        status: "pending",
        respondedAt: null,
        save,
      };

      mockAccessRequestFindById.mockResolvedValue(request);
      mockProjectFindOne.mockResolvedValue(mockProject);

      const result = await rejectProjectAccessRequestService({
        requestId: "request123",
        userId: ownerId,
        collegeId,
      });

      expect(result.status).toBe("rejected");
      expect(result.respondedAt).toBeInstanceOf(Date);

      expect(save).toHaveBeenCalledTimes(1);
    });
  });

  describe("cancelProjectAccessRequestService", () => {
    test("should throw 404 if access request does not exist", async () => {
      const populate = jest.fn().mockResolvedValue(null);

      mockAccessRequestFindOne.mockReturnValue({
        populate,
      });

      await expect(
        cancelProjectAccessRequestService({
          requestId: "request123",
          requestedBy: studentId,
          collegeId,
        }),
      ).rejects.toMatchObject({
        statusCode: 404,
        message:
          "Access request not found or you do not have permission to cancel it",
      });
    });
  });

  test("should throw 404 if project belongs to another college", async () => {
    const populate = jest.fn().mockResolvedValue({
      ...mockAccessRequest,
      project: {
        college: "anotherCollege",
      },
    });

    mockAccessRequestFindOne.mockReturnValue({
      populate,
    });

    await expect(
      cancelProjectAccessRequestService({
        requestId: "request123",
        requestedBy: studentId,
        collegeId,
      }),
    ).rejects.toMatchObject({
      statusCode: 404,
      message:
        "Access request not found or you do not have permission to cancel it",
    });

    expect(mockAccessRequestDeleteOne).not.toHaveBeenCalled();
  });

  test("should throw 409 if access request is already approved", async () => {
    const populate = jest.fn().mockResolvedValue({
      ...mockAccessRequest,
      status: "approved",
      project: {
        college: collegeId,
      },
    });

    mockAccessRequestFindOne.mockReturnValue({
      populate,
    });

    await expect(
      cancelProjectAccessRequestService({
        requestId: "request123",
        requestedBy: studentId,
        collegeId,
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "Cannot cancel an access request that has already been approved",
    });
  });

  test("should throw 409 if access request is already rejected", async () => {
    const populate = jest.fn().mockResolvedValue({
      ...mockAccessRequest,
      status: "rejected",
      project: {
        college: collegeId,
      },
    });

    mockAccessRequestFindOne.mockReturnValue({
      populate,
    });

    await expect(
      cancelProjectAccessRequestService({
        requestId: "request123",
        requestedBy: studentId,
        collegeId,
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "Cannot cancel an access request that has already been rejected",
    });
  });

  test("should cancel pending access request successfully", async () => {
    const populate = jest.fn().mockResolvedValue({
      ...mockAccessRequest,
      status: "pending",
      project: {
        college: collegeId,
      },
    });

    mockAccessRequestFindOne.mockReturnValue({
      populate,
    });

    mockAccessRequestDeleteOne.mockResolvedValue({
      acknowledged: true,
      deletedCount: 1,
    });

    const result = await cancelProjectAccessRequestService({
      requestId: "request123",
      requestedBy: studentId,
      collegeId,
    });

    expect(result.status).toBe("pending");

    expect(mockAccessRequestFindOne).toHaveBeenCalledWith({
      _id: "request123",
      requestedBy: studentId,
    });

    expect(mockAccessRequestDeleteOne).toHaveBeenCalledWith({
      _id: "request123",
    });
  });
});
