import mongoose, { Schema } from "mongoose";

const projectProposalSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 150,
    },

    team: {
      size: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
      },

      members: [
        {
          name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
          },
        },
      ],
    },

    abstractPdf: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    college: {
      type: Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    adminRemarks: {
      type: String,
      trim: true,
      default: null,
    },

    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const ProjectProposal = mongoose.model(
  "ProjectProposal",
  projectProposalSchema,
);
