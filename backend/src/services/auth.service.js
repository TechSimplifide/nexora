import jwt from "jsonwebtoken";
import crypto from "crypto";

import { User } from "../models/user.model.js";
import { College } from "../models/college.model.js";

import ApiError from "../utils/api-error.js";
import { USER_ROLES } from "../constants/roles.js";
import { sendVerificationEmail, sendWelcomeEmail } from "./email.service.js";
import { isTemporaryEmail } from "../utils/email-validator.js";

const generateAndSaveTokens = async (user) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();

  await user.save({
    validateBeforeSave: false,
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const registerStudentService = async ({
  fullName,
  email,
  password,
  collegeCode,
}) => {
  // Check existing user
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  if (isTemporaryEmail(email)) {
    throw new ApiError(400, "Please use a valid email address to continue.");
  }

  // Find college

  const college = await College.findOne({ collegeCode });

  if (!college) {
    throw new ApiError(404, "Invalid college code");
  }

  // Generate verification token
  const { unHashedToken, hashedToken, tokenExpiry } =
    new User().generateTemporaryToken();

  // Create student
  const student = await User.create({
    fullName,
    email,
    password,
    role: USER_ROLES.STUDENT,
    college: college._id,

    emailVerificationToken: hashedToken,
    emailVerificationExpiry: tokenExpiry,
  });

  // Build verification URL
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${unHashedToken}`;

  // Send verification email
  try {
    await sendVerificationEmail({
      to: student.email,
      fullName: student.fullName,
      verificationUrl,
    });
  } catch (error) {
    console.error("Verification email failed:", error);
  }

  return {
    id: student._id,
    fullName: student.fullName,
    email: student.email,
    role: student.role,
    college: {
      id: college._id,
      name: college.name,
      collegeCode: college.collegeCode,
    },
  };
};

export const loginService = async ({ email, password }) => {
  // Find user with hidden fields
  const user = await User.findOne({ email }).select("+password +refreshToken");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Check password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  // We'll enable this after email verification is implemented

  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email first.");
  }

  const { accessToken, refreshToken } = await generateAndSaveTokens(user);

  return {
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      college: user.college,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshTokenService = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decodedToken._id).select("+refreshToken");

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  if (user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is invalid");
  }

  const { accessToken, refreshToken } = await generateAndSaveTokens(user);

  return {
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      college: user.college,
    },
    accessToken,
    refreshToken,
  };
};

export const logoutService = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    $unset: {
      refreshToken: 1,
    },
  });
};

export const getCurrentUserService = async (userId) => {
  const user = await User.findById(userId).populate(
    "college",
    "name collegeCode",
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    avatar: user.avatar,
    college: user.college
      ? {
          id: user.college._id,
          name: user.college.name,
          collegeCode: user.college.collegeCode,
        }
      : null,
  };
};

export const verifyEmailService = async (token) => {
  // Hash the incoming token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find the user
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired verification link");
  }

  // Mark verified
  user.isVerified = true;

  // Remove verification fields
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;

  await user.save({
    validateBeforeSave: false,
  });

  // Send welcome email
  try {
    await sendWelcomeEmail({
      to: user.email,
      fullName: user.fullName,
    });
  } catch (error) {
    console.error("Welcome email failed:", error);
  }

  return user;
};

export const resendVerificationEmailService = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isVerified) {
    throw new ApiError(400, "Email is already verified");
  }

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({
    validateBeforeSave: false,
  });

  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${unHashedToken}`;

  try {
    await sendVerificationEmail({
      to: user.email,
      fullName: user.fullName,
      verificationUrl,
    });
  } catch (error) {
    console.error("Verification email failed:", error);
  }
};
