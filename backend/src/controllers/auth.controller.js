import asyncHandler from "../utils/async-handler.js";
import ApiResponse from "../utils/api-response.js";

import {
  loginService,
  refreshTokenService,
  logoutService,
  getCurrentUserService,
  registerStudentService,
  verifyEmailService,
  resendVerificationEmailService,
} from "../services/auth.service.js";

import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../constants/cookieOptions.js";

export const registerStudent = asyncHandler(async (req, res) => {
  const student = await registerStudentService(req.body);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        student,
        "Student registered successfully. Please check your email to verify your account.",
      ),
    );
});

export const loginUser = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await loginService(req.body);

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...accessTokenCookieOptions,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .cookie("refreshToken", refreshToken, {
      ...refreshTokenCookieOptions,
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    })
    .json(new ApiResponse(200, { user, accessToken }, "Login successful"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  const { user, accessToken, refreshToken } =
    await refreshTokenService(incomingRefreshToken);

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...accessTokenCookieOptions,
    })
    .cookie("refreshToken", refreshToken, {
      ...refreshTokenCookieOptions,
    })
    .json(
      new ApiResponse(200, { user }, "Access token refreshed successfully"),
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  await logoutService(req.user._id);

  return res
    .status(200)
    .clearCookie("accessToken", accessTokenCookieOptions)
    .clearCookie("refreshToken", refreshTokenCookieOptions)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await getCurrentUserService(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Current user fetched successfully"));
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  await verifyEmailService(token);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verified successfully"));
});

export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await resendVerificationEmailService(email);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Verification email sent successfully"));
});
