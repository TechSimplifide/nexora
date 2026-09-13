import { User } from "../models/user.model.js";
import { College } from "../models/college.model.js";

import generateCollegeCode from "../utils/generateCollegeCode.js";
import { isAllowedPublicEmail } from "../utils/email-validator.js";
import ApiError from "../utils/api-error.js";
import { USER_ROLES } from "../constants/roles.js";
import { sendVerificationEmail } from "./email.service.js";
import mongoose from "mongoose";

export const registerCollegeService = async ({
  collegeName,
  adminName,
  email,
  password,
}) => {
  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      // 1. Check existing admin
      const existingUser = await User.findOne({ email }).session(session);

      if (existingUser) {
        throw new ApiError(409, "A college account already exists");
      }

      if (!isAllowedPublicEmail(email)) {
        throw new ApiError(400, "Please use a valid email address.");
      }

      // 2. Generate unique college code
      let collegeCode;
      let existingCollege;

      do {
        collegeCode = generateCollegeCode(collegeName);

        existingCollege = await College.findOne({
          collegeCode,
        }).session(session);
      } while (existingCollege);

      // 3. Generate email verification token
      const { unHashedToken, hashedToken, tokenExpiry } =
        new User().generateTemporaryToken();

      // 4. Create college
      const [college] = await College.create(
        [
          {
            name: collegeName,
            collegeCode,
          },
        ],
        { session },
      );

      // 5. Create admin
      const [admin] = await User.create(
        [
          {
            fullName: adminName,
            email,
            password,
            role: USER_ROLES.ADMIN,
            college: college._id,
            emailVerificationToken: hashedToken,
            emailVerificationExpiry: tokenExpiry,
          },
        ],
        { session },
      );

      result = {
        college,
        admin,
        unHashedToken,
      };
    });

    // Transaction has successfully committed at this point.

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${result.unHashedToken}`;

    // Email is intentionally OUTSIDE the transaction.
    try {
      await sendVerificationEmail({
        to: result.admin.email,
        fullName: result.admin.fullName,
        verificationUrl,
      });
    } catch (error) {
      console.error("Verification email failed:", error);
    }

    return {
      college: result.college,
      admin: {
        id: result.admin._id,
        fullName: result.admin.fullName,
        email: result.admin.email,
        role: result.admin.role,
        isVerified: result.admin.isVerified,
      },
    };
  } finally {
    await session.endSession();
  }
};
