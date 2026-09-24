import { API_BASE_URL } from "@/utils/api";

// Fetch all notifications for the authenticated user.
export async function getMyNotifications() {
  const response = await fetch(`${API_BASE_URL}/notifications`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(
      data?.message || "Failed to fetch notifications"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Fetch the unread notification count for the authenticated user.
export async function getUnreadNotificationCount() {
  const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(
      data?.message || "Failed to fetch unread notification count"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Mark a single notification as read.
export async function markNotificationAsRead(notificationId) {
  const response = await fetch(
    `${API_BASE_URL}/notifications/${encodeURIComponent(notificationId)}/read`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(
      data?.message || "Failed to mark notification as read"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Mark all notifications as read for the authenticated user.
export async function markAllNotificationsAsRead() {
  const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(
      data?.message || "Failed to mark all notifications as read"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Delete a single notification.
export async function deleteNotification(notificationId) {
  const response = await fetch(
    `${API_BASE_URL}/notifications/${encodeURIComponent(notificationId)}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(
      data?.message || "Failed to delete notification"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
