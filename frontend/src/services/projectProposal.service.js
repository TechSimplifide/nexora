import { API_BASE_URL } from "@/utils/api";

// Fetch all proposals created by the authenticated student.
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

// Create a new project proposal (multipart/form-data).
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

// Update and resubmit a rejected project proposal (multipart/form-data).
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

// Delete a pending or rejected project proposal.
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

// Fetch all pending project proposals across the authenticated admin's college.
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

// Approve a pending project proposal (Admin only).
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

// Reject a pending project proposal with required admin remarks (Admin only).
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

// Analyze a pending project proposal using AI (Admin only).
export async function analyzeProposalWithAI(proposalId) {
  const response = await fetch(
    `${API_BASE_URL}/ai-proposal-review/${encodeURIComponent(proposalId)}/analyze`,
    {
      method: "POST",
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
      data?.message || "Failed to analyze project proposal with AI"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

