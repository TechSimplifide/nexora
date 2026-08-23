import {
  getMyNotificationsService,
  getUnreadNotificationCountService,
  markNotificationAsReadService,
  markAllNotificationsAsReadService,
  deleteNotificationService,
} from "../services/notification.service.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/async-handler.js";

//Get current user's notifications
export const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await getMyNotificationsService(req.user._id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, notifications, "Notifications fetched successfully"),
    );
});

// Get unread notification count
export const getUnreadNotificationCount = asyncHandler(async (req, res) => {
  const count = await getUnreadNotificationCountService(req.user._id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { count },
        "Unread notification count fetched successfully",
      ),
    );
});

// Mark one notification as read
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await markNotificationAsReadService({
    notificationId: req.params.id,
    recipient: req.user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        notification,
        "Notification marked as read successfully",
      ),
    );
});

// Mark all notifications as read
export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  await markAllNotificationsAsReadService(req.user._id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "All notifications marked as read successfully",
      ),
    );
});

// Delete a notification
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await deleteNotificationService({
    notificationId: req.params.id,
    recipient: req.user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { id: notification._id },
        "Notification deleted successfully",
      ),
    );
});
