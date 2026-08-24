import asyncHandler from "../utils/async-handler.js";
import ApiResponse from "../utils/api-response.js";

import {
  getAdminDashboardAnalyticsService, getStudentDashboardService,
} from "../services/dashboard.service.js";

export const getAdminDashboardAnalytics = asyncHandler(async (req, res) => {
  const collegeId = req.user?.college;

  const analytics = await getAdminDashboardAnalyticsService(collegeId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        analytics,
        "Dashboard analytics fetched successfully",
      ),
    );
});

export const getStudentDashboard = asyncHandler(async (req, res) => {
  const studentId = req.user?._id;
  const collegeId = req.user?.college;

  const dashboard = await getStudentDashboardService(studentId, collegeId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, dashboard, "Student dashboard fetched successfully"),
    );
});