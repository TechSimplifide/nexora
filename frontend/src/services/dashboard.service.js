const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

/**
 * Fetch Student Dashboard data (KPIs, Active Proposal, Discover Projects).
 * @returns {Promise<Object>} API response data
 */
export async function getStudentDashboard() {
  const response = await fetch(`${API_BASE_URL}/dashboard/student`, {
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
    const error = new Error(data?.message || "Failed to fetch student dashboard data");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Fetch Admin Dashboard analytics (KPIs, Academic Year breakdown, Proposal status, Technologies, Domains).
 * @returns {Promise<Object>} API response data
 */
export async function getAdminDashboardAnalytics() {
  const response = await fetch(`${API_BASE_URL}/dashboard/admin`, {
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
    const error = new Error(data?.message || "Failed to fetch admin dashboard analytics");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
