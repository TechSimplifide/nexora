import { Router } from "express";

import {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All notification routes require authentication
router.use(verifyJWT);

// Get my notifications
router.get("/", getMyNotifications);

// Get unread notification count
router.get("/unread-count", getUnreadNotificationCount);

// Mark one notification as read
router.patch("/:id/read", markNotificationAsRead);

// Mark all notifications as read
router.patch("/read-all", markAllNotificationsAsRead);

// Delete notification
router.delete("/:id", deleteNotification);

export default router;
