import { jest } from "@jest/globals";

// --------------------------------------------------
// Mock functions
// --------------------------------------------------

const mockUserFindOne = jest.fn();
const mockUserCreate = jest.fn();
const mockGenerateTemporaryToken = jest.fn();
const mockUserSelect = jest.fn();
const mockCollegeFindOne = jest.fn();
const mockSendVerificationEmail = jest.fn();
const mockSendWelcomeEmail = jest.fn();
const mockJwtVerify = jest.fn();
const mockUserFindById = jest.fn();
const mockRefreshTokenSelect = jest.fn();
const mockUserFindByIdAndUpdate = jest.fn();

// --------------------------------------------------
// Test data
// --------------------------------------------------

const mockCollege = {
  _id: "college123",
  name: "Nexora College",
  collegeCode: "NEX001",
};

const mockStudent = {
  _id: "student123",
  fullName: "John Doe",
  email: "john@gmail.com",
  role: "student",
};

const mockRegistrationData = {
  fullName: "John Doe",
  email: "john@gmail.com",
  password: "password123",
  collegeCode: "NEX001",
};

const mockTemporaryToken = {
  unHashedToken: "plain-token",
  hashedToken: "hashed-token",
  tokenExpiry: Date.now() + 20 * 60 * 1000,
};

const mockLoginData = {
  email: "john@gmail.com",
  password: "password123",
};

const mockLoginUser = {
  _id: "student123",
  fullName: "John Doe",
  email: "john@gmail.com",
  role: "student",
  college: "college123",
  isVerified: true,

  isPasswordCorrect: jest.fn(),
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
  save: jest.fn(),
};

// --------------------------------------------------
// Module mocks
// -------------------------------------------------
jest.unstable_mockModule("../../../src/models/college.model.js", () => ({
  College: {
    findOne: mockCollegeFindOne,
  },
}));

jest.unstable_mockModule("../../../src/services/email.service.js", () => ({
  sendVerificationEmail: mockSendVerificationEmail,
  sendWelcomeEmail: mockSendWelcomeEmail,
  // sendWelcomeEmail: jest.fn(),
}));

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

// --------------------------------------------------
// Service under test
// --------------------------------------------------

const {
  registerStudentService,
  loginService,
  refreshTokenService,
  logoutService,
  getCurrentUserService,
  verifyEmailService,
  resendVerificationEmailService,
} = await import("../../../src/services/auth.service.js");

// --------------------------------------------------
// Test helpers
// --------------------------------------------------

const setupSuccessfulRegistration = () => {
  mockUserFindOne.mockResolvedValue(null);
  mockCollegeFindOne.mockResolvedValue(mockCollege);
  mockGenerateTemporaryToken.mockReturnValue(mockTemporaryToken);
  mockUserCreate.mockResolvedValue(mockStudent);
  mockSendVerificationEmail.mockResolvedValue(undefined);
};

describe("registerStudentService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLoginUser.isVerified = true;
  });

  test("should register a student successfully", async () => {
    setupSuccessfulRegistration();

    const result = await registerStudentService(mockRegistrationData);

    expect(result).toEqual({
      id: mockStudent._id,
      fullName: mockStudent.fullName,
      email: mockStudent.email,
      role: mockStudent.role,
      college: {
        id: mockCollege._id,
        name: mockCollege.name,
        collegeCode: mockCollege.collegeCode,
      },
    });

    expect(mockUserFindOne).toHaveBeenCalledWith({
      email: mockRegistrationData.email,
    });

    expect(mockCollegeFindOne).toHaveBeenCalledWith({
      collegeCode: mockRegistrationData.collegeCode,
    });

    expect(mockGenerateTemporaryToken).toHaveBeenCalledTimes(1);

    expect(mockUserCreate).toHaveBeenCalledWith({
      fullName: mockRegistrationData.fullName,
      email: mockRegistrationData.email,
      password: mockRegistrationData.password,
      role: "student",
      college: mockCollege._id,
      emailVerificationToken: mockTemporaryToken.hashedToken,
      emailVerificationExpiry: mockTemporaryToken.tokenExpiry,
    });

    expect(mockSendVerificationEmail).toHaveBeenCalledWith({
      to: mockStudent.email,
      fullName: mockStudent.fullName,
      verificationUrl: expect.stringContaining(
        `/verify-email/${mockTemporaryToken.unHashedToken}`,
      ),
    });
  });

  test("should throw error if user already exists", async () => {
    mockUserFindOne.mockResolvedValue({
      _id: "existing123",
      email: mockRegistrationData.email,
    });

    await expect(registerStudentService(mockRegistrationData)).rejects.toThrow(
      "A student account already exists",
    );

    expect(mockCollegeFindOne).not.toHaveBeenCalled();
    expect(mockUserCreate).not.toHaveBeenCalled();
  });

  test("should throw error if college code is invalid", async () => {
    mockUserFindOne.mockResolvedValue(null);
    mockCollegeFindOne.mockResolvedValue(null);

    await expect(registerStudentService(mockRegistrationData)).rejects.toThrow(
      "Invalid college code",
    );

    expect(mockGenerateTemporaryToken).not.toHaveBeenCalled();
    expect(mockUserCreate).not.toHaveBeenCalled();
    expect(mockSendVerificationEmail).not.toHaveBeenCalled();
  });

  test("should register student even if verification email fails", async () => {
    setupSuccessfulRegistration();

    mockSendVerificationEmail.mockRejectedValue(
      new Error("Email service unavailable"),
    );

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const result = await registerStudentService(mockRegistrationData);

    expect(result).toEqual({
      id: mockStudent._id,
      fullName: mockStudent.fullName,
      email: mockStudent.email,
      role: mockStudent.role,
      college: {
        id: mockCollege._id,
        name: mockCollege.name,
        collegeCode: mockCollege.collegeCode,
      },
    });

    expect(mockUserCreate).toHaveBeenCalledTimes(1);
    expect(mockSendVerificationEmail).toHaveBeenCalledTimes(1);

    consoleErrorSpy.mockRestore();
  });
});

describe("loginService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLoginUser.isVerified = true;
  });

  test("should login user successfully", async () => {
    mockUserSelect.mockResolvedValue(mockLoginUser);

    mockUserFindOne.mockReturnValue({
      select: mockUserSelect,
    });

    mockLoginUser.isPasswordCorrect.mockResolvedValue(true);

    mockLoginUser.generateAccessToken.mockReturnValue("access-token");

    mockLoginUser.generateRefreshToken.mockReturnValue("refresh-token");

    mockLoginUser.save.mockResolvedValue(mockLoginUser);

    const result = await loginService(mockLoginData);

    expect(result).toEqual({
      user: {
        id: "student123",
        fullName: "John Doe",
        email: "john@gmail.com",
        role: "student",
        college: "college123",
      },
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });
  });

  test("should throw error if user is not found", async () => {
    mockUserFindOne.mockReturnValue({
      select: mockUserSelect,
    });

    mockUserSelect.mockResolvedValue(null);

    await expect(
      loginService({
        email: "unknown@gmail.com",
        password: "password123",
      }),
    ).rejects.toThrow("Invalid email or password");

    expect(mockUserFindOne).toHaveBeenCalledWith({
      email: "unknown@gmail.com",
    });

    expect(mockUserSelect).toHaveBeenCalledWith("+password +refreshToken");
  });

  test("should throw error if password is incorrect", async () => {
    mockUserFindOne.mockReturnValue({
      select: mockUserSelect,
    });

    mockUserSelect.mockResolvedValue(mockLoginUser);

    mockLoginUser.isPasswordCorrect.mockResolvedValue(false);

    await expect(
      loginService({
        email: "john@gmail.com",
        password: "wrong-password",
      }),
    ).rejects.toThrow("Invalid email or password");

    expect(mockLoginUser.isPasswordCorrect).toHaveBeenCalledWith(
      "wrong-password",
    );

    expect(mockLoginUser.generateAccessToken).not.toHaveBeenCalled();
    expect(mockLoginUser.generateRefreshToken).not.toHaveBeenCalled();
  });

  test("should throw error if email is not verified", async () => {
    mockUserFindOne.mockReturnValue({
      select: mockUserSelect,
    });

    mockLoginUser.isVerified = false;

    mockUserSelect.mockResolvedValue(mockLoginUser);

    mockLoginUser.isPasswordCorrect.mockResolvedValue(true);

    await expect(
      loginService({
        email: "john@gmail.com",
        password: "password123",
      }),
    ).rejects.toThrow("Please verify your email first.");

    expect(mockLoginUser.isPasswordCorrect).toHaveBeenCalledWith("password123");

    expect(mockLoginUser.generateAccessToken).not.toHaveBeenCalled();
    expect(mockLoginUser.generateRefreshToken).not.toHaveBeenCalled();
  });
});

describe("refreshTokenService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should throw error if refresh token is missing", async () => {
    await expect(refreshTokenService()).rejects.toThrow(
      "Refresh token is required",
    );

    expect(mockJwtVerify).not.toHaveBeenCalled();
    expect(mockUserFindById).not.toHaveBeenCalled();
  });

  test("should throw error if refresh token is invalid or expired", async () => {
    mockJwtVerify.mockImplementation(() => {
      throw new Error("Token expired");
    });

    await expect(refreshTokenService("invalid-refresh-token")).rejects.toThrow(
      "Invalid or expired refresh token",
    );

    expect(mockJwtVerify).toHaveBeenCalledWith(
      "invalid-refresh-token",
      process.env.REFRESH_TOKEN_SECRET,
    );

    expect(mockUserFindById).not.toHaveBeenCalled();
  });

  test("should throw error if user is not found", async () => {
    mockJwtVerify.mockReturnValue({
      _id: "user123",
    });

    mockUserFindById.mockReturnValue({
      select: mockRefreshTokenSelect,
    });

    mockRefreshTokenSelect.mockResolvedValue(null);

    await expect(refreshTokenService("valid-refresh-token")).rejects.toThrow(
      "User not found",
    );

    expect(mockJwtVerify).toHaveBeenCalledWith(
      "valid-refresh-token",
      process.env.REFRESH_TOKEN_SECRET,
    );

    expect(mockUserFindById).toHaveBeenCalledWith("user123");

    expect(mockRefreshTokenSelect).toHaveBeenCalledWith("+refreshToken");
  });

  test("should throw error if refresh token does not match stored token", async () => {
    mockJwtVerify.mockReturnValue({
      _id: "user123",
    });

    const user = {
      _id: "user123",
      refreshToken: "stored-refresh-token",
    };

    mockUserFindById.mockReturnValue({
      select: mockRefreshTokenSelect,
    });

    mockRefreshTokenSelect.mockResolvedValue(user);

    await expect(
      refreshTokenService("different-refresh-token"),
    ).rejects.toThrow("Refresh token is invalid");

    expect(mockUserFindById).toHaveBeenCalledWith("user123");

    expect(mockRefreshTokenSelect).toHaveBeenCalledWith("+refreshToken");
  });

  test("should refresh tokens successfully", async () => {
    const user = {
      _id: "user123",
      fullName: "John Doe",
      email: "john@gmail.com",
      role: "student",
      college: "college123",
      refreshToken: "old-refresh-token",

      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      save: jest.fn(),
    };

    mockJwtVerify.mockReturnValue({
      _id: "user123",
    });

    mockUserFindById.mockReturnValue({
      select: mockRefreshTokenSelect,
    });

    mockRefreshTokenSelect.mockResolvedValue(user);

    user.generateAccessToken.mockReturnValue("new-access-token");
    user.generateRefreshToken.mockReturnValue("new-refresh-token");

    user.save.mockResolvedValue(user);

    const result = await refreshTokenService("old-refresh-token");

    expect(result).toEqual({
      user: {
        id: "user123",
        fullName: "John Doe",
        email: "john@gmail.com",
        role: "student",
        college: "college123",
      },
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    });

    expect(user.generateAccessToken).toHaveBeenCalledTimes(1);

    expect(user.generateRefreshToken).toHaveBeenCalledTimes(1);

    expect(user.refreshToken).toBe("new-refresh-token");

    expect(user.lastLogin).toBeInstanceOf(Date);

    expect(user.save).toHaveBeenCalledWith({
      validateBeforeSave: false,
    });
  });
});

describe("logoutService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should remove refresh token successfully", async () => {
    mockUserFindByIdAndUpdate.mockResolvedValue({
      _id: "user123",
    });

    await logoutService("user123");

    expect(mockUserFindByIdAndUpdate).toHaveBeenCalledWith("user123", {
      $unset: {
        refreshToken: 1,
      },
    });
  });
});

describe("getCurrentUserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should throw error if user is not found", async () => {
    mockUserFindById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    await expect(getCurrentUserService("user123")).rejects.toThrow(
      "User not found",
    );

    expect(mockUserFindById).toHaveBeenCalledWith("user123");
  });

  test("should return current user successfully", async () => {
    const user = {
      _id: "user123",
      fullName: "John Doe",
      email: "john@gmail.com",
      role: "student",
      isVerified: true,
      avatar: {
        publicId: null,
        url: "https://example.com/avatar.jpg",
      },
      college: {
        _id: "college123",
        name: "Nexora College",
        collegeCode: "NEX001",
      },
    };

    const mockPopulate = jest.fn().mockResolvedValue(user);

    mockUserFindById.mockReturnValue({
      populate: mockPopulate,
    });

    const result = await getCurrentUserService("user123");

    expect(result).toEqual({
      id: "user123",
      fullName: "John Doe",
      email: "john@gmail.com",
      role: "student",
      isVerified: true,
      avatar: {
        publicId: null,
        url: "https://example.com/avatar.jpg",
      },
      college: {
        id: "college123",
        name: "Nexora College",
        collegeCode: "NEX001",
      },
    });

    expect(mockUserFindById).toHaveBeenCalledWith("user123");

    expect(mockPopulate).toHaveBeenCalledWith("college", "name collegeCode");
  });

  test("should return null college if user has no college", async () => {
    const user = {
      _id: "user123",
      fullName: "John Doe",
      email: "john@gmail.com",
      role: "student",
      isVerified: true,
      avatar: {
        publicId: null,
        url: "https://example.com/avatar.jpg",
      },
      college: null,
    };

    const mockPopulate = jest.fn().mockResolvedValue(user);

    mockUserFindById.mockReturnValue({
      populate: mockPopulate,
    });

    const result = await getCurrentUserService("user123");

    expect(result.college).toBeNull();

    expect(result).toEqual({
      id: "user123",
      fullName: "John Doe",
      email: "john@gmail.com",
      role: "student",
      isVerified: true,
      avatar: {
        publicId: null,
        url: "https://example.com/avatar.jpg",
      },
      college: null,
    });
  });
});

describe("verifyEmailService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should throw error if verification token is invalid or expired", async () => {
    mockUserFindOne.mockResolvedValue(null);

    await expect(verifyEmailService("invalid-token")).rejects.toThrow(
      "Invalid or expired verification link",
    );

    expect(mockUserFindOne).toHaveBeenCalledWith({
      emailVerificationToken: expect.any(String),
      emailVerificationExpiry: {
        $gt: expect.any(Number),
      },
    });
  });

  test("should verify email successfully", async () => {
    const user = {
      _id: "user123",
      fullName: "John Doe",
      email: "john@gmail.com",
      isVerified: false,
      emailVerificationToken: "hashed-token",
      emailVerificationExpiry: Date.now() + 20 * 60 * 1000,
      save: jest.fn().mockResolvedValue(undefined),
    };

    mockUserFindOne.mockResolvedValue(user);
    mockSendWelcomeEmail.mockResolvedValue(undefined);

    const result = await verifyEmailService("plain-token");

    expect(result).toBe(user);

    expect(user.isVerified).toBe(true);

    expect(user.emailVerificationToken).toBeUndefined();

    expect(user.emailVerificationExpiry).toBeUndefined();

    expect(user.save).toHaveBeenCalledWith({
      validateBeforeSave: false,
    });

    expect(mockSendWelcomeEmail).toHaveBeenCalledWith({
      to: "john@gmail.com",
      fullName: "John Doe",
    });
  });

  test("should verify email even if welcome email fails", async () => {
    const user = {
      _id: "user123",
      fullName: "John Doe",
      email: "john@gmail.com",
      isVerified: false,
      emailVerificationToken: "hashed-token",
      emailVerificationExpiry: Date.now() + 20 * 60 * 1000,
      save: jest.fn().mockResolvedValue(undefined),
    };

    mockUserFindOne.mockResolvedValue(user);

    mockSendWelcomeEmail.mockRejectedValue(
      new Error("Email service unavailable"),
    );

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const result = await verifyEmailService("plain-token");

    expect(result).toBe(user);

    expect(user.isVerified).toBe(true);

    expect(user.emailVerificationToken).toBeUndefined();

    expect(user.emailVerificationExpiry).toBeUndefined();

    expect(user.save).toHaveBeenCalledWith({
      validateBeforeSave: false,
    });

    expect(mockSendWelcomeEmail).toHaveBeenCalledWith({
      to: "john@gmail.com",
      fullName: "John Doe",
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Welcome email failed:",
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });
});

describe("resendVerificationEmailService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should throw error if user is not found", async () => {
    mockUserFindOne.mockResolvedValue(null);

    await expect(
      resendVerificationEmailService("unknown@gmail.com"),
    ).rejects.toThrow("User not found");

    expect(mockUserFindOne).toHaveBeenCalledWith({
      email: "unknown@gmail.com",
    });

    expect(mockUserCreate).not.toHaveBeenCalled();
    expect(mockSendVerificationEmail).not.toHaveBeenCalled();
  });

  test("should throw error if email is already verified", async () => {
    const user = {
      _id: "user123",
      email: "john@gmail.com",
      isVerified: true,
    };

    mockUserFindOne.mockResolvedValue(user);

    await expect(
      resendVerificationEmailService("john@gmail.com"),
    ).rejects.toThrow("Email is already verified");

    expect(mockUserFindOne).toHaveBeenCalledWith({
      email: "john@gmail.com",
    });

    expect(mockGenerateTemporaryToken).not.toHaveBeenCalled();

    expect(mockSendVerificationEmail).not.toHaveBeenCalled();
  });

  test("should resend verification email successfully", async () => {
    const user = {
      _id: "user123",
      fullName: "John Doe",
      email: "john@gmail.com",
      isVerified: false,

      generateTemporaryToken: jest.fn(),
      save: jest.fn().mockResolvedValue(undefined),
    };

    user.generateTemporaryToken.mockReturnValue({
      unHashedToken: "new-plain-token",
      hashedToken: "new-hashed-token",
      tokenExpiry: Date.now() + 20 * 60 * 1000,
    });

    mockUserFindOne.mockResolvedValue(user);

    mockSendVerificationEmail.mockResolvedValue(undefined);

    await resendVerificationEmailService("john@gmail.com");

    expect(mockUserFindOne).toHaveBeenCalledWith({
      email: "john@gmail.com",
    });

    expect(user.generateTemporaryToken).toHaveBeenCalledTimes(1);

    expect(user.emailVerificationToken).toBe("new-hashed-token");

    expect(user.emailVerificationExpiry).toEqual(expect.any(Number));

    expect(user.save).toHaveBeenCalledWith({
      validateBeforeSave: false,
    });

    expect(mockSendVerificationEmail).toHaveBeenCalledWith({
      to: "john@gmail.com",
      fullName: "John Doe",
      verificationUrl: expect.stringContaining("/verify-email/new-plain-token"),
    });
  });

  test("should resend verification email even if email sending fails", async () => {
    const user = {
      _id: "user123",
      fullName: "John Doe",
      email: "john@gmail.com",
      isVerified: false,

      generateTemporaryToken: jest.fn(),
      save: jest.fn().mockResolvedValue(undefined),
    };

    user.generateTemporaryToken.mockReturnValue({
      unHashedToken: "new-plain-token",
      hashedToken: "new-hashed-token",
      tokenExpiry: Date.now() + 20 * 60 * 1000,
    });

    mockUserFindOne.mockResolvedValue(user);

    mockSendVerificationEmail.mockRejectedValue(
      new Error("Email service unavailable"),
    );

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await resendVerificationEmailService("john@gmail.com");

    expect(user.emailVerificationToken).toBe("new-hashed-token");

    expect(user.emailVerificationExpiry).toEqual(expect.any(Number));

    expect(user.save).toHaveBeenCalledWith({
      validateBeforeSave: false,
    });

    expect(mockSendVerificationEmail).toHaveBeenCalledTimes(1);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Verification email failed:",
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });
});
