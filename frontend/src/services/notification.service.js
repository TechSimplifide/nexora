const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

/**
 * Fetch all notifications for the authenticated user.
 * @returns {Promise<Object>} API response data with notifications array in data
 */
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

/**
 * Fetch the unread notification count for the authenticated user.
 * @returns {Promise<Object>} API response with { count: number } in data
 */
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

/**
 * Mark a single notification as read.
 * @param {string} notificationId
 * @returns {Promise<Object>} API response with updated notification
 */
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

/**
 * Mark all notifications as read for the authenticated user.
 * @returns {Promise<Object>} API response
 */
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

/**
 * Delete a single notification.
 * @param {string} notificationId
 * @returns {Promise<Object>} API response
 */
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
