import mongoose, { Schema } from "mongoose";

const standardCriterionSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      enum: [
        "clear_problem",
        "problem_relevance",
        "scope_feasibility",
        "technical_depth",
        "originality",
        "solution_quality",
        "academic_value",
      ],
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    enabled: {
      type: Boolean,
      default: true,
    },

    required: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  },
);

const customCriterionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500,
    },

    enabled: {
      type: Boolean,
      default: true,
    },

    required: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const projectReviewCriteriaSchema = new Schema(
  {
    college: {
      type: Schema.Types.ObjectId,
      ref: "College",
      required: true,
      unique: true,
      index: true,
    },

    standardCriteria: {
      type: [standardCriterionSchema],
      default: [],
    },

    customCriteria: {
      type: [customCriterionSchema],
      default: [],
    },

    autoReview: {
      enabled: {
        type: Boolean,
        default: false,
      },

      confidenceThreshold: {
        type: Number,
        min: 0.5,
        max: 1,
        default: 0.9,
      },
    },
  },
  {
    timestamps: true,
  },
);

export const ProjectReviewCriteria = mongoose.model(
  "ProjectReviewCriteria",
  projectReviewCriteriaSchema,
);
