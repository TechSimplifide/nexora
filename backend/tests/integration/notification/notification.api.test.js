import { jest } from "@jest/globals";
import request from "supertest";

// --------------------------------------------------
// Mocks
// --------------------------------------------------

const mockUserFindById = jest.fn();
const mockJwtVerify = jest.fn();

const mockGetMyNotificationsService = jest.fn();
const mockGetUnreadNotificationCountService = jest.fn();
const mockMarkNotificationAsReadService = jest.fn();
const mockMarkAllNotificationsAsReadService = jest.fn();
const mockDeleteNotificationService = jest.fn();

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

jest.unstable_mockModule(
  "../../../src/services/notification.service.js",
  () => ({
    getMyNotificationsService: mockGetMyNotificationsService,
    getUnreadNotificationCountService: mockGetUnreadNotificationCountService,
    markNotificationAsReadService: mockMarkNotificationAsReadService,
    markAllNotificationsAsReadService: mockMarkAllNotificationsAsReadService,
    deleteNotificationService: mockDeleteNotificationService,

    // createNotificationService is not used by these controllers,
    // but keeping the mock complete is useful.
    createNotificationService: jest.fn(),
  }),
);

const { default: ApiError } = await import("../../../src/utils/api-error.js");
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

const notification = {
  _id: "notification123",
  recipient: "student123",
  type: "PROJECT_PROPOSAL_APPROVED",
  title: "Project Proposal Approved",
  message: "Your project proposal has been approved.",
  relatedResource: "proposal123",
  isRead: false,
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

describe("Notification API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================================================
  // GET MY NOTIFICATIONS
  // ==================================================

  describe("GET /api/v1/notifications", () => {
    test("should return 401 if user is not authenticated", async () => {
      const response = await request(app).get("/api/v1/notifications");

      expect(response.status).toBe(401);

      expect(response.body.message).toBe("Unauthorized request");

      expect(mockGetMyNotificationsService).not.toHaveBeenCalled();
    });

    test("should return user's notifications", async () => {
      authenticateAs(studentUser);

      const notifications = [notification];

      mockGetMyNotificationsService.mockResolvedValue(notifications);

      const response = await request(app)
        .get("/api/v1/notifications")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(200);

      expect(response.body.message).toBe("Notifications fetched successfully");

      expect(response.body.data).toEqual(notifications);

      expect(mockGetMyNotificationsService).toHaveBeenCalledWith("student123");
    });
  });

  // ==================================================
  // GET UNREAD COUNT
  // ==================================================

  describe("GET /api/v1/notifications/unread-count", () => {
    test("should return 401 if user is not authenticated", async () => {
      const response = await request(app).get(
        "/api/v1/notifications/unread-count",
      );

      expect(response.status).toBe(401);

      expect(response.body.message).toBe("Unauthorized request");

      expect(mockGetUnreadNotificationCountService).not.toHaveBeenCalled();
    });

    test("should return unread notification count", async () => {
      authenticateAs(studentUser);

      mockGetUnreadNotificationCountService.mockResolvedValue(5);

      const response = await request(app)
        .get("/api/v1/notifications/unread-count")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(200);

      expect(response.body.message).toBe(
        "Unread notification count fetched successfully",
      );

      expect(response.body.data).toEqual({
        count: 5,
      });

      expect(mockGetUnreadNotificationCountService).toHaveBeenCalledWith(
        "student123",
      );
    });
  });

  // ==================================================
  // MARK ONE AS READ
  // ==================================================

  describe("PATCH /api/v1/notifications/:id/read", () => {
    test("should return 401 if user is not authenticated", async () => {
      const response = await request(app).patch(
        "/api/v1/notifications/notification123/read",
      );

      expect(response.status).toBe(401);

      expect(response.body.message).toBe("Unauthorized request");

      expect(mockMarkNotificationAsReadService).not.toHaveBeenCalled();
    });

    test("should mark notification as read", async () => {
      authenticateAs(studentUser);

      const readNotification = {
        ...notification,
        isRead: true,
      };

      mockMarkNotificationAsReadService.mockResolvedValue(readNotification);

      const response = await request(app)
        .patch("/api/v1/notifications/notification123/read")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(200);

      expect(response.body.message).toBe(
        "Notification marked as read successfully",
      );

      expect(response.body.data).toEqual(readNotification);

      expect(mockMarkNotificationAsReadService).toHaveBeenCalledWith({
        notificationId: "notification123",
        recipient: "student123",
      });
    });

    test("should return 404 if notification does not exist", async () => {
      authenticateAs(studentUser);

      mockMarkNotificationAsReadService.mockRejectedValue(
        new ApiError(404, "Notification not found"),
      );

      const response = await request(app)
        .patch("/api/v1/notifications/unknown/read")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(404);

      expect(response.body.message).toBe("Notification not found");
    });
  });

  // ==================================================
  // MARK ALL AS READ
  // ==================================================

  describe("PATCH /api/v1/notifications/read-all", () => {
    test("should return 401 if user is not authenticated", async () => {
      const response = await request(app).patch(
        "/api/v1/notifications/read-all",
      );

      expect(response.status).toBe(401);

      expect(response.body.message).toBe("Unauthorized request");

      expect(mockMarkAllNotificationsAsReadService).not.toHaveBeenCalled();
    });

    test("should mark all notifications as read", async () => {
      authenticateAs(studentUser);

      mockMarkAllNotificationsAsReadService.mockResolvedValue(true);

      const response = await request(app)
        .patch("/api/v1/notifications/read-all")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(200);

      expect(response.body.message).toBe(
        "All notifications marked as read successfully",
      );

      expect(response.body.data).toBeNull();

      expect(mockMarkAllNotificationsAsReadService).toHaveBeenCalledWith(
        "student123",
      );
    });
  });

  // ==================================================
  // DELETE
  // ==================================================

  describe("DELETE /api/v1/notifications/:id", () => {
    test("should return 401 if user is not authenticated", async () => {
      const response = await request(app).delete(
        "/api/v1/notifications/notification123",
      );

      expect(response.status).toBe(401);

      expect(response.body.message).toBe("Unauthorized request");

      expect(mockDeleteNotificationService).not.toHaveBeenCalled();
    });

    test("should delete notification successfully", async () => {
      authenticateAs(studentUser);

      mockDeleteNotificationService.mockResolvedValue(notification);

      const response = await request(app)
        .delete("/api/v1/notifications/notification123")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(200);

      expect(response.body.message).toBe("Notification deleted successfully");

      expect(response.body.data).toEqual({
        id: "notification123",
      });

      expect(mockDeleteNotificationService).toHaveBeenCalledWith({
        notificationId: "notification123",
        recipient: "student123",
      });
    });

    test("should return 404 if notification does not exist", async () => {
      authenticateAs(studentUser);

      mockDeleteNotificationService.mockRejectedValue(
        new ApiError(404, "Notification not found"),
      );

      const response = await request(app)
        .delete("/api/v1/notifications/unknown")
        .set("Authorization", `Bearer ${AUTH_TOKEN}`);

      expect(response.status).toBe(404);

      expect(response.body.message).toBe("Notification not found");
    });
  });
});
