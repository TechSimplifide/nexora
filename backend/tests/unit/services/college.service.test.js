import { jest } from "@jest/globals";

const mockUserFindOne = jest.fn();
const mockUserCreate = jest.fn();
const mockGenerateTemporaryToken = jest.fn();

const mockCollegeFindOne = jest.fn();
const mockCollegeCreate = jest.fn();

const mockGenerateCollegeCode = jest.fn();
const mockSendVerificationEmail = jest.fn();

const mockStartSession = jest.fn();

const mockSession = {
  withTransaction: jest.fn(async (callback) => {
    return await callback();
  }),

  endSession: jest.fn(),
};

jest.unstable_mockModule("mongoose", () => ({
  default: {
    startSession: mockStartSession,
  },
}));

jest.unstable_mockModule("../../../src/models/user.model.js", () => ({
  User: Object.assign(
    jest.fn(() => ({
      generateTemporaryToken: mockGenerateTemporaryToken,
    })),
    {
      findOne: mockUserFindOne,
      create: mockUserCreate,
    },
  ),
}));

jest.unstable_mockModule("../../../src/models/college.model.js", () => ({
  College: {
    findOne: mockCollegeFindOne,
    create: mockCollegeCreate,
  },
}));

jest.unstable_mockModule("../../../src/utils/generateCollegeCode.js", () => ({
  default: mockGenerateCollegeCode,
}));

jest.unstable_mockModule("../../../src/services/email.service.js", () => ({
  sendVerificationEmail: mockSendVerificationEmail,
}));

const { registerCollegeService } =
  await import("../../../src/services/college.service.js");

describe("registerCollegeService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockStartSession.mockResolvedValue(mockSession);

    mockSession.withTransaction.mockImplementation(async (callback) => {
      return await callback();
    });
  });

  test("should register a college and admin successfully", async () => {
    mockUserFindOne.mockReturnValue({
      session: jest.fn().mockResolvedValue(null),
    });

    mockGenerateCollegeCode.mockReturnValue("NEX001");

    mockCollegeFindOne.mockReturnValue({
      session: jest.fn().mockResolvedValue(null),
    });

    mockGenerateTemporaryToken.mockReturnValue({
      unHashedToken: "plain-token",
      hashedToken: "hashed-token",
      tokenExpiry: Date.now() + 20 * 60 * 1000,
    });

    const mockCollege = {
      _id: "college123",
      name: "Nexora College",
      collegeCode: "NEX001",
    };

    const mockAdmin = {
      _id: "admin123",
      fullName: "John Doe",
      email: "admin@example.com",
      role: "admin",
      isVerified: false,
    };

    mockCollegeCreate.mockResolvedValue([mockCollege]);
    mockUserCreate.mockResolvedValue([mockAdmin]);

    mockSendVerificationEmail.mockResolvedValue(undefined);

    const result = await registerCollegeService({
      collegeName: "Nexora College",
      adminName: "John Doe",
      email: "admin@example.com",
      password: "password123",
    });

    expect(result).toEqual({
      college: mockCollege,
      admin: {
        id: "admin123",
        fullName: "John Doe",
        email: "admin@example.com",
        role: "admin",
        isVerified: false,
      },
    });

    expect(mockStartSession).toHaveBeenCalledTimes(1);

    expect(mockSession.withTransaction).toHaveBeenCalledTimes(1);

    expect(mockSession.endSession).toHaveBeenCalledTimes(1);

    expect(mockGenerateCollegeCode).toHaveBeenCalledWith("Nexora College");

    expect(mockCollegeCreate).toHaveBeenCalledWith(
      [
        {
          name: "Nexora College",
          collegeCode: "NEX001",
        },
      ],
      {
        session: mockSession,
      },
    );

    expect(mockUserCreate).toHaveBeenCalledWith(
      [
        {
          fullName: "John Doe",
          email: "admin@example.com",
          password: "password123",
          role: "admin",
          college: "college123",
          emailVerificationToken: "hashed-token",
          emailVerificationExpiry: expect.any(Number),
        },
      ],
      {
        session: mockSession,
      },
    );

    expect(mockSendVerificationEmail).toHaveBeenCalledWith({
      to: "admin@example.com",
      fullName: "John Doe",
      verificationUrl: expect.stringContaining("/verify-email/plain-token"),
    });
  });

  test("should throw error if admin email already exists", async () => {
    const existingUser = {
      _id: "existing123",
      email: "admin@example.com",
    };

    mockUserFindOne.mockReturnValue({
      session: jest.fn().mockResolvedValue(existingUser),
    });

    await expect(
      registerCollegeService({
        collegeName: "Nexora College",
        adminName: "John Doe",
        email: "admin@example.com",
        password: "password123",
      }),
    ).rejects.toThrow("A college account already exists");

    expect(mockGenerateCollegeCode).not.toHaveBeenCalled();
    expect(mockCollegeFindOne).not.toHaveBeenCalled();
    expect(mockCollegeCreate).not.toHaveBeenCalled();
    expect(mockUserCreate).not.toHaveBeenCalled();
    expect(mockSendVerificationEmail).not.toHaveBeenCalled();

    expect(mockSession.endSession).toHaveBeenCalledTimes(1);
  });

  test("should generate another college code if the first code already exists", async () => {
    mockUserFindOne.mockReturnValue({
      session: jest.fn().mockResolvedValue(null),
    });

    mockGenerateCollegeCode
      .mockReturnValueOnce("NEX001")
      .mockReturnValueOnce("NEX002");

    mockCollegeFindOne
      .mockReturnValueOnce({
        session: jest.fn().mockResolvedValue({
          _id: "existing-college",
          name: "Existing College",
          collegeCode: "NEX001",
        }),
      })
      .mockReturnValueOnce({
        session: jest.fn().mockResolvedValue(null),
      });

    mockGenerateTemporaryToken.mockReturnValue({
      unHashedToken: "plain-token",
      hashedToken: "hashed-token",
      tokenExpiry: Date.now() + 20 * 60 * 1000,
    });

    const mockCollege = {
      _id: "college123",
      name: "Nexora College",
      collegeCode: "NEX002",
    };

    const mockAdmin = {
      _id: "admin123",
      fullName: "John Doe",
      email: "admin@example.com",
      role: "admin",
      isVerified: false,
    };

    mockCollegeCreate.mockResolvedValue([mockCollege]);
    mockUserCreate.mockResolvedValue([mockAdmin]);

    mockSendVerificationEmail.mockResolvedValue(undefined);

    const result = await registerCollegeService({
      collegeName: "Nexora College",
      adminName: "John Doe",
      email: "admin@example.com",
      password: "password123",
    });

    expect(result.college.collegeCode).toBe("NEX002");

    expect(mockGenerateCollegeCode).toHaveBeenCalledTimes(2);

    expect(mockCollegeCreate).toHaveBeenCalledWith(
      [
        {
          name: "Nexora College",
          collegeCode: "NEX002",
        },
      ],
      {
        session: mockSession,
      },
    );
  });

  test("should register college even if verification email fails", async () => {
    mockUserFindOne.mockReturnValue({
      session: jest.fn().mockResolvedValue(null),
    });

    mockGenerateCollegeCode.mockReturnValue("NEX001");

    mockCollegeFindOne.mockReturnValue({
      session: jest.fn().mockResolvedValue(null),
    });

    mockGenerateTemporaryToken.mockReturnValue({
      unHashedToken: "plain-token",
      hashedToken: "hashed-token",
      tokenExpiry: Date.now() + 20 * 60 * 1000,
    });

    const mockCollege = {
      _id: "college123",
      name: "Nexora College",
      collegeCode: "NEX001",
    };

    const mockAdmin = {
      _id: "admin123",
      fullName: "John Doe",
      email: "admin@example.com",
      role: "admin",
      isVerified: false,
    };

    mockCollegeCreate.mockResolvedValue([mockCollege]);
    mockUserCreate.mockResolvedValue([mockAdmin]);

    mockSendVerificationEmail.mockRejectedValue(
      new Error("Email service unavailable"),
    );

    const result = await registerCollegeService({
      collegeName: "Nexora College",
      adminName: "John Doe",
      email: "admin@example.com",
      password: "password123",
    });

    expect(result).toEqual({
      college: mockCollege,
      admin: {
        id: "admin123",
        fullName: "John Doe",
        email: "admin@example.com",
        role: "admin",
        isVerified: false,
      },
    });

    expect(mockCollegeCreate).toHaveBeenCalledTimes(1);
    expect(mockUserCreate).toHaveBeenCalledTimes(1);
    expect(mockSendVerificationEmail).toHaveBeenCalledTimes(1);

    expect(mockSession.endSession).toHaveBeenCalledTimes(1);
  });

  test("should throw error if college creation fails", async () => {
    mockUserFindOne.mockReturnValue({
      session: jest.fn().mockResolvedValue(null),
    });

    mockGenerateCollegeCode.mockReturnValue("NEX001");

    mockCollegeFindOne.mockReturnValue({
      session: jest.fn().mockResolvedValue(null),
    });

    mockGenerateTemporaryToken.mockReturnValue({
      unHashedToken: "plain-token",
      hashedToken: "hashed-token",
      tokenExpiry: Date.now() + 20 * 60 * 1000,
    });

    mockCollegeCreate.mockRejectedValue(new Error("College creation failed"));

    await expect(
      registerCollegeService({
        collegeName: "Nexora College",
        adminName: "John Doe",
        email: "admin@example.com",
        password: "password123",
      }),
    ).rejects.toThrow("College creation failed");

    expect(mockUserCreate).not.toHaveBeenCalled();

    expect(mockSession.endSession).toHaveBeenCalledTimes(1);
  });

  test("should throw error if admin creation fails", async () => {
    mockUserFindOne.mockReturnValue({
      session: jest.fn().mockResolvedValue(null),
    });

    mockGenerateCollegeCode.mockReturnValue("NEX001");

    mockCollegeFindOne.mockReturnValue({
      session: jest.fn().mockResolvedValue(null),
    });

    mockGenerateTemporaryToken.mockReturnValue({
      unHashedToken: "plain-token",
      hashedToken: "hashed-token",
      tokenExpiry: Date.now() + 20 * 60 * 1000,
    });

    const mockCollege = {
      _id: "college123",
      name: "Nexora College",
      collegeCode: "NEX001",
    };

    mockCollegeCreate.mockResolvedValue([mockCollege]);

    mockUserCreate.mockRejectedValue(new Error("Admin creation failed"));

    await expect(
      registerCollegeService({
        collegeName: "Nexora College",
        adminName: "John Doe",
        email: "admin@example.com",
        password: "password123",
      }),
    ).rejects.toThrow("Admin creation failed");

    expect(mockCollegeCreate).toHaveBeenCalledTimes(1);

    expect(mockSession.endSession).toHaveBeenCalledTimes(1);
  });
});
