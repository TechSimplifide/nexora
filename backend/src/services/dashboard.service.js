import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { ProjectProposal } from "../models/project-proposal.model.js";
import { ProjectAccessRequest } from "../models/project-access-request.model.js";
import { USER_ROLES } from "../constants/roles.js";

export const getAdminDashboardAnalyticsService = async (collegeId) => {
  const [
    totalStudents,
    totalProjects,
    pendingProposals,
    featuredProjects,
    projectsByAcademicYear,
    proposalOverview,
    popularTechnologies,
    trendingDomains,
  ] = await Promise.all([
    // 1. Total students
    User.countDocuments({
      college: collegeId,
      role: USER_ROLES.STUDENT,
    }),

    // 2. Total projects
    Project.countDocuments({
      college: collegeId,
    }),

    // 3. Pending proposals
    ProjectProposal.countDocuments({
      college: collegeId,
      status: "pending",
    }),

    // 4. Featured projects
    Project.countDocuments({
      college: collegeId,
      isFeatured: true,
    }),

    // 5. Projects by academic year
    Project.aggregate([
      {
        $match: {
          college: collegeId,
        },
      },
      {
        $group: {
          _id: "$academicYear",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          academicYear: "$_id",
          count: 1,
        },
      },
      {
        $sort: {
          academicYear: 1,
        },
      },
    ]),

    // 6. Proposal overview
    ProjectProposal.aggregate([
      {
        $match: {
          college: collegeId,
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
    ]),

    // 7. Popular technologies
    Project.aggregate([
      {
        $match: {
          college: collegeId,
        },
      },
      {
        $unwind: "$technologies",
      },
      {
        $group: {
          _id: "$technologies",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          technology: "$_id",
          count: 1,
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 10,
      },
    ]),

    // 8. Trending domains
    Project.aggregate([
      {
        $match: {
          college: collegeId,
        },
      },
      {
        $group: {
          _id: "$domain",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          domain: "$_id",
          count: 1,
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 10,
      },
    ]),
  ]);

  return {
    kpis: {
      totalStudents,
      totalProjects,
      pendingProposals,
      featuredProjects,
    },

    projectsByAcademicYear,

    proposalOverview: {
      pending: 0,
      approved: 0,
      rejected: 0,
      ...Object.fromEntries(
        proposalOverview.map(({ status, count }) => [status, count]),
      ),
    },

    popularTechnologies,

    trendingDomains,
  };
};

export const getStudentDashboardService = async (studentId, collegeId) => {
  const [projectContributions, accessRequestsSent, proposal, discoverProjects] =
    await Promise.all([
      // 1. Project contributions
      Project.countDocuments({
        createdBy: studentId,
      }),

      // 2. Access requests sent
      ProjectAccessRequest.countDocuments({
        requestedBy: studentId,
      }),

      // 3. Student proposal
      ProjectProposal.findOne({
        createdBy: studentId,
      }).select("_id title team.size status adminRemarks createdAt updatedAt"),

      // 4. Discover projects
      Project.find({
        college: collegeId,
        createdBy: { $ne: studentId },
      })
        .select(
          "_id title summary technologies domain department academicYear isFeatured createdAt",
        )
        .sort({
          isFeatured: -1,
          createdAt: -1,
        })
        .limit(6),
    ]);

  const studentProjects = await Project.find({
    createdBy: studentId,
  }).select("_id");

  const studentProjectIds = studentProjects.map((project) => project._id);

  const accessRequestsReceived = await ProjectAccessRequest.countDocuments({
    project: { $in: studentProjectIds },
  });

  return {
    kpis: {
      projectContributions,
      accessRequestsSent,
      accessRequestsReceived,
    },

    proposal: proposal
      ? {
          exists: true,
          id: proposal._id,
          title: proposal.title,
          teamSize: proposal.team?.size,
          status: proposal.status,
          adminRemarks: proposal.adminRemarks,
          createdAt: proposal.createdAt,
          updatedAt: proposal.updatedAt,
        }
      : {
          exists: false,
        },

    discoverProjects,
  };
};
