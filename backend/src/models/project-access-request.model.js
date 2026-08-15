import mongoose from "mongoose";

const projectAccessRequestSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resourceType: {
      type: String,
      enum: ["github", "deployedLink", "supportingDocument"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    respondedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const ProjectAccessRequest = mongoose.model(
  "ProjectAccessRequest",
  projectAccessRequestSchema,
);
