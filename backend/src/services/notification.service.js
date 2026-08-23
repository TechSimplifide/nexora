import { Notification } from "../models/notification.model.js";
import ApiError from "../utils/api-error.js";

// Create a notification
 
export const createNotificationService = async ({
  recipient,
  type,
  title,
  message,
  relatedResource = null,
}) => {
  try {
    return await Notification.create({
      recipient,
      type,
      title,
      message,
      relatedResource,
    });
  } catch (error) {
    console.error("Create notification error:", error);

    throw new ApiError(500, "Failed to create notification");
  }
};

// Get all notifications for a student
export const getMyNotificationsService = async (recipient) => {
  return await Notification.find({
    recipient,
  }).sort({ createdAt: -1 });
};


// Get unread notification count
export const getUnreadNotificationCountService = async (recipient) => {
  return await Notification.countDocuments({
    recipient,
    isRead: false,
  });
};

// Mark a notification as read
export const markNotificationAsReadService = async ({
  notificationId,
  recipient,
}) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    recipient,
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  if (!notification.isRead) {
    notification.isRead = true;
    await notification.save();
  }

  return notification;
};

// Mark all notifications as read
export const markAllNotificationsAsReadService = async (recipient) => {
  await Notification.updateMany(
    {
      recipient,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
      },
    },
  );

  return true;
};

// Delete a notification
export const deleteNotificationService = async ({
  notificationId,
  recipient,
}) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    recipient,
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return notification;
};
