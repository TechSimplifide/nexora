import { User } from "../models/user.model.js";
import { College } from "../models/college.model.js";

import generateCollegeCode from "../utils/generateCollegeCode.js";
import ApiError from "../utils/api-error.js";
import { USER_ROLES } from "../constants/roles.js";
import { sendVerificationEmail } from "./email.service.js";

export const registerCollegeService = async ({
  collegeName,
  adminName,
  email,
  password,
}) => {
  // Check existing admin
  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  //   Generate unique college code

  let collegeCode;
  let existingCollege;

  do {
    collegeCode = generateCollegeCode(collegeName);

    existingCollege = await College.findOne({
      collegeCode,
    });
  } while (existingCollege);

  const { unHashedToken, hashedToken, tokenExpiry } =
    new User().generateTemporaryToken();

  //   Create college

  const college = await College.create({
    name: collegeName,
    collegeCode,
  });

  //   Create admin

  const admin = await User.create({
    fullName: adminName,
    email,
    password,
    role: USER_ROLES.ADMIN,
    college: college._id,
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: tokenExpiry,
  });

  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${unHashedToken}`;

  try {
    await sendVerificationEmail({
      to: admin.email,
      fullName: admin.fullName,
      verificationUrl,
    });
  } catch (error) {
    console.error("Verification email failed:", error);
  }

  return {
    college,
    admin: {
      id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
      isVerified: admin.isVerified,
    },
  };
};
