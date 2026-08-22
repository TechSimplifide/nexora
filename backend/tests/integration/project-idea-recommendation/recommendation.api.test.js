import { jest } from "@jest/globals";
import request from "supertest";

// --------------------------------------------------
// Mocks
// --------------------------------------------------

const mockRecommendationCreate = jest.fn();
const mockGenerateContent = jest.fn();

const mockUserFindById = jest.fn();
const mockJwtVerify = jest.fn();

jest.unstable_mockModule("../../../src/models/recommendation.model.js", () => ({
  Recommendation: {
    create: mockRecommendationCreate,
  },
}));

const mockGenerateRecommendation = jest.fn();
const mockGetStudentRecommendations = jest.fn();
const mockDeleteStudentRecommendation = jest.fn();

jest.unstable_mockModule("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn(() => ({
    getGenerativeModel: jest.fn(() => ({
      generateContent: mockGenerateContent,
    })),
  })),
}));

jest.unstable_mockModule("../../../src/models/user.model.js", () => ({
  User: {
    findById: mockUserFindById,
  },
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify: mockJwtVerify,
  },
}));

jest.unstable_mockModule(
  "../../../src/services/recommendation.service.js",
  () => ({
    createProjectRecommendationService: mockGenerateRecommendation,
    getStudentRecommendationsService: mockGetStudentRecommendations,
    deleteStudentRecommendationService: mockDeleteStudentRecommendation,
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
const adminUser = {
  _id: "admin123",
  fullName: "Admin",
  email: "admin@example.com",
  role: "admin",
  college: "college123",
};

const studentUser = {
  _id: "student123",
  fullName: "Raja",
  email: "raja@example.com",
  role: "student",
  college: "college123",
};

// --------------------------------------------------
// Mock Recommendation
// --------------------------------------------------

const recommendation = {
  _id: "recommendation123",
  student: "student123",
  college: "college123",

  skills: ["JavaScript", "React", "Node.js", "MongoDB"],
  domain: "Education Technology",
  teamSize: 2,
  difficulty: "INTERMEDIATE",
  projectType: "INNOVATIVE",

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

mockGenerateRecommendation.mockResolvedValue(recommendation);

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

describe("Recommendation API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================================================
  // CREATE RECOMMENDATION
  // ==================================================

  describe("POST /api/v1/recommendations", () => {
    test("should return 401 if student is not authenticated", async () => {
      const response = await request(app)
        .post("/api/v1/recommendations")
        .send({
          skills: ["JavaScript", "React"],
          domain: "Education Technology",
          teamSize: 2,
          difficulty: "INTERMEDIATE",
          projectType: "INNOVATIVE",
        });

      expect(response.status).toBe(401);

      expect(response.body.message).toBe("Unauthorized request");

      expect(mockGenerateContent).not.toHaveBeenCalled();
      expect(mockRecommendationCreate).not.toHaveBeenCalled();
    });

    test("should generate a project recommendation successfully", async () => {
      authenticateAs(studentUser);

      mockGenerateRecommendation.mockResolvedValue(recommendation);

      const response = await request(app)
        .post("/api/v1/recommendations")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`)
        .send({
          skills: ["JavaScript", "React", "Node.js", "MongoDB"],
          domain: "Education Technology",
          teamSize: 2,
          difficulty: "INTERMEDIATE",
          projectType: "INNOVATIVE",
        });

      expect(response.status).toBe(201);

      expect(response.body.success).toBe(true);

      expect(response.body.message).toBe(
        "Project recommendation generated successfully",
      );

      expect(response.body.data).toEqual(recommendation);

      expect(mockGenerateRecommendation).toHaveBeenCalledTimes(1);

      expect(mockGenerateRecommendation).toHaveBeenCalledWith({
        studentId: "student123",
        collegeId: "college123",
        skills: ["JavaScript", "React", "Node.js", "MongoDB"],
        domain: "Education Technology",
        teamSize: 2,
        difficulty: "INTERMEDIATE",
        projectType: "INNOVATIVE",
      });
    });

    test("should return 400 for invalid request body", async () => {
      authenticateAs(studentUser);

      const response = await request(app)
        .post("/api/v1/recommendations")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`)
        .send({
          skills: [],
          domain: "",
          teamSize: 11,
          difficulty: "INVALID",
          projectType: "INVALID",
        });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);

      expect(response.body.message).toBe("Validation failed");

      expect(mockGenerateRecommendation).not.toHaveBeenCalled();
    });

    test("should return 403 if admin tries to generate a recommendation", async () => {
      authenticateAs(adminUser);

      const response = await request(app)
        .post("/api/v1/recommendations")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`)
        .send({
          skills: ["JavaScript", "React"],
          domain: "Education Technology",
          teamSize: 2,
          difficulty: "INTERMEDIATE",
          projectType: "INNOVATIVE",
        });

      expect(response.status).toBe(403);

      expect(response.body.success).toBe(false);

      expect(mockGenerateRecommendation).not.toHaveBeenCalled();
    });
  });
});
