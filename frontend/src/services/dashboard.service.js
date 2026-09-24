import { API_BASE_URL } from "@/utils/api";

// Fetch Student Dashboard data (KPIs, Active Proposal, Discover Projects).
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

// Fetch Admin Dashboard analytics (KPIs, Academic Year breakdown, Proposal status, Technologies, Domains).
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
