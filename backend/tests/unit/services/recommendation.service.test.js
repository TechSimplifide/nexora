import { jest } from "@jest/globals";

const mockGenerateContent = jest.fn();
const mockRecommendationCreate = jest.fn();
const mockSafeParse = jest.fn();
const mockRecommendationFind = jest.fn();
const mockRecommendationFindOneAndDelete = jest.fn();

jest.unstable_mockModule("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn(() => ({
    getGenerativeModel: jest.fn(() => ({
      generateContent: mockGenerateContent,
    })),
  })),
}));

jest.unstable_mockModule("../../../src/models/recommendation.model.js", () => ({
  Recommendation: {
    create: mockRecommendationCreate,
    find: mockRecommendationFind,
    findOneAndDelete: mockRecommendationFindOneAndDelete,
  },
}));

jest.unstable_mockModule(
  "../../../src/validators/recommendation-response.validator.js",
  () => ({
    recommendationResponseSchema: {
      safeParse: mockSafeParse,
    },
  }),
);

const {
  createProjectRecommendationService,
  getStudentRecommendationsService,
  deleteStudentRecommendationService,
} = await import("../../../src/services/recommendation.service.js");

describe("createProjectRecommendationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should generate and save a project recommendation successfully", async () => {
    const geminiRecommendation = {
      title: "Smart Campus Resource Management System",
      whyRecommended:
        "This project matches the student's skills and is suitable for a two-person intermediate team.",
      introduction:
        "A web platform that helps colleges manage and track shared academic resources.",
      problemStatement:
        "Students and staff often have difficulty finding and managing shared academic resources efficiently.",
      proposedSolution:
        "The system provides a centralized platform for tracking, requesting, and managing academic resources.",
      keyFeatures: [
        "Resource Management",
        "Request and Approval System",
        "Availability Tracking",
        "User Dashboard",
        "Usage Reports",
      ],
      technologies: ["React", "Node.js", "Express.js", "MongoDB"],
      expectedOutcome:
        "A functional web application that improves the organization and accessibility of shared academic resources.",
      conclusion:
        "The project provides a practical academic solution while demonstrating full-stack development skills.",
    };

    const savedRecommendation = {
      _id: "recommendation123",
      student: "student123",
      college: "college123",
      skills: ["JavaScript", "React", "Node.js", "MongoDB"],
      domain: "Education Technology",
      teamSize: 2,
      difficulty: "INTERMEDIATE",
      projectType: "INNOVATIVE",
      ...geminiRecommendation,
    };

    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify(geminiRecommendation),
      },
    });

    mockSafeParse.mockReturnValue({
      success: true,
      data: geminiRecommendation,
    });

    mockRecommendationCreate.mockResolvedValue(savedRecommendation);

    const result = await createProjectRecommendationService({
      studentId: "student123",
      collegeId: "college123",
      skills: ["JavaScript", "React", "Node.js", "MongoDB"],
      domain: "Education Technology",
      teamSize: 2,
      difficulty: "INTERMEDIATE",
      projectType: "INNOVATIVE",
    });

    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(mockSafeParse).toHaveBeenCalledWith(geminiRecommendation);

    expect(mockRecommendationCreate).toHaveBeenCalledWith({
      student: "student123",
      college: "college123",
      skills: ["JavaScript", "React", "Node.js", "MongoDB"],
      domain: "Education Technology",
      teamSize: 2,
      difficulty: "INTERMEDIATE",
      projectType: "INNOVATIVE",
      ...geminiRecommendation,
    });

    expect(result).toEqual(savedRecommendation);
  });

  test("should throw 503 when Gemini API fails", async () => {
    mockGenerateContent.mockRejectedValue(
      new Error("Gemini service unavailable"),
    );

    await expect(
      createProjectRecommendationService({
        studentId: "student123",
        collegeId: "college123",
        skills: ["JavaScript", "React"],
        domain: "Education Technology",
        teamSize: 2,
        difficulty: "INTERMEDIATE",
        projectType: "ACADEMIC",
      }),
    ).rejects.toMatchObject({
      statusCode: 503,
      message: "Project recommendation service is currently unavailable",
    });

    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(mockRecommendationCreate).not.toHaveBeenCalled();
  });

  test("should throw 502 when Gemini returns invalid JSON", async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => "This is not valid JSON",
      },
    });

    await expect(
      createProjectRecommendationService({
        studentId: "student123",
        collegeId: "college123",
        skills: ["JavaScript", "React"],
        domain: "Education Technology",
        teamSize: 2,
        difficulty: "INTERMEDIATE",
        projectType: "ACADEMIC",
      }),
    ).rejects.toMatchObject({
      statusCode: 502,
      message: "Invalid response received from recommendation service",
    });

    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(mockSafeParse).not.toHaveBeenCalled();
    expect(mockRecommendationCreate).not.toHaveBeenCalled();
  });
  test("should throw 502 when Gemini returns an invalid recommendation structure", async () => {
    const invalidRecommendation = {
      title: "Incomplete recommendation",
    };

    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify(invalidRecommendation),
      },
    });

    mockSafeParse.mockReturnValue({
      success: false,
      error: {
        issues: [
          {
            path: ["introduction"],
            message: "Introduction must be at least 50 characters",
          },
        ],
      },
    });

    await expect(
      createProjectRecommendationService({
        studentId: "student123",
        collegeId: "college123",
        skills: ["JavaScript", "React"],
        domain: "Education Technology",
        teamSize: 2,
        difficulty: "INTERMEDIATE",
        projectType: "ACADEMIC",
      }),
    ).rejects.toMatchObject({
      statusCode: 502,
      message: "Recommendation service returned an invalid response",
    });

    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(mockSafeParse).toHaveBeenCalledWith(invalidRecommendation);
    expect(mockRecommendationCreate).not.toHaveBeenCalled();
  });

  test("should propagate the error when recommendation creation fails", async () => {
    const geminiRecommendation = {
      title: "Smart Campus Resource Management System",
      whyRecommended:
        "This project matches the student's skills and is suitable for a two-person intermediate team.",
      introduction:
        "A web platform that helps colleges manage and track shared academic resources.",
      problemStatement:
        "Students and staff often have difficulty finding and managing shared academic resources efficiently.",
      proposedSolution:
        "The system provides a centralized platform for tracking, requesting, and managing academic resources.",
      keyFeatures: [
        "Resource Management",
        "Request and Approval System",
        "Availability Tracking",
      ],
      technologies: ["React", "Node.js", "MongoDB"],
      expectedOutcome:
        "A functional web application that improves the organization and accessibility of shared academic resources.",
      conclusion:
        "The project provides a practical academic solution while demonstrating full-stack development skills.",
    };

    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify(geminiRecommendation),
      },
    });

    mockSafeParse.mockReturnValue({
      success: true,
      data: geminiRecommendation,
    });

    const databaseError = new Error("Database connection failed");

    mockRecommendationCreate.mockRejectedValue(databaseError);

    await expect(
      createProjectRecommendationService({
        studentId: "student123",
        collegeId: "college123",
        skills: ["JavaScript", "React"],
        domain: "Education Technology",
        teamSize: 2,
        difficulty: "INTERMEDIATE",
        projectType: "ACADEMIC",
      }),
    ).rejects.toThrow("Database connection failed");

    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(mockSafeParse).toHaveBeenCalledWith(geminiRecommendation);
    expect(mockRecommendationCreate).toHaveBeenCalledTimes(1);
  });

  describe("getStudentRecommendationsService", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("should return recommendations belonging to the student", async () => {
      const recommendations = [
        {
          _id: "recommendation2",
          student: "student123",
          title: "Project Two",
          createdAt: new Date("2026-08-22T12:00:00Z"),
        },
        {
          _id: "recommendation1",
          student: "student123",
          title: "Project One",
          createdAt: new Date("2026-08-21T12:00:00Z"),
        },
      ];

      const sortMock = jest.fn().mockResolvedValue(recommendations);

      mockRecommendationFind.mockReturnValue({
        sort: sortMock,
      });

      const result = await getStudentRecommendationsService("student123");

      expect(mockRecommendationFind).toHaveBeenCalledWith({
        student: "student123",
      });

      expect(sortMock).toHaveBeenCalledWith({
        createdAt: -1,
      });

      expect(result).toEqual(recommendations);
    });
  });
  test("should propagate the error when fetching recommendations fails", async () => {
    const databaseError = new Error("Database connection failed");

    mockRecommendationFind.mockImplementation(() => {
      throw databaseError;
    });

    await expect(
      getStudentRecommendationsService("student123"),
    ).rejects.toThrow("Database connection failed");

    expect(mockRecommendationFind).toHaveBeenCalledWith({
      student: "student123",
    });
  });
});

describe("deleteStudentRecommendationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should delete the student's own recommendation successfully", async () => {
    const deletedRecommendation = {
      _id: "recommendation123",
      student: "student123",
      title: "Smart Campus Resource Management System",
    };

    mockRecommendationFindOneAndDelete.mockResolvedValue(deletedRecommendation);

    const result = await deleteStudentRecommendationService({
      recommendationId: "recommendation123",
      studentId: "student123",
    });

    expect(mockRecommendationFindOneAndDelete).toHaveBeenCalledWith({
      _id: "recommendation123",
      student: "student123",
    });

    expect(result).toEqual(deletedRecommendation);
  });
  test("should throw 404 when the recommendation is not found", async () => {
    mockRecommendationFindOneAndDelete.mockResolvedValue(null);

    await expect(
      deleteStudentRecommendationService({
        recommendationId: "recommendation999",
        studentId: "student123",
      }),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Recommendation not found",
    });

    expect(mockRecommendationFindOneAndDelete).toHaveBeenCalledWith({
      _id: "recommendation999",
      student: "student123",
    });
  });
  test("should propagate the error when deleting a recommendation fails", async () => {
    const databaseError = new Error("Database connection failed");

    mockRecommendationFindOneAndDelete.mockRejectedValue(databaseError);

    await expect(
      deleteStudentRecommendationService({
        recommendationId: "recommendation123",
        studentId: "student123",
      }),
    ).rejects.toThrow("Database connection failed");

    expect(mockRecommendationFindOneAndDelete).toHaveBeenCalledWith({
      _id: "recommendation123",
      student: "student123",
    });
  });
});
