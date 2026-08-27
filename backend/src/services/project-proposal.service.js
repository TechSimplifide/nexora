import cloudinary from "../config/cloudinary.js";
import { ProjectProposal } from "../models/project-proposal.model.js";
import { uploadToCloudinary } from "../utils/cloudinary-upload.js";
import ApiError from "../utils/api-error.js";
import { User } from "../models/user.model.js";
import { createNotificationService } from "./notification.service.js";
import { NOTIFICATION_TYPES } from "../constants/notification-types.js";
import { USER_ROLES } from "../constants/roles.js";

export const createProjectProposalService = async ({
  title,
  team,
  abstractPdf,
  user,
}) => {
  if (!abstractPdf) {
    throw new ApiError(400, "Project abstract PDF is required");
  }

  const uploadedPdf = await uploadToCloudinary(abstractPdf.buffer, {
    folder: "nexora/project-proposals",
    resourceType: "image", 
  });

  const proposal = await ProjectProposal.create({
    title,
    team,

    abstractPdf: {
      url: uploadedPdf.url,
      publicId: uploadedPdf.publicId,
    },

    createdBy: user._id,
    college: user.college,

    status: "pending",
  });

  // Notify the admin about new proposal
  const collegeAdmin = await User.findOne({
    college: user.college,
    role: USER_ROLES.ADMIN,
  }).select("_id");

  if (collegeAdmin) {
    try {
      await createNotificationService({
        recipient: collegeAdmin._id,
        type: NOTIFICATION_TYPES.PROJECT_PROPOSAL_SUBMITTED,
        title: "New Project Proposal",
        message: `A new project proposal "${proposal.title}" has been submitted for review.`,
        relatedResource: proposal._id,
      });
    } catch (error) {
      console.error(`Failed to create proposal notification: ${error}`);
    }
  }

  return proposal;
};

export const getMyProjectProposalsService = async (userId) => {
  const proposals = await ProjectProposal.find({
    createdBy: userId,
  })
    .populate("college", "name collegeCode")
    .populate("reviewedBy", "fullName email")
    .sort({ createdAt: -1 });

  return proposals;
};

export const getPendingProjectProposalsService = async (collegeId) => {
  const proposals = await ProjectProposal.find({
    college: collegeId,
    status: "pending",
  })
    .populate("createdBy", "fullName email")
    .populate("college", "name collegeCode")
    .sort({ createdAt: 1 });

  return proposals;
};

export const approveProjectProposalService = async ({
  proposalId,
  adminId,
  collegeId,
}) => {
  const proposal = await ProjectProposal.findOne({
    _id: proposalId,
    college: collegeId,
    status: "pending",
  });

  if (!proposal) {
    throw new ApiError(404, "Pending project proposal not found");
  }

  proposal.status = "approved";
  proposal.reviewedBy = adminId;
  proposal.reviewedAt = new Date();
  proposal.adminRemarks = null;

  await proposal.save();

  // notify student about proposal approval
  try {
    await createNotificationService({
      recipient: proposal.createdBy,
      type: NOTIFICATION_TYPES.PROJECT_PROPOSAL_APPROVED,
      title: "Project Proposal Approved",
      message: `Your project proposal "${proposal.title}" has been approved by the college admin.`,
      relatedResource: proposal._id,
    });
  } catch (error) {
    console.error("Failed to create approval notification:", error);
  }

  return proposal;
};

export const rejectProjectProposalService = async ({
  proposalId,
  adminId,
  collegeId,
  adminRemarks,
}) => {
  const proposal = await ProjectProposal.findOne({
    _id: proposalId,
    college: collegeId,
    status: "pending",
  });

  if (!proposal) {
    throw new ApiError(404, "Pending project proposal not found");
  }

  proposal.status = "rejected";
  proposal.adminRemarks = adminRemarks;
  proposal.reviewedBy = adminId;
  proposal.reviewedAt = new Date();

  await proposal.save();

  // Notify student about proposal reject
  try {
    await createNotificationService({
      recipient: proposal.createdBy,
      type: NOTIFICATION_TYPES.PROJECT_PROPOSAL_REJECTED,
      title: "Project Proposal Rejected",
      message: `Your project proposal "${proposal.title}" has been rejected. Please review the admin's remarks and update your proposal.`,
      relatedResource: proposal._id,
    });
  } catch (error) {
    console.error("Failed to create rejection notification:", error);
  }

  return proposal;
};

export const updateRejectedProjectProposalService = async ({
  proposalId,
  userId,
  title,
  team,
  abstractPdf,
}) => {
  const proposal = await ProjectProposal.findOne({
    _id: proposalId,
    createdBy: userId,
    status: "rejected",
  });

  if (!proposal) {
    throw new ApiError(404, "Rejected project proposal not found");
  }

  // Update basic information
  if (title !== undefined) {
    proposal.title = title;
  }

  if (team !== undefined) {
    proposal.team = team;
  }

  // Upload new abstract if provided
  if (abstractPdf) {
    const uploadedPdf = await uploadToCloudinary(abstractPdf.buffer, {
      folder: "nexora/project-proposals",
      resourceType: "image", 
    });

    // Delete old PDF from Cloudinary
    try {
      await cloudinary.uploader.destroy(proposal.abstractPdf.publicId, {
        resource_type: "image", 
      });
    } catch (error) {
      console.error("Failed to delete old project proposal PDF:", error);
    }

    proposal.abstractPdf = {
      url: uploadedPdf.url,
      publicId: uploadedPdf.publicId,
    };
  }

  // Resubmit for admin review
  proposal.status = "pending";
  proposal.adminRemarks = null;
  proposal.reviewedBy = null;
  proposal.reviewedAt = null;

  await proposal.save();

  const collegeAdmin = await User.findOne({
    college: proposal.college,
    role: USER_ROLES.ADMIN,
  }).select("_id");

  if (collegeAdmin) {
    try {
      await createNotificationService({
        recipient: collegeAdmin._id,
        type: NOTIFICATION_TYPES.PROJECT_PROPOSAL_RESUBMITTED,
        title: "Project Proposal Resubmitted",
        message: `The project proposal "${proposal.title}" has been updated and resubmitted for review.`,
        relatedResource: proposal._id,
      });
    } catch (error) {
      console.error("Failed to create resubmission notification:", error);
    }
  }

  return proposal;
};

export const deleteProjectProposalService = async ({ proposalId, userId }) => {
  const proposal = await ProjectProposal.findOne({
    _id: proposalId,
    createdBy: userId,
    status: { $in: ["pending", "rejected"] },
  });

  if (!proposal) {
    throw new ApiError(404, "Project proposal not found or cannot be deleted");
  }

  // Delete the associated PDF from Cloudinary
  if (proposal.abstractPdf?.publicId) {
    try {
      await cloudinary.uploader.destroy(proposal.abstractPdf.publicId, {
        resource_type: "image", 
      });
    } catch (error) {
      console.error(
        "Failed to delete project proposal PDF from Cloudinary:",
        error,
      );
    }
  }

  await proposal.deleteOne();

  return {
    id: proposal._id,
  };
};
