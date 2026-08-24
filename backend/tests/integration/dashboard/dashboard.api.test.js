import { jest } from "@jest/globals";
import request from "supertest";

// --------------------------------------------------
// Mocks
// --------------------------------------------------

const mockUserFindById = jest.fn();
const mockJwtVerify = jest.fn();

const mockGetAdminDashboardAnalyticsService = jest.fn();
const mockGetStudentDashboardService = jest.fn();

jest.unstable_mockModule("../../../src/models/user.model.js", () => ({
  User: {
    findById: mockUserFindById,
  },
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify: mockJwtVerify,
  },
}));

jest.unstable_mockModule("../../../src/services/dashboard.service.js", () => ({
  getAdminDashboardAnalyticsService: mockGetAdminDashboardAnalyticsService,
  getStudentDashboardService: mockGetStudentDashboardService,
}));

const { default: app } = await import("../../../src/app.js");

// --------------------------------------------------
// Constants
// --------------------------------------------------

const AUTH_TOKEN = "valid-access-token";

// --------------------------------------------------
// Mock Users
// --------------------------------------------------

const studentUser = {
  _id: "student123",
  fullName: "Raja",
  email: "raja@example.com",
  role: "student",
  college: "college123",
};

const adminUser = {
  _id: "admin123",
  fullName: "Admin",
  email: "admin@example.com",
  role: "admin",
  college: "college123",
};

// --------------------------------------------------
// Mock Admin Dashboard Data
// --------------------------------------------------

const dashboardAnalytics = {
  kpis: {
    totalStudents: 2,
    totalProjects: 3,
    pendingProposals: 1,
    featuredProjects: 1,
  },

  projectsByAcademicYear: [
    {
      academicYear: "2026-27",
      count: 3,
    },
  ],

  proposalOverview: {
    pending: 1,
    approved: 1,
    rejected: 0,
  },

  popularTechnologies: [
    {
      technology: "Node.js",
      count: 3,
    },
    {
      technology: "React",
      count: 3,
    },
    {
      technology: "MongoDB",
      count: 2,
    },
    {
      technology: "Express.js",
      count: 2,
    },
    {
      technology: "NoSQL",
      count: 1,
    },
  ],

  trendingDomains: [
    {
      domain: "WEB",
      count: 3,
    },
  ],
};

// --------------------------------------------------
// Mock Student Dashboard Data
// --------------------------------------------------

const studentDashboard = {
  kpis: {
    projectContributions: 3,
    accessRequestsSent: 5,
    accessRequestsReceived: 2,
  },

  proposal: {
    exists: true,
    id: "proposal123",
    title: "Smart Campus Management",
    teamSize: 4,
    status: "pending",
    adminRemarks: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },

  discoverProjects: [
    {
      _id: "project123",
      title: "Library Management System",
      summary: "A library management platform",
      technologies: ["React", "Node.js", "MongoDB"],
      domain: "Web Development",
      department: "Computer Science",
      academicYear: "2025-26",
      isFeatured: true,
      createdAt: "2026-01-01T00:00:00.000Z",
    },
  ],
};

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const authenticateAs = (user) => {
  mockJwtVerify.mockReturnValue({
    _id: user._id,
  });

  mockUserFindById.mockReturnValue({
    select: jest.fn().mockResolvedValue(user),
  });
};

// --------------------------------------------------
// Tests
// --------------------------------------------------

describe("Dashboard API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================================================
  // GET ADMIN DASHBOARD
  // ==================================================

  describe("GET /api/v1/dashboard/admin", () => {
    test("should return 401 if admin is not authenticated", async () => {
      const response = await request(app).get("/api/v1/dashboard/admin");

      expect(response.status).toBe(401);

      expect(response.body.message).toBe("Unauthorized request");

      expect(mockGetAdminDashboardAnalyticsService).not.toHaveBeenCalled();
    });

    test("should return 403 if student tries to access admin dashboard", async () => {
      authenticateAs(studentUser);

      const response = await request(app)
        .get("/api/v1/dashboard/admin")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(403);

      expect(mockGetAdminDashboardAnalyticsService).not.toHaveBeenCalled();
    });

    test("should return admin dashboard analytics successfully", async () => {
      authenticateAs(adminUser);

      mockGetAdminDashboardAnalyticsService.mockResolvedValue(
        dashboardAnalytics,
      );

      const response = await request(app)
        .get("/api/v1/dashboard/admin")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.message).toBe(
        "Dashboard analytics fetched successfully",
      );

      expect(response.body.data).toEqual(dashboardAnalytics);

      expect(mockGetAdminDashboardAnalyticsService).toHaveBeenCalledWith(
        "college123",
      );
    });

    test("should return complete KPI data", async () => {
      authenticateAs(adminUser);

      mockGetAdminDashboardAnalyticsService.mockResolvedValue(
        dashboardAnalytics,
      );

      const response = await request(app)
        .get("/api/v1/dashboard/admin")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(200);

      expect(response.body.data.kpis).toEqual({
        totalStudents: 2,
        totalProjects: 3,
        pendingProposals: 1,
        featuredProjects: 1,
      });
    });

    test("should return all dashboard analytics sections", async () => {
      authenticateAs(adminUser);

      mockGetAdminDashboardAnalyticsService.mockResolvedValue(
        dashboardAnalytics,
      );

      const response = await request(app)
        .get("/api/v1/dashboard/admin")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(200);

      expect(response.body.data).toHaveProperty("kpis");

      expect(response.body.data).toHaveProperty("projectsByAcademicYear");

      expect(response.body.data).toHaveProperty("proposalOverview");

      expect(response.body.data).toHaveProperty("popularTechnologies");

      expect(response.body.data).toHaveProperty("trendingDomains");
    });

    test("should return zero analytics when college has no data", async () => {
      authenticateAs(adminUser);

      const emptyAnalytics = {
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
      };

      mockGetAdminDashboardAnalyticsService.mockResolvedValue(emptyAnalytics);

      const response = await request(app)
        .get("/api/v1/dashboard/admin")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(200);

      expect(response.body.data).toEqual(emptyAnalytics);
    });

    test("should return 500 if dashboard service fails", async () => {
      authenticateAs(adminUser);

      mockGetAdminDashboardAnalyticsService.mockRejectedValue(
        new Error("Database error"),
      );

      const response = await request(app)
        .get("/api/v1/dashboard/admin")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(500);

      expect(mockGetAdminDashboardAnalyticsService).toHaveBeenCalledWith(
        "college123",
      );
    });
  });

  // ==================================================
  // GET STUDENT DASHBOARD
  // ==================================================

  describe("GET /api/v1/dashboard/student", () => {
    test("should return 401 if student is not authenticated", async () => {
      const response = await request(app).get("/api/v1/dashboard/student");

      expect(response.status).toBe(401);

      expect(response.body.message).toBe("Unauthorized request");

      expect(mockGetStudentDashboardService).not.toHaveBeenCalled();
    });

    test("should return 403 if admin tries to access student dashboard", async () => {
      authenticateAs(adminUser);

      const response = await request(app)
        .get("/api/v1/dashboard/student")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(403);

      expect(mockGetStudentDashboardService).not.toHaveBeenCalled();
    });

    test("should return student dashboard successfully", async () => {
      authenticateAs(studentUser);

      mockGetStudentDashboardService.mockResolvedValue(studentDashboard);

      const response = await request(app)
        .get("/api/v1/dashboard/student")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.message).toBe(
        "Student dashboard fetched successfully",
      );

      expect(response.body.data).toEqual(studentDashboard);

      expect(mockGetStudentDashboardService).toHaveBeenCalledWith(
        "student123",
        "college123",
      );
    });

    test("should return complete student KPI data", async () => {
      authenticateAs(studentUser);

      mockGetStudentDashboardService.mockResolvedValue(studentDashboard);

      const response = await request(app)
        .get("/api/v1/dashboard/student")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(200);

      expect(response.body.data.kpis).toEqual({
        projectContributions: 3,
        accessRequestsSent: 5,
        accessRequestsReceived: 2,
      });
    });

    test("should return proposal data", async () => {
      authenticateAs(studentUser);

      mockGetStudentDashboardService.mockResolvedValue(studentDashboard);

      const response = await request(app)
        .get("/api/v1/dashboard/student")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(200);

      expect(response.body.data.proposal).toEqual(studentDashboard.proposal);
    });

    test("should return discover projects", async () => {
      authenticateAs(studentUser);

      mockGetStudentDashboardService.mockResolvedValue(studentDashboard);

      const response = await request(app)
        .get("/api/v1/dashboard/student")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(200);

      expect(response.body.data.discoverProjects).toEqual(
        studentDashboard.discoverProjects,
      );
    });

    test("should return empty proposal when student has no proposal", async () => {
      authenticateAs(studentUser);

      const dashboardWithoutProposal = {
        ...studentDashboard,

        proposal: {
          exists: false,
        },
      };

      mockGetStudentDashboardService.mockResolvedValue(
        dashboardWithoutProposal,
      );

      const response = await request(app)
        .get("/api/v1/dashboard/student")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(200);

      expect(response.body.data.proposal).toEqual({
        exists: false,
      });
    });

    test("should return 500 if student dashboard service fails", async () => {
      authenticateAs(studentUser);

      mockGetStudentDashboardService.mockRejectedValue(
        new Error("Database error"),
      );

      const response = await request(app)
        .get("/api/v1/dashboard/student")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(500);

      expect(mockGetStudentDashboardService).toHaveBeenCalledWith(
        "student123",
        "college123",
      );
    });
  });
});
