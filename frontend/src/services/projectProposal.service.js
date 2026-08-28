const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

/**
 * Fetch all proposals created by the authenticated student.
 * @returns {Promise<Object>} API response data with proposals array in data
 */
export async function getMyProjectProposals() {
  const response = await fetch(`${API_BASE_URL}/project-proposals/my`, {
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
      data?.message || "Failed to fetch your project proposals"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Create a new project proposal (multipart/form-data).
 * @param {Object} params
 * @param {string} params.title
 * @param {{ size: number, members: Array<{ name: string }> }} params.team
 * @param {File} params.abstractPdf
 * @returns {Promise<Object>} API response data with created proposal
 */
export async function createProjectProposal({ title, team, abstractPdf }) {
  const formData = new FormData();
  formData.append("title", title.trim());
  formData.append("team", JSON.stringify(team));
  if (abstractPdf) {
    formData.append("abstractPdf", abstractPdf);
  }

  const response = await fetch(`${API_BASE_URL}/project-proposals`, {
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
    const error = new Error(
      data?.message || "Failed to submit project proposal"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Update and resubmit a rejected project proposal (multipart/form-data).
 * @param {Object} params
 * @param {string} params.proposalId
 * @param {string} [params.title]
 * @param {{ size: number, members: Array<{ name: string }> }} [params.team]
 * @param {File} [params.abstractPdf]
 * @returns {Promise<Object>} API response data with updated proposal
 */
export async function updateRejectedProjectProposal({
  proposalId,
  title,
  team,
  abstractPdf,
}) {
  const formData = new FormData();
  if (title !== undefined && title !== null) {
    formData.append("title", title.trim());
  }
  if (team !== undefined && team !== null) {
    formData.append("team", JSON.stringify(team));
  }
  if (abstractPdf instanceof File) {
    formData.append("abstractPdf", abstractPdf);
  }

  const response = await fetch(
    `${API_BASE_URL}/project-proposals/${encodeURIComponent(proposalId)}`,
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
    const error = new Error(
      data?.message || "Failed to update and resubmit project proposal"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Delete a pending or rejected project proposal.
 * @param {string} proposalId
 * @returns {Promise<Object>} API response data
 */
export async function deleteProjectProposal(proposalId) {
  const response = await fetch(
    `${API_BASE_URL}/project-proposals/${encodeURIComponent(proposalId)}`,
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
      data?.message || "Failed to delete project proposal"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Fetch all pending project proposals across the authenticated admin's college.
 * @returns {Promise<Object>} API response data with pending proposals array in data
 */
export async function getPendingProjectProposals() {
  const response = await fetch(`${API_BASE_URL}/project-proposals/pending`, {
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
      data?.message || "Failed to fetch pending project proposals"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Approve a pending project proposal (Admin only).
 * @param {string} proposalId
 * @returns {Promise<Object>} API response data with approved proposal
 */
export async function approveProjectProposal(proposalId) {
  const response = await fetch(
    `${API_BASE_URL}/project-proposals/${encodeURIComponent(proposalId)}/approve`,
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
      data?.message || "Failed to approve project proposal"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Reject a pending project proposal with required admin remarks (Admin only).
 * @param {Object} params
 * @param {string} params.proposalId
 * @param {string} params.adminRemarks
 * @returns {Promise<Object>} API response data with rejected proposal
 */
export async function rejectProjectProposal({ proposalId, adminRemarks }) {
  const response = await fetch(
    `${API_BASE_URL}/project-proposals/${encodeURIComponent(proposalId)}/reject`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        adminRemarks: adminRemarks.trim(),
      }),
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
      data?.message || "Failed to reject project proposal"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
