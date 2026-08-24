import { jest } from "@jest/globals";
import { USER_ROLES } from "../../../src/constants/roles.js";

const mockUser = {
  countDocuments: jest.fn(),
};

const mockProject = {
  countDocuments: jest.fn(),
  aggregate: jest.fn(),
  find: jest.fn(),
};

const mockProjectProposal = {
  countDocuments: jest.fn(),
  aggregate: jest.fn(),
  findOne: jest.fn(),
};

const mockProjectAccessRequest = {
  countDocuments: jest.fn(),
};

jest.unstable_mockModule("../../../src/models/user.model.js", () => ({
  User: mockUser,
}));

jest.unstable_mockModule("../../../src/models/project.model.js", () => ({
  Project: mockProject,
}));

jest.unstable_mockModule(
  "../../../src/models/project-proposal.model.js",
  () => ({
    ProjectProposal: mockProjectProposal,
  }),
);

jest.unstable_mockModule(
  "../../../src/models/project-access-request.model.js",
  () => ({
    ProjectAccessRequest: mockProjectAccessRequest,
  }),
);

const { getAdminDashboardAnalyticsService, getStudentDashboardService } =
  await import("../../../src/services/dashboard.service.js");

describe("Dashboard Service", () => {
  const collegeId = "college-123";
  const studentId = "student-123";

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("getAdminDashboardAnalyticsService", () => {
    test("should return complete admin dashboard analytics", async () => {
      mockUser.countDocuments.mockResolvedValue(120);

      mockProject.countDocuments
        .mockResolvedValueOnce(75)
        .mockResolvedValueOnce(10);

      mockProjectProposal.countDocuments.mockResolvedValue(8);

      mockProject.aggregate
        .mockResolvedValueOnce([
          { academicYear: "2024-25", count: 20 },
          { academicYear: "2025-26", count: 55 },
        ])
        .mockResolvedValueOnce([
          { technology: "React", count: 30 },
          { technology: "Node.js", count: 25 },
        ])
        .mockResolvedValueOnce([
          { domain: "Web Development", count: 35 },
          { domain: "AI/ML", count: 20 },
        ]);

      mockProjectProposal.aggregate.mockResolvedValue([
        { status: "pending", count: 8 },
        { status: "approved", count: 20 },
        { status: "rejected", count: 5 },
      ]);

      const result = await getAdminDashboardAnalyticsService(collegeId);

      expect(result).toEqual({
        kpis: {
          totalStudents: 120,
          totalProjects: 75,
          pendingProposals: 8,
          featuredProjects: 10,
        },

        projectsByAcademicYear: [
          { academicYear: "2024-25", count: 20 },
          { academicYear: "2025-26", count: 55 },
        ],

        proposalOverview: {
          pending: 8,
          approved: 20,
          rejected: 5,
        },

        popularTechnologies: [
          { technology: "React", count: 30 },
          { technology: "Node.js", count: 25 },
        ],

        trendingDomains: [
          { domain: "Web Development", count: 35 },
          { domain: "AI/ML", count: 20 },
        ],
      });
    });

    test("should scope all analytics to the specified college", async () => {
      mockUser.countDocuments.mockResolvedValue(0);

      mockProject.countDocuments
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      mockProjectProposal.countDocuments.mockResolvedValue(0);

      mockProject.aggregate
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      mockProjectProposal.aggregate.mockResolvedValue([]);

      await getAdminDashboardAnalyticsService(collegeId);

      expect(mockUser.countDocuments).toHaveBeenCalledWith({
        college: collegeId,
        role: USER_ROLES.STUDENT,
      });

      expect(mockProject.countDocuments).toHaveBeenNthCalledWith(1, {
        college: collegeId,
      });

      expect(mockProject.countDocuments).toHaveBeenNthCalledWith(2, {
        college: collegeId,
        isFeatured: true,
      });

      expect(mockProjectProposal.countDocuments).toHaveBeenCalledWith({
        college: collegeId,
        status: "pending",
      });

      expect(mockProject.aggregate).toHaveBeenCalledTimes(3);

      for (const call of mockProject.aggregate.mock.calls) {
        const pipeline = call[0];

        expect(pipeline[0]).toEqual({
          $match: {
            college: collegeId,
          },
        });
      }

      expect(mockProjectProposal.aggregate).toHaveBeenCalledTimes(1);

      const proposalPipeline = mockProjectProposal.aggregate.mock.calls[0][0];

      expect(proposalPipeline[0]).toEqual({
        $match: {
          college: collegeId,
        },
      });
    });

    test("should return zero values when the college has no data", async () => {
      mockUser.countDocuments.mockResolvedValue(0);

      mockProject.countDocuments
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      mockProjectProposal.countDocuments.mockResolvedValue(0);

      mockProject.aggregate
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      mockProjectProposal.aggregate.mockResolvedValue([]);

      const result = await getAdminDashboardAnalyticsService(collegeId);

      expect(result).toEqual({
        kpis: {
          totalStudents: 0,
          totalProjects: 0,
          pendingProposals: 0,
          featuredProjects: 0,
        },

        projectsByAcademicYear: [],

        proposalOverview: {
          pending: 0,
          approved: 0,
          rejected: 0,
        },

        popularTechnologies: [],

        trendingDomains: [],
      });
    });

    test("should propagate database errors", async () => {
      const databaseError = new Error("Database error");

      mockUser.countDocuments.mockRejectedValue(databaseError);

      await expect(
        getAdminDashboardAnalyticsService(collegeId),
      ).rejects.toThrow("Database error");
    });
  });

  describe("getStudentDashboardService", () => {
    test("should return complete student dashboard", async () => {
      mockProject.countDocuments.mockResolvedValue(3);

      mockProjectAccessRequest.countDocuments
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(2);

      mockProjectProposal.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          _id: "proposal-123",
          title: "Smart Campus Management",
          team: {
            size: 4,
          },
          status: "pending",
          adminRemarks: null,
          createdAt: new Date("2026-01-01"),
          updatedAt: new Date("2026-01-02"),
        }),
      });

      const discoverProjects = [
        {
          _id: "project-4",
          title: "Library Management System",
          summary: "A library management platform",
          technologies: ["React", "Node.js", "MongoDB"],
          domain: "Web Development",
          department: "Computer Science",
          academicYear: "2025-26",
          isFeatured: true,
          createdAt: new Date("2026-01-01"),
        },
      ];

      const discoverProjectQuery = {
        select: jest.fn(),
        sort: jest.fn(),
        limit: jest.fn(),
      };

      discoverProjectQuery.select.mockReturnValue(discoverProjectQuery);
      discoverProjectQuery.sort.mockReturnValue(discoverProjectQuery);
      discoverProjectQuery.limit.mockResolvedValue(discoverProjects);

      const studentProjects = [
        { _id: "project-1" },
        { _id: "project-2" },
        { _id: "project-3" },
      ];

      const studentProjectQuery = {
        select: jest.fn(),
      };

      studentProjectQuery.select.mockResolvedValue(studentProjects);

      mockProject.find
        .mockReturnValueOnce(discoverProjectQuery)
        .mockReturnValueOnce(studentProjectQuery);

      const result = await getStudentDashboardService(studentId, collegeId);

      expect(result).toEqual({
        kpis: {
          projectContributions: 3,
          accessRequestsSent: 5,
          accessRequestsReceived: 2,
        },

        proposal: {
          exists: true,
          id: "proposal-123",
          title: "Smart Campus Management",
          teamSize: 4,
          status: "pending",
          adminRemarks: null,
          createdAt: new Date("2026-01-01"),
          updatedAt: new Date("2026-01-02"),
        },

        discoverProjects,
      });
    });

    test("should scope student data correctly", async () => {
      mockProject.countDocuments.mockResolvedValue(0);

      mockProjectAccessRequest.countDocuments
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      mockProjectProposal.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      const discoverProjectQuery = {
        select: jest.fn(),
        sort: jest.fn(),
        limit: jest.fn(),
      };

      discoverProjectQuery.select.mockReturnValue(discoverProjectQuery);
      discoverProjectQuery.sort.mockReturnValue(discoverProjectQuery);
      discoverProjectQuery.limit.mockResolvedValue([]);

      const studentProjectQuery = {
        select: jest.fn(),
      };

      studentProjectQuery.select.mockResolvedValue([]);

      mockProject.find
        .mockReturnValueOnce(discoverProjectQuery)
        .mockReturnValueOnce(studentProjectQuery);

      await getStudentDashboardService(studentId, collegeId);

      expect(mockProject.countDocuments).toHaveBeenCalledWith({
        createdBy: studentId,
      });

      expect(mockProjectProposal.findOne).toHaveBeenCalledWith({
        createdBy: studentId,
      });

      expect(mockProject.find).toHaveBeenNthCalledWith(1, {
        college: collegeId,
        createdBy: {
          $ne: studentId,
        },
      });

      expect(mockProject.find).toHaveBeenNthCalledWith(2, {
        createdBy: studentId,
      });

      expect(mockProjectAccessRequest.countDocuments).toHaveBeenNthCalledWith(
        1,
        {
          requestedBy: studentId,
        },
      );

      expect(mockProjectAccessRequest.countDocuments).toHaveBeenNthCalledWith(
        2,
        {
          project: {
            $in: [],
          },
        },
      );
    });

    test("should return empty proposal when student has no proposal", async () => {
      mockProject.countDocuments.mockResolvedValue(0);

      mockProjectAccessRequest.countDocuments
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      mockProjectProposal.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      const discoverProjectQuery = {
        select: jest.fn(),
        sort: jest.fn(),
        limit: jest.fn(),
      };

      discoverProjectQuery.select.mockReturnValue(discoverProjectQuery);
      discoverProjectQuery.sort.mockReturnValue(discoverProjectQuery);
      discoverProjectQuery.limit.mockResolvedValue([]);

      const studentProjectQuery = {
        select: jest.fn(),
      };

      studentProjectQuery.select.mockResolvedValue([]);

      mockProject.find
        .mockReturnValueOnce(discoverProjectQuery)
        .mockReturnValueOnce(studentProjectQuery);

      const result = await getStudentDashboardService(studentId, collegeId);

      expect(result).toEqual({
        kpis: {
          projectContributions: 0,
          accessRequestsSent: 0,
          accessRequestsReceived: 0,
        },

        proposal: {
          exists: false,
        },

        discoverProjects: [],
      });
    });

    test("should propagate database errors", async () => {
      const databaseError = new Error("Database error");

      /*
       * The service starts several operations inside Promise.all().
       * Only Project.countDocuments() should fail.
       * All other operations must therefore be mocked successfully.
       */
      mockProject.countDocuments.mockRejectedValue(databaseError);

      mockProjectAccessRequest.countDocuments.mockResolvedValue(0);

      mockProjectProposal.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      const discoverProjectQuery = {
        select: jest.fn(),
        sort: jest.fn(),
        limit: jest.fn(),
      };

      discoverProjectQuery.select.mockReturnValue(discoverProjectQuery);
      discoverProjectQuery.sort.mockReturnValue(discoverProjectQuery);
      discoverProjectQuery.limit.mockResolvedValue([]);

      mockProject.find.mockReturnValue(discoverProjectQuery);

      await expect(
        getStudentDashboardService(studentId, collegeId),
      ).rejects.toThrow("Database error");
    });
  });
});
