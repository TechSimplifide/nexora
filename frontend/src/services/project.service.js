const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

/**
 * Submit and upload a new completed project (Student only, multipart/form-data).
 * @param {FormData} formData
 * @returns {Promise<Object>} API response data with created project in data
 */
export async function createProject(formData) {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.message || "Failed to create project");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Update an existing project owned by the authenticated student (Student only, multipart/form-data).
 * @param {string} projectId
 * @param {FormData} formData
 * @returns {Promise<Object>} API response data with updated project in data
 */
export async function updateProject(projectId, formData) {
  const response = await fetch(
    `${API_BASE_URL}/projects/${encodeURIComponent(projectId)}`,
    {
      method: "PATCH",
      credentials: "include",
      body: formData,
    }
  );

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.message || "Failed to update project");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Delete an existing project owned by the authenticated student (Student only).
 * @param {string} projectId
 * @returns {Promise<Object>} API response data
 */
export async function deleteProject(projectId) {
  const response = await fetch(
    `${API_BASE_URL}/projects/${encodeURIComponent(projectId)}`,
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
    const error = new Error(data?.message || "Failed to delete project");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Fetch all college projects with optional query params (search, filters, pagination).
 * @param {Object} [params]
 * @param {string} [params.search]
 * @param {string} [params.technology]
 * @param {string} [params.domain]
 * @param {string} [params.department]
 * @param {string} [params.academicYear]
 * @param {number} [params.page]
 * @param {number} [params.limit]
 * @returns {Promise<Object>} API response data with projects array and pagination
 */
export async function getProjects(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      query.append(key, String(value).trim());
    }
  });

  const queryString = query.toString();
  const url = `${API_BASE_URL}/projects${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
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
    const error = new Error(data?.message || "Failed to fetch projects");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Fetch featured projects for the authenticated student/college.
 * @returns {Promise<Object>} API response data with array of featured projects in data
 */
export async function getFeaturedProjects() {
  const response = await fetch(`${API_BASE_URL}/projects/featured`, {
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
    const error = new Error(data?.message || "Failed to fetch featured projects");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Fetch single project details by ID.
 * @param {string} projectId
 * @returns {Promise<Object>} API response data with project object in data
 */
export async function getProjectById(projectId) {
  const response = await fetch(
    `${API_BASE_URL}/projects/${encodeURIComponent(projectId)}`,
    {
      method: "GET",
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
    const error = new Error(data?.message || "Failed to fetch project details");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Feature a project (Admin only, current academic year only).
 * @param {string} projectId
 * @returns {Promise<Object>} API response data with updated project
 */
export async function featureProject(projectId) {
  const response = await fetch(
    `${API_BASE_URL}/projects/${encodeURIComponent(projectId)}/feature`,
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
    const error = new Error(data?.message || "Failed to feature project");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Unfeature a project (Admin only).
 * @param {string} projectId
 * @returns {Promise<Object>} API response data with updated project
 */
export async function unfeatureProject(projectId) {
  const response = await fetch(
    `${API_BASE_URL}/projects/${encodeURIComponent(projectId)}/unfeature`,
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
    const error = new Error(data?.message || "Failed to remove project from featured");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Fetch access requests created by the authenticated student.
 * @returns {Promise<Object>} API response data containing access requests array
 */
export async function getMyProjectAccessRequests() {
  const response = await fetch(`${API_BASE_URL}/projects/access-requests/my`, {
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
      data?.message || "Failed to fetch project access requests"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Create a new access request for a protected project resource.
 * @param {string} projectId
 * @param {"github"|"deployedLink"|"supportingDocument"} resourceType
 * @returns {Promise<Object>} API response data for created request
 */
export async function createProjectAccessRequest(projectId, resourceType) {
  const response = await fetch(
    `${API_BASE_URL}/projects/${encodeURIComponent(projectId)}/access-requests`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ resourceType }),
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
      data?.message || "Failed to create access request"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Securely fetch the authorized URL for a protected project resource.
 * @param {string} projectId
 * @param {"github"|"deployedLink"|"supportingDocument"} resourceType
 * @returns {Promise<Object>} API response with { resourceType, url, accessStatus }
 */
export async function getProjectResource(projectId, resourceType) {
  const response = await fetch(
    `${API_BASE_URL}/projects/${encodeURIComponent(
      projectId
    )}/resources/${encodeURIComponent(resourceType)}`,
    {
      method: "GET",
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
      data?.message || "Failed to access protected resource"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Cancel a pending access request created by the authenticated student.
 * @param {string} requestId
 * @returns {Promise<Object>} API response data
 */
export async function cancelProjectAccessRequest(requestId) {
  const response = await fetch(
    `${API_BASE_URL}/projects/access-requests/${encodeURIComponent(requestId)}`,
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
      data?.message || "Failed to cancel access request"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Fetch all incoming access requests for a specific project (owner-only).
 * @param {string} projectId
 * @returns {Promise<Object>} API response data containing incoming access requests
 */
export async function getProjectAccessRequests(projectId) {
  const response = await fetch(
    `${API_BASE_URL}/projects/${encodeURIComponent(projectId)}/access-requests`,
    {
      method: "GET",
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
      data?.message || "Failed to fetch project access requests"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Approve a pending project access request (owner-only).
 * @param {string} requestId
 * @returns {Promise<Object>} API response data with updated request
 */
export async function approveProjectAccessRequest(requestId) {
  const response = await fetch(
    `${API_BASE_URL}/projects/access-requests/${encodeURIComponent(requestId)}/approve`,
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
      data?.message || "Failed to approve access request"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Reject a pending project access request (owner-only).
 * @param {string} requestId
 * @returns {Promise<Object>} API response data with updated request
 */
export async function rejectProjectAccessRequest(requestId) {
  const response = await fetch(
    `${API_BASE_URL}/projects/access-requests/${encodeURIComponent(requestId)}/reject`,
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
      data?.message || "Failed to reject access request"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
