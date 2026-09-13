import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    summary: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 500,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 50,
      maxlength: 5000,
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

    domain: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    department: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    academicYear: {
      type: String,
      required: true,
      trim: true,
      match: /^\d{4}-\d{2}$/,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    teamMembers: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },

        role: {
          type: String,
          trim: true,
        },
      },
    ],

    screenshots: [
      {
        url: {
          type: String,
          required: true,
        },

        publicId: {
          type: String,
          required: true,
        },
      },
    ],

    github: {
      url: {
        type: String,
        trim: true,
      },

      access: {
        type: String,
        enum: ["public", "protected"],
        default: "public",
      },
    },

    deployedLink: {
      url: {
        type: String,
        trim: true,
      },

      access: {
        type: String,
        enum: ["public", "protected"],
        default: "public",
      },
    },
    supportingDocument: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      url: {
        type: String,
        required: true,
      },

      publicId: {
        type: String,
        required: true,
      },

      access: {
        type: String,
        enum: ["public", "protected"],
        default: "public",
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Project = mongoose.model("Project", projectSchema);
