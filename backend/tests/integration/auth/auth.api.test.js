import { jest } from "@jest/globals";

const mockUserFindOne = jest.fn();
const mockUserCreate = jest.fn();
const mockGenerateTemporaryToken = jest.fn();
const mockUserFindById = jest.fn();
const mockCollegeFindOne = jest.fn();
const mockJwtVerify = jest.fn();
const mockUserFindByIdAndUpdate = jest.fn();

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify: mockJwtVerify,
  },
}));

jest.unstable_mockModule("../../../src/models/user.model.js", () => ({
  User: Object.assign(
    jest.fn(() => ({
      generateTemporaryToken: mockGenerateTemporaryToken,
    })),
    {
      findOne: mockUserFindOne,
      findById: mockUserFindById,
      findByIdAndUpdate: mockUserFindByIdAndUpdate,
      create: mockUserCreate,
    },
  ),
}));

jest.unstable_mockModule("../../../src/models/college.model.js", () => ({
  College: {
    findOne: mockCollegeFindOne,
  },
}));

jest.unstable_mockModule("../../../src/services/email.service.js", () => ({
  sendVerificationEmail: jest.fn(),
  sendWelcomeEmail: jest.fn(),
}));

const { default: app } = await import("../../../src/app.js");

import request from "supertest";

describe("Auth API", () => {
  describe("POST /api/v1/auth/student/register", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    test("should return validation error for invalid request", async () => {
      const response = await request(app)
        .post("/api/v1/auth/student/register")
        .send({});

      expect(response.status).toBe(400);
    });

    test("should register student successfully", async () => {
      mockUserFindOne.mockResolvedValue(null);

      mockCollegeFindOne.mockResolvedValue({
        _id: "college123",
        name: "Nexora College",
        collegeCode: "NEX001",
      });

      mockGenerateTemporaryToken.mockReturnValue({
        unHashedToken: "plain-token",
        hashedToken: "hashed-token",
        tokenExpiry: Date.now() + 20 * 60 * 1000,
      });

      mockUserCreate.mockResolvedValue({
        _id: "student123",
        fullName: "John Doe",
        email: "john@example.com",
        role: "student",
      });

      const response = await request(app)
        .post("/api/v1/auth/student/register")
        .send({
          fullName: "John Doe",
          email: "john@example.com",
          password: "password123",
          collegeCode: "NEX001",
        });

      expect(response.status).toBe(201);

      expect(response.body.message).toBe(
        "Student registered successfully. Please check your email to verify your account.",
      );

      expect(response.body.data).toEqual({
        id: "student123",
        fullName: "John Doe",
        email: "john@example.com",
        role: "student",
        college: {
          id: "college123",
          name: "Nexora College",
          collegeCode: "NEX001",
        },
      });
    });

    test("should return 409 if user already exists", async () => {
      mockUserFindOne.mockResolvedValue({
        _id: "existing123",
        email: "john@example.com",
      });

      const response = await request(app)
        .post("/api/v1/auth/student/register")
        .send({
          fullName: "John Doe",
          email: "john@example.com",
          password: "password123",
          collegeCode: "NEX001",
        });

      expect(response.status).toBe(409);

      expect(response.body.message).toBe("User already exists with this email");

      expect(mockCollegeFindOne).not.toHaveBeenCalled();
      expect(mockUserCreate).not.toHaveBeenCalled();
    });

    test("should return 404 if college code is invalid", async () => {
      mockUserFindOne.mockResolvedValue(null);

      mockCollegeFindOne.mockResolvedValue(null);

      const response = await request(app)
        .post("/api/v1/auth/student/register")
        .send({
          fullName: "John Doe",
          email: "john@example.com",
          password: "password123",
          collegeCode: "INVALID",
        });

      expect(response.status).toBe(404);

      expect(response.body.message).toBe("Invalid college code");

      expect(mockUserCreate).not.toHaveBeenCalled();
      expect(mockGenerateTemporaryToken).not.toHaveBeenCalled();
    });
  });
});

describe("POST /api/v1/auth/login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("should return validation error for invalid request", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({});

    expect(response.status).toBe(400);
  });

  test("should login user successfully", async () => {
    const mockLoginUser = {
      _id: "student123",
      fullName: "John Doe",
      email: "john@example.com",
      role: "student",
      college: "college123",
      isVerified: true,

      isPasswordCorrect: jest.fn().mockResolvedValue(true),

      generateAccessToken: jest.fn().mockReturnValue("access-token"),
      generateRefreshToken: jest.fn().mockReturnValue("refresh-token"),

      save: jest.fn().mockResolvedValue(undefined),
    };

    mockUserFindOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockLoginUser),
    });

    const response = await request(app).post("/api/v1/auth/login").send({
      email: "john@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);

    expect(response.body.message).toBe("Login successful");

    expect(response.body.data.user).toEqual({
      id: "student123",
      fullName: "John Doe",
      email: "john@example.com",
      role: "student",
      college: "college123",
    });

    expect(response.body.data.accessToken).toBe("access-token");

    expect(response.headers["set-cookie"]).toBeDefined();

    expect(mockLoginUser.isPasswordCorrect).toHaveBeenCalledWith("password123");

    expect(mockLoginUser.generateAccessToken).toHaveBeenCalledTimes(1);

    expect(mockLoginUser.generateRefreshToken).toHaveBeenCalledTimes(1);

    expect(mockLoginUser.save).toHaveBeenCalledWith({
      validateBeforeSave: false,
    });
  });

  test("should return 401 if user does not exist", async () => {
    mockUserFindOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    const response = await request(app).post("/api/v1/auth/login").send({
      email: "unknown@example.com",
      password: "password123",
    });

    expect(response.status).toBe(401);

    expect(response.body.message).toBe("Invalid email or password");
  });

  test("should return 401 if password is incorrect", async () => {
    const mockLoginUser = {
      isPasswordCorrect: jest.fn().mockResolvedValue(false),
    };

    mockUserFindOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockLoginUser),
    });

    const response = await request(app).post("/api/v1/auth/login").send({
      email: "john@example.com",
      password: "wrong-password",
    });

    expect(response.status).toBe(401);

    expect(response.body.message).toBe("Invalid email or password");

    expect(mockLoginUser.isPasswordCorrect).toHaveBeenCalledWith(
      "wrong-password",
    );
  });

  test("should return 403 if email is not verified", async () => {
    const mockLoginUser = {
      isVerified: false,
      isPasswordCorrect: jest.fn().mockResolvedValue(true),
    };

    mockUserFindOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockLoginUser),
    });

    const response = await request(app).post("/api/v1/auth/login").send({
      email: "john@example.com",
      password: "password123",
    });

    expect(response.status).toBe(403);

    expect(response.body.message).toBe("Please verify your email first.");

    expect(mockLoginUser.isPasswordCorrect).toHaveBeenCalledWith("password123");
  });
});

describe("POST /api/v1/auth/refresh-token", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("should return 401 if refresh token is missing", async () => {
    const response = await request(app).post("/api/v1/auth/refresh-token");

    expect(response.status).toBe(401);

    expect(response.body.message).toBe("Refresh token is required");
  });

  test("should refresh access token successfully", async () => {
    const mockRefreshUser = {
      _id: "student123",
      fullName: "John Doe",
      email: "john@example.com",
      role: "student",
      college: "college123",
      refreshToken: "old-refresh-token",

      generateAccessToken: jest.fn().mockReturnValue("new-access-token"),

      generateRefreshToken: jest.fn().mockReturnValue("new-refresh-token"),

      save: jest.fn().mockResolvedValue(undefined),
    };

    mockJwtVerify.mockReturnValue({
      _id: "student123",
    });

    mockUserFindById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockRefreshUser),
    });

    const response = await request(app)
      .post("/api/v1/auth/refresh-token")
      .set("Cookie", ["refreshToken=old-refresh-token"]);

    expect(response.status).toBe(200);

    expect(response.body.message).toBe("Access token refreshed successfully");

    expect(response.body.data.user).toEqual({
      id: "student123",
      fullName: "John Doe",
      email: "john@example.com",
      role: "student",
      college: "college123",
    });

    expect(response.headers["set-cookie"]).toBeDefined();

    expect(mockJwtVerify).toHaveBeenCalledWith(
      "old-refresh-token",
      process.env.REFRESH_TOKEN_SECRET,
    );

    expect(mockRefreshUser.generateAccessToken).toHaveBeenCalledTimes(1);

    expect(mockRefreshUser.generateRefreshToken).toHaveBeenCalledTimes(1);

    expect(mockRefreshUser.save).toHaveBeenCalledWith({
      validateBeforeSave: false,
    });
  });

  test("should return 401 for invalid refresh token", async () => {
    mockJwtVerify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const response = await request(app)
      .post("/api/v1/auth/refresh-token")
      .set("Cookie", ["refreshToken=invalid-token"]);

    expect(response.status).toBe(401);

    expect(response.body.message).toBe("Invalid or expired refresh token");

    expect(mockUserFindById).not.toHaveBeenCalled();
  });

  test("should return 401 if user does not exist", async () => {
    mockJwtVerify.mockReturnValue({
      _id: "unknown-user",
    });

    mockUserFindById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    const response = await request(app)
      .post("/api/v1/auth/refresh-token")
      .set("Cookie", ["refreshToken=valid-token"]);

    expect(response.status).toBe(401);

    expect(response.body.message).toBe("User not found");
  });

  test("should return 401 if refresh token does not match stored token", async () => {
    mockJwtVerify.mockReturnValue({
      _id: "student123",
    });

    mockUserFindById.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "student123",
        refreshToken: "different-token",
      }),
    });

    const response = await request(app)
      .post("/api/v1/auth/refresh-token")
      .set("Cookie", ["refreshToken=provided-token"]);

    expect(response.status).toBe(401);

    expect(response.body.message).toBe("Refresh token is invalid");
  });
});

describe("POST /api/v1/auth/logout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("should return 401 if user is not authenticated", async () => {
    const response = await request(app).post("/api/v1/auth/logout");

    expect(response.status).toBe(401);

    expect(response.body.message).toBe("Unauthorized request");
  });

  test("should logout user successfully", async () => {
    const mockUser = {
      _id: "student123",
    };

    mockJwtVerify.mockReturnValue({
      _id: "student123",
    });

    mockUserFindById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });

    const response = await request(app)
      .post("/api/v1/auth/logout")
      .set("Authorization", "Bearer valid-access-token");

    expect(response.status).toBe(200);

    expect(response.body.message).toBe("Logged out successfully");

    expect(response.body.data).toEqual({});

    expect(mockJwtVerify).toHaveBeenCalledWith(
      "valid-access-token",
      process.env.ACCESS_TOKEN_SECRET,
    );

    expect(mockUserFindByIdAndUpdate).toHaveBeenCalledWith("student123", {
      $unset: {
        refreshToken: 1,
      },
    });
  });
});

describe("GET /api/v1/auth/me", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("should return 401 if user is not authenticated", async () => {
    const response = await request(app).get("/api/v1/auth/me");

    expect(response.status).toBe(401);

    expect(response.body.message).toBe("Unauthorized request");
  });

  test("should return current user successfully", async () => {
    const mockUser = {
      _id: "student123",
      fullName: "John Doe",
      email: "john@example.com",
      role: "student",
      isVerified: true,
      avatar: {
        publicId: null,
        url: "https://placehold.co/200x200",
      },
      college: {
        _id: "college123",
        name: "Nexora College",
        collegeCode: "NEX001",
      },
    };

    // verifyJWT
    mockJwtVerify.mockReturnValue({
      _id: "student123",
    });

    // getCurrentUserService
    mockUserFindById
      .mockReturnValueOnce({
        select: jest.fn().mockResolvedValue(mockUser),
      })
      .mockReturnValueOnce({
        populate: jest.fn().mockResolvedValue(mockUser),
      });

    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", "Bearer valid-access-token");

    expect(response.status).toBe(200);

    expect(response.body.message).toBe("Current user fetched successfully");

    expect(response.body.data).toEqual({
      id: "student123",
      fullName: "John Doe",
      email: "john@example.com",
      role: "student",
      isVerified: true,
      avatar: {
        publicId: null,
        url: "https://placehold.co/200x200",
      },
      college: {
        id: "college123",
        name: "Nexora College",
        collegeCode: "NEX001",
      },
    });
  });
});

describe("GET /api/v1/auth/verify-email/:token", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("should return 400 for invalid or expired verification token", async () => {
    mockUserFindOne.mockReset();
    mockUserFindOne.mockResolvedValue(null);

    const response = await request(app).get(
      "/api/v1/auth/verify-email/invalid-token",
    );

    expect(response.status).toBe(400);

    expect(response.body.message).toBe("Invalid or expired verification link");

    expect(mockUserFindOne).toHaveBeenCalledTimes(1);
  });

  test("should verify email successfully", async () => {
    const mockUser = {
      _id: "student123",
      fullName: "John Doe",
      email: "john@example.com",
      isVerified: false,
      emailVerificationToken: "hashed-token",
      emailVerificationExpiry: Date.now() + 20 * 60 * 1000,

      save: jest.fn().mockResolvedValue(undefined),
    };

    mockUserFindOne.mockResolvedValue(mockUser);

    const response = await request(app).get(
      "/api/v1/auth/verify-email/plain-token",
    );

    expect(response.status).toBe(200);

    expect(response.body.message).toBe("Email verified successfully");

    expect(response.body.data).toEqual({});

    expect(mockUser.isVerified).toBe(true);

    expect(mockUser.emailVerificationToken).toBeUndefined();

    expect(mockUser.emailVerificationExpiry).toBeUndefined();

    expect(mockUser.save).toHaveBeenCalledWith({
      validateBeforeSave: false,
    });
  });
});

describe("POST /api/v1/auth/resend-verification-email", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("should return 400 for invalid request", async () => {
    const response = await request(app)
      .post("/api/v1/auth/resend-verification-email")
      .send({});

    expect(response.status).toBe(400);
  });

  test("should return 404 if user does not exist", async () => {
    mockUserFindOne.mockReset();
    mockUserFindOne.mockResolvedValue(null);

    const response = await request(app)
      .post("/api/v1/auth/resend-verification-email")
      .send({
        email: "unknown@example.com",
      });

    expect(response.status).toBe(404);

    expect(response.body.message).toBe("User not found");
  });

  test("should return 400 if email is already verified", async () => {
    mockUserFindOne.mockReset();

    mockUserFindOne.mockResolvedValue({
      isVerified: true,
    });

    const response = await request(app)
      .post("/api/v1/auth/resend-verification-email")
      .send({
        email: "john@example.com",
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe("Email is already verified");
  });

  test("should resend verification email successfully", async () => {
    const mockUser = {
      email: "john@example.com",
      fullName: "John Doe",
      isVerified: false,

      generateTemporaryToken: jest.fn().mockReturnValue({
        unHashedToken: "new-plain-token",
        hashedToken: "new-hashed-token",
        tokenExpiry: Date.now() + 20 * 60 * 1000,
      }),

      save: jest.fn().mockResolvedValue(undefined),
    };

    mockUserFindOne.mockReset();
    mockUserFindOne.mockResolvedValue(mockUser);

    const response = await request(app)
      .post("/api/v1/auth/resend-verification-email")
      .send({
        email: "john@example.com",
      });

    expect(response.status).toBe(200);

    expect(response.body.message).toBe("Verification email sent successfully");

    expect(response.body.data).toEqual({});

    expect(mockUser.generateTemporaryToken).toHaveBeenCalledTimes(1);

    expect(mockUser.emailVerificationToken).toBe("new-hashed-token");

    expect(mockUser.emailVerificationExpiry).toEqual(expect.any(Number));

    expect(mockUser.save).toHaveBeenCalledWith({
      validateBeforeSave: false,
    });
  });
});
