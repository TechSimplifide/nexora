const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

/**
 * Register a new student account.
 * @param {Object} payload
 * @param {string} payload.fullName
 * @param {string} payload.email
 * @param {string} payload.password
 * @param {string} payload.collegeCode
 * @returns {Promise<Object>} API response data
 */
export async function registerStudent({ fullName, email, password, collegeCode }) {
  const response = await fetch(`${API_BASE_URL}/auth/student/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullName,
      email,
      password,
      collegeCode,
    }),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error(data?.message || "User already exists with this email");
    }
    if (response.status === 404) {
      throw new Error(data?.message || "Invalid college code");
    }
    throw new Error(data?.message || "Something went wrong. Please try again.");
  }

  return data;
}

/**
 * Register a new college account (Admin + College Workspace).
 * @param {Object} payload
 * @param {string} payload.collegeName
 * @param {string} payload.adminName
 * @param {string} payload.email
 * @param {string} payload.password
 * @returns {Promise<Object>} API response data
 */
export async function registerCollege({ collegeName, adminName, email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/college/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      collegeName,
      adminName,
      email,
      password,
    }),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error(data?.message || "User already exists with this email");
    }
    throw new Error(data?.message || "Something went wrong. Please try again.");
  }

  return data;
}

/**
 * Verify user email with token.
 * @param {string} token
 * @returns {Promise<Object>} API response data
 */
export async function verifyEmail(token) {
  const response = await fetch(`${API_BASE_URL}/auth/verify-email/${encodeURIComponent(token)}`, {
    method: "GET",
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error(data?.message || "Invalid or expired verification link");
    }
    throw new Error(data?.message || "Something went wrong. Please try again.");
  }

  return data;
}

/**
 * Resend verification email link.
 * @param {string} email
 * @returns {Promise<Object>} API response data
 */
export async function resendVerificationEmail(email) {
  const response = await fetch(`${API_BASE_URL}/auth/resend-verification-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
    }),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(data?.message || "User not found");
    }
    if (response.status === 400) {
      throw new Error(data?.message || "Email is already verified");
    }
    throw new Error(data?.message || "Something went wrong. Please try again.");
  }

  return data;
}

/**
 * Log in a user.
 * @param {Object} credentials
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @returns {Promise<Object>} API response data
 */
export async function login({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
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
      data?.message ||
        (response.status === 401
          ? "Invalid email or password"
          : response.status === 403
            ? "Please verify your email first."
            : "Something went wrong. Please try again.")
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Fetch current authenticated user profile.
 * @returns {Promise<Object>} API response data
 */
export async function getCurrentUser() {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.message || "User not authenticated");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Refresh access token using cookie session.
 * @returns {Promise<Object>} API response data
 */
export async function refreshToken() {
  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: "POST",
    credentials: "include",
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.message || "Failed to refresh token");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Log out user and clear cookie session.
 * @returns {Promise<Object>} API response data
 */
export async function logout() {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.message || "Logout failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
