import { jest } from "@jest/globals";

const mockProjectFindOne = jest.fn();
const mockAccessRequestFindOne = jest.fn();

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
    },
  }),
);

const { getProjectResourceService } =
  await import("../../../src/services/project-resource.service.js");

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

describe("Project Resource Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================================================
  // Validation
  // ==================================================

  test("should throw 400 for invalid resource type", async () => {
    await expect(
      getProjectResourceService({
        projectId,
        resourceType: "invalidResource",
        userId: studentId,
        collegeId,
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Invalid resource type",
    });

    expect(mockProjectFindOne).not.toHaveBeenCalled();
    expect(mockAccessRequestFindOne).not.toHaveBeenCalled();
  });

  // ==================================================
  // Project
  // ==================================================

  test("should throw 404 if project does not exist", async () => {
    mockProjectFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    await expect(
      getProjectResourceService({
        projectId,
        resourceType: "github",
        userId: studentId,
        collegeId,
      }),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Project not found",
    });

    expect(mockProjectFindOne).toHaveBeenCalledWith({
      _id: projectId,
      college: collegeId,
    });

    expect(mockAccessRequestFindOne).not.toHaveBeenCalled();
  });

  // ==================================================
  // Resource
  // ==================================================

  test("should throw 404 if requested resource does not exist", async () => {
    mockProjectFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        ...mockProject,
        github: null,
      }),
    });

    await expect(
      getProjectResourceService({
        projectId,
        resourceType: "github",
        userId: studentId,
        collegeId,
      }),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Resource not found",
    });

    expect(mockAccessRequestFindOne).not.toHaveBeenCalled();
  });

  // ==================================================
  // Owner Access
  // ==================================================

  test("should grant owner access without an access request", async () => {
    mockProjectFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockProject),
    });

    const result = await getProjectResourceService({
      projectId,
      resourceType: "github",
      userId: ownerId,
      collegeId,
    });

    expect(result).toEqual({
      resourceType: "github",
      url: mockProject.github.url,
      accessStatus: "owner",
    });

    expect(mockAccessRequestFindOne).not.toHaveBeenCalled();
  });

  // ==================================================
  // Public Resource
  // ==================================================

  test("should grant access to a public resource without an access request", async () => {
    const project = {
      ...mockProject,
      github: {
        ...mockProject.github,
        access: "public",
      },
    };

    mockProjectFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(project),
    });

    const result = await getProjectResourceService({
      projectId,
      resourceType: "github",
      userId: studentId,
      collegeId,
    });

    expect(result).toEqual({
      resourceType: "github",
      url: project.github.url,
      accessStatus: "public",
    });

    expect(mockAccessRequestFindOne).not.toHaveBeenCalled();
  });

  // ==================================================
  // Protected Resource
  // ==================================================

  test("should throw 403 when protected resource has no approved access request", async () => {
    mockProjectFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockProject),
    });

    mockAccessRequestFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    await expect(
      getProjectResourceService({
        projectId,
        resourceType: "github",
        userId: studentId,
        collegeId,
      }),
    ).rejects.toMatchObject({
      statusCode: 403,
      message: "You do not have access to this protected resource",
    });

    expect(mockAccessRequestFindOne).toHaveBeenCalledWith({
      project: projectId,
      requestedBy: studentId,
      resourceType: "github",
      status: "approved",
    });
  });

  test("should grant access when protected resource has an approved request", async () => {
    mockProjectFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockProject),
    });

    mockAccessRequestFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        _id: "request123",
        project: projectId,
        requestedBy: studentId,
        resourceType: "github",
        status: "approved",
      }),
    });

    const result = await getProjectResourceService({
      projectId,
      resourceType: "github",
      userId: studentId,
      collegeId,
    });

    expect(result).toEqual({
      resourceType: "github",
      url: mockProject.github.url,
      accessStatus: "approved",
    });
  });

  // ==================================================
  // Request Status
  // ==================================================

  test("should deny access when request is pending", async () => {
    mockProjectFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockProject),
    });

    mockAccessRequestFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    await expect(
      getProjectResourceService({
        projectId,
        resourceType: "github",
        userId: studentId,
        collegeId,
      }),
    ).rejects.toMatchObject({
      statusCode: 403,
      message: "You do not have access to this protected resource",
    });

    expect(mockAccessRequestFindOne).toHaveBeenCalledWith({
      project: projectId,
      requestedBy: studentId,
      resourceType: "github",
      status: "approved",
    });
  });

  test("should deny access when request is rejected", async () => {
    mockProjectFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockProject),
    });

    mockAccessRequestFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    await expect(
      getProjectResourceService({
        projectId,
        resourceType: "github",
        userId: studentId,
        collegeId,
      }),
    ).rejects.toMatchObject({
      statusCode: 403,
      message: "You do not have access to this protected resource",
    });
  });

  // ==================================================
  // ⭐ PER-RESOURCE ACCESS ISOLATION
  // ==================================================

  test("should allow GitHub access when only GitHub is approved", async () => {
    mockProjectFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockProject),
    });

    mockAccessRequestFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        _id: "github-request",
        project: projectId,
        requestedBy: studentId,
        resourceType: "github",
        status: "approved",
      }),
    });

    const result = await getProjectResourceService({
      projectId,
      resourceType: "github",
      userId: studentId,
      collegeId,
    });

    expect(result.accessStatus).toBe("approved");

    expect(mockAccessRequestFindOne).toHaveBeenCalledWith({
      project: projectId,
      requestedBy: studentId,
      resourceType: "github",
      status: "approved",
    });
  });

  test("should NOT allow deployed link access when only GitHub is approved", async () => {
    mockProjectFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockProject),
    });

    mockAccessRequestFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    await expect(
      getProjectResourceService({
        projectId,
        resourceType: "deployedLink",
        userId: studentId,
        collegeId,
      }),
    ).rejects.toMatchObject({
      statusCode: 403,
      message: "You do not have access to this protected resource",
    });

    expect(mockAccessRequestFindOne).toHaveBeenCalledWith({
      project: projectId,
      requestedBy: studentId,
      resourceType: "deployedLink",
      status: "approved",
    });
  });

  test("should NOT allow supporting document access when only GitHub is approved", async () => {
    mockProjectFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockProject),
    });

    mockAccessRequestFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    await expect(
      getProjectResourceService({
        projectId,
        resourceType: "supportingDocument",
        userId: studentId,
        collegeId,
      }),
    ).rejects.toMatchObject({
      statusCode: 403,
      message: "You do not have access to this protected resource",
    });

    expect(mockAccessRequestFindOne).toHaveBeenCalledWith({
      project: projectId,
      requestedBy: studentId,
      resourceType: "supportingDocument",
      status: "approved",
    });
  });

  // ==================================================
  // Different Resources
  // ==================================================

  test("should allow deployed link when deployed link request is approved", async () => {
    mockProjectFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockProject),
    });

    mockAccessRequestFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        project: projectId,
        requestedBy: studentId,
        resourceType: "deployedLink",
        status: "approved",
      }),
    });

    const result = await getProjectResourceService({
      projectId,
      resourceType: "deployedLink",
      userId: studentId,
      collegeId,
    });

    expect(result).toEqual({
      resourceType: "deployedLink",
      url: mockProject.deployedLink.url,
      accessStatus: "approved",
    });
  });

  test("should allow supporting document when supporting document request is approved", async () => {
    mockProjectFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockProject),
    });

    mockAccessRequestFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        project: projectId,
        requestedBy: studentId,
        resourceType: "supportingDocument",
        status: "approved",
      }),
    });

    const result = await getProjectResourceService({
      projectId,
      resourceType: "supportingDocument",
      userId: studentId,
      collegeId,
    });

    expect(result).toEqual({
      resourceType: "supportingDocument",
      url: mockProject.supportingDocument.url,
      accessStatus: "approved",
    });
  });

  // ==================================================
  // Security
  // ==================================================

  test("should deny access when another user's request is approved", async () => {
    mockProjectFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockProject),
    });

    mockAccessRequestFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    await expect(
      getProjectResourceService({
        projectId,
        resourceType: "github",
        userId: studentId,
        collegeId,
      }),
    ).rejects.toMatchObject({
      statusCode: 403,
      message: "You do not have access to this protected resource",
    });

    expect(mockAccessRequestFindOne).toHaveBeenCalledWith({
      project: projectId,
      requestedBy: studentId,
      resourceType: "github",
      status: "approved",
    });
  });

  test("should throw 403 when resource access value is invalid", async () => {
    mockProjectFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        ...mockProject,
        github: {
          url: mockProject.github.url,
          access: "invalid",
        },
      }),
    });

    await expect(
      getProjectResourceService({
        projectId,
        resourceType: "github",
        userId: studentId,
        collegeId,
      }),
    ).rejects.toMatchObject({
      statusCode: 403,
      message: "Access denied",
    });

    expect(mockAccessRequestFindOne).not.toHaveBeenCalled();
  });
});
