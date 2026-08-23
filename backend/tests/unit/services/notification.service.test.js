import { jest } from "@jest/globals";

// --------------------------------------------------
// Mocks
// --------------------------------------------------

const mockNotificationCreate = jest.fn();
const mockNotificationFind = jest.fn();
const mockNotificationCountDocuments = jest.fn();
const mockNotificationFindOne = jest.fn();
const mockNotificationUpdateMany = jest.fn();
const mockNotificationFindOneAndDelete = jest.fn();

jest.unstable_mockModule("../../../src/models/notification.model.js", () => ({
  Notification: {
    create: mockNotificationCreate,
    find: mockNotificationFind,
    countDocuments: mockNotificationCountDocuments,
    findOne: mockNotificationFindOne,
    updateMany: mockNotificationUpdateMany,
    findOneAndDelete: mockNotificationFindOneAndDelete,
  },
}));

const {
  createNotificationService,
  getMyNotificationsService,
  getUnreadNotificationCountService,
  markNotificationAsReadService,
  markAllNotificationsAsReadService,
  deleteNotificationService,
} = await import("../../../src/services/notification.service.js");

// --------------------------------------------------
// Mock Data
// --------------------------------------------------

const notification = {
  _id: "notification123",
  recipient: "student123",
  type: "PROJECT_PROPOSAL_APPROVED",
  title: "Project Proposal Approved",
  message: "Your project proposal has been approved.",
  relatedResource: "proposal123",
  isRead: false,
};

describe("Notification Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================================================
  // CREATE NOTIFICATION
  // ==================================================

  describe("createNotificationService", () => {
    test("should create and return a notification successfully", async () => {
      mockNotificationCreate.mockResolvedValue(notification);

      const result = await createNotificationService({
        recipient: "student123",
        type: "PROJECT_PROPOSAL_APPROVED",
        title: "Project Proposal Approved",
        message: "Your project proposal has been approved.",
        relatedResource: "proposal123",
      });

      expect(result).toEqual(notification);

      expect(mockNotificationCreate).toHaveBeenCalledWith({
        recipient: "student123",
        type: "PROJECT_PROPOSAL_APPROVED",
        title: "Project Proposal Approved",
        message: "Your project proposal has been approved.",
        relatedResource: "proposal123",
      });
    });

    test("should use null as relatedResource when it is not provided", async () => {
      mockNotificationCreate.mockResolvedValue(notification);

      await createNotificationService({
        recipient: "student123",
        type: "PROJECT_PROPOSAL_APPROVED",
        title: "Project Proposal Approved",
        message: "Your project proposal has been approved.",
      });

      expect(mockNotificationCreate).toHaveBeenCalledWith({
        recipient: "student123",
        type: "PROJECT_PROPOSAL_APPROVED",
        title: "Project Proposal Approved",
        message: "Your project proposal has been approved.",
        relatedResource: null,
      });
    });

    test("should throw ApiError when notification creation fails", async () => {
      mockNotificationCreate.mockRejectedValue(new Error("Database error"));

      await expect(
        createNotificationService({
          recipient: "student123",
          type: "PROJECT_PROPOSAL_APPROVED",
          title: "Project Proposal Approved",
          message: "Your project proposal has been approved.",
          relatedResource: "proposal123",
        }),
      ).rejects.toMatchObject({
        statusCode: 500,
        message: "Failed to create notification",
      });
    });
  });

  // ==================================================
  // GET MY NOTIFICATIONS
  // ==================================================

  describe("getMyNotificationsService", () => {
    test("should return notifications sorted by newest first", async () => {
      const notifications = [notification];

      const mockSort = jest.fn().mockResolvedValue(notifications);

      mockNotificationFind.mockReturnValue({
        sort: mockSort,
      });

      const result = await getMyNotificationsService("student123");

      expect(result).toEqual(notifications);

      expect(mockNotificationFind).toHaveBeenCalledWith({
        recipient: "student123",
      });

      expect(mockSort).toHaveBeenCalledWith({
        createdAt: -1,
      });
    });
  });

  // ==================================================
  // GET UNREAD COUNT
  // ==================================================

  describe("getUnreadNotificationCountService", () => {
    test("should return unread notification count", async () => {
      mockNotificationCountDocuments.mockResolvedValue(5);

      const result = await getUnreadNotificationCountService("student123");

      expect(result).toBe(5);

      expect(mockNotificationCountDocuments).toHaveBeenCalledWith({
        recipient: "student123",
        isRead: false,
      });
    });
  });

  // ==================================================
  // MARK AS READ
  // ==================================================

  describe("markNotificationAsReadService", () => {
    test("should mark an unread notification as read", async () => {
      const mockNotification = {
        ...notification,
        isRead: false,
        save: jest.fn().mockResolvedValue(),
      };

      mockNotificationFindOne.mockResolvedValue(mockNotification);

      const result = await markNotificationAsReadService({
        notificationId: "notification123",
        recipient: "student123",
      });

      expect(result).toEqual(mockNotification);

      expect(mockNotificationFindOne).toHaveBeenCalledWith({
        _id: "notification123",
        recipient: "student123",
      });

      expect(mockNotification.isRead).toBe(true);

      expect(mockNotification.save).toHaveBeenCalled();
    });

    test("should return already-read notification without saving", async () => {
      const mockNotification = {
        ...notification,
        isRead: true,
        save: jest.fn(),
      };

      mockNotificationFindOne.mockResolvedValue(mockNotification);

      const result = await markNotificationAsReadService({
        notificationId: "notification123",
        recipient: "student123",
      });

      expect(result).toEqual(mockNotification);

      expect(mockNotification.isRead).toBe(true);

      expect(mockNotification.save).not.toHaveBeenCalled();
    });

    test("should throw 404 if notification does not exist", async () => {
      mockNotificationFindOne.mockResolvedValue(null);

      await expect(
        markNotificationAsReadService({
          notificationId: "unknown",
          recipient: "student123",
        }),
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Notification not found",
      });
    });
  });

  // ==================================================
  // MARK ALL AS READ
  // ==================================================

  describe("markAllNotificationsAsReadService", () => {
    test("should mark all unread notifications as read", async () => {
      mockNotificationUpdateMany.mockResolvedValue({
        acknowledged: true,
        modifiedCount: 3,
      });

      const result = await markAllNotificationsAsReadService("student123");

      expect(result).toBe(true);

      expect(mockNotificationUpdateMany).toHaveBeenCalledWith(
        {
          recipient: "student123",
          isRead: false,
        },
        {
          $set: {
            isRead: true,
          },
        },
      );
    });
  });

  // ==================================================
  // DELETE NOTIFICATION
  // ==================================================

  describe("deleteNotificationService", () => {
    test("should delete and return the notification successfully", async () => {
      mockNotificationFindOneAndDelete.mockResolvedValue(notification);

      const result = await deleteNotificationService({
        notificationId: "notification123",
        recipient: "student123",
      });

      expect(result).toEqual(notification);

      expect(mockNotificationFindOneAndDelete).toHaveBeenCalledWith({
        _id: "notification123",
        recipient: "student123",
      });
    });

    test("should throw 404 if notification does not exist", async () => {
      mockNotificationFindOneAndDelete.mockResolvedValue(null);

      await expect(
        deleteNotificationService({
          notificationId: "unknown",
          recipient: "student123",
        }),
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Notification not found",
      });
    });
  });
});
