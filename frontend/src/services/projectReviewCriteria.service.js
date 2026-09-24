import { API_BASE_URL } from "@/utils/api";

// Fetch review criteria for the authenticated admin's college.
export async function getProjectReviewCriteria() {
  const response = await fetch(`${API_BASE_URL}/project-review-criteria`, {
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
      data?.message || "Failed to fetch project review criteria"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Update review criteria configuration (Admin only).
export async function updateProjectReviewCriteria({
  standardCriteria,
  customCriteria,
  autoReview,
}) {
  const response = await fetch(`${API_BASE_URL}/project-review-criteria`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      standardCriteria: standardCriteria.map((c) => ({
        key: c.key,
        enabled: Boolean(c.enabled),
        required: Boolean(c.required),
      })),
      customCriteria: customCriteria.map((c) => ({
        name: c.name.trim(),
        description: c.description.trim(),
        enabled: Boolean(c.enabled),
        required: Boolean(c.required),
      })),
      autoReview: autoReview || { enabled: false, confidenceThreshold: 0.9 },
    }),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(
      data?.message || "Failed to update project review criteria"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
