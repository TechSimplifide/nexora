import { jest } from "@jest/globals";

const mockRegisterCollegeService = jest.fn();

jest.unstable_mockModule("../../../src/services/email.service.js", () => ({
  sendVerificationEmail: jest.fn(),
  sendWelcomeEmail: jest.fn(),
}));

jest.unstable_mockModule("../../../src/services/college.service.js", () => ({
  registerCollegeService: mockRegisterCollegeService,
}));

const { default: app } = await import("../../../src/app.js");

import request from "supertest";

describe("College API", () => {
  describe("POST /api/v1/auth/college/register", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    test("should return validation error for invalid request", async () => {
      const response = await request(app)
        .post("/api/v1/auth/college/register")
        .send({});

      expect(response.status).toBe(400);

      expect(mockRegisterCollegeService).not.toHaveBeenCalled();
    });

    test("should register a college successfully", async () => {
      mockRegisterCollegeService.mockResolvedValue({
        college: {
          _id: "college123",
          name: "Nexora College",
          collegeCode: "NEX001",
        },
        admin: {
          id: "admin123",
          fullName: "John Doe",
          email: "admin@gmail.com",
          role: "admin",
          isVerified: false,
        },
      });

      const response = await request(app)
        .post("/api/v1/auth/college/register")
        .send({
          collegeName: "Nexora College",
          adminName: "John Doe",
          email: "admin@gmail.com",
          password: "password123",
        });

      expect(response.status).toBe(201);

      expect(response.body.message).toBe(
        "College registered successfully. Please check your email to verify the account.",
      );

      expect(response.body.data).toEqual({
        collegeCode: "NEX001",
        admin: {
          id: "admin123",
          fullName: "John Doe",
          email: "admin@gmail.com",
          role: "admin",
          isVerified: false,
        },
      });

      expect(mockRegisterCollegeService).toHaveBeenCalledWith({
        collegeName: "Nexora College",
        adminName: "John Doe",
        email: "admin@gmail.com",
        password: "password123",
      });
    });
  });
});
