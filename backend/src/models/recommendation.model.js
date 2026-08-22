import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },

    // Student recommendation inputs
    skills: {
      type: [String],
      required: true,
      validate: {
        validator: (skills) => Array.isArray(skills) && skills.length > 0,
        message: "At least one skill is required",
      },
    },

    domain: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    teamSize: {
      type: Number,
      required: true,
      min: 1,
      max: 2,
    },

    difficulty: {
      type: String,
      required: true,
      enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
    },

    projectType: {
      type: String,
      required: true,
      enum: ["ACADEMIC", "REAL_WORLD", "INNOVATIVE", "RESEARCH"],
    },

    // Gemini generated recommendation
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    whyRecommended: {
      type: String,
      required: true,
      trim: true,
    },

    introduction: {
      type: String,
      required: true,
      trim: true,
    },

    problemStatement: {
      type: String,
      required: true,
      trim: true,
    },

    proposedSolution: {
      type: String,
      required: true,
      trim: true,
    },

    keyFeatures: {
      type: [String],
      required: true,
      validate: {
        validator: (features) => Array.isArray(features) && features.length > 0,
        message: "At least one key feature is required",
      },
    },

    technologies: {
      type: [String],
      required: true,
      validate: {
        validator: (technologies) =>
          Array.isArray(technologies) && technologies.length > 0,
        message: "At least one technology is required",
      },
    },

    expectedOutcome: {
      type: String,
      required: true,
      trim: true,
    },

    conclusion: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Recommendation = mongoose.model(
  "Recommendation",
  recommendationSchema,
);
