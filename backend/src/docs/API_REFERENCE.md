# Nexora Backend — Complete API Reference

Welcome to the official API reference for the **Nexora Backend**.

Nexora is a multi-tenant SaaS academic project collaboration and management platform for colleges.

---

## Base URL & Conventions

- **Base URL:** `http://localhost:3000/api/v1` (or `/api/v1` in production)
- **API Protocol:** REST over HTTP/HTTPS
- **Data Exchange Format:** `application/json` (or `multipart/form-data` for file uploads)
- **Authentication:** JWT Access Token via HTTP-only cookie (`accessToken`) or `Authorization: Bearer <token>` header.
- **Session Refresh:** HTTP-only cookie (`refreshToken`).

### Standard Response Envelope

All API responses strictly adhere to the unified `ApiResponse` envelope:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Success message",
  "data": {}
}
```

### Standard Error Envelope

All API errors return a consistent `ApiError` envelope:

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Error description",
  "errors": []
}
```

---

## Table of Contents

1. [Health Check](#1-health-check)
2. [Authentication & Account Management](#2-authentication--account-management)
3. [College Management](#3-college-management)
4. [Project Proposals](#4-project-proposals)
5. [Projects](#5-projects)
6. [Project Resources & Granular Access](#6-project-resources--granular-access)
7. [Project Access Requests](#7-project-access-requests)
8. [AI Project Recommendations](#8-ai-project-recommendations)
9. [Notifications](#9-notifications)
10. [Dashboards & Analytics](#10-dashboards--analytics)

---

## 1. Health Check

### GET `/api/v1/healthcheck`

Returns the operational status of the server.

- **Authentication:** Not Required
- **Role:** Any
- **Content-Type:** N/A

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Success",
  "data": {
    "message": "Server is running"
  }
}
```

---

## 2. Authentication & Account Management

### POST `/api/v1/auth/student/register`

Registers a new student account and associates them with their college via `collegeCode`. Generates a 20-minute verification token and sends a verification email.

- **Authentication:** Not Required
- **Role:** Public
- **Content-Type:** `application/json`

#### Request Body

```json
{
  "fullName": "Jane Doe",
  "email": "jane.doe@student.edu",
  "password": "StrongPassword123!",
  "collegeCode": "INS-K79A2"
}
```

#### Validation Rules
- `fullName`: String, 3 to 50 characters, trimmed.
- `email`: Valid email address, lowercased, trimmed.
- `password`: String, 8 to 32 characters.
- `collegeCode`: String, 5 to 15 characters, uppercase, trimmed.

#### Success Response (`201 Created`)

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Student registered successfully. Please check your email to verify your account.",
  "data": {
    "id": "67be02a2b3c4d5e6f7a8b9c1",
    "fullName": "Jane Doe",
    "email": "jane.doe@student.edu",
    "role": "student",
    "college": {
      "id": "67be01a2b3c4d5e6f7a8b9c0",
      "name": "Institute of Technology & Science",
      "collegeCode": "INS-K79A2"
    }
  }
}
```

#### Error Responses
| Status | Meaning / Reason |
| :--- | :--- |
| **400** | Validation failed on request body |
| **404** | Invalid college code |
| **409** | User already exists with this email |
| **500** | Internal server error |

---

### POST `/api/v1/auth/login`

Authenticates a user with email and password. Sets `accessToken` (1 day) and `refreshToken` (10 days) as HTTP-only cookies and returns the access token in the response body. Requires email verification.

- **Authentication:** Not Required
- **Role:** Public
- **Content-Type:** `application/json`

#### Request Body

```json
{
  "email": "jane.doe@student.edu",
  "password": "StrongPassword123!"
}
```

#### Validation Rules
- `email`: Valid email format, lowercased, trimmed.
- `password`: Minimum 8 characters.

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "67be02a2b3c4d5e6f7a8b9c1",
      "fullName": "Jane Doe",
      "email": "jane.doe@student.edu",
      "role": "student",
      "college": "67be01a2b3c4d5e6f7a8b9c0"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Responses
| Status | Meaning / Reason |
| :--- | :--- |
| **400** | Validation failed |
| **401** | Invalid email or password |
| **403** | Email not verified (`"Please verify your email first."`) |
| **500** | Internal server error |

---

### GET `/api/v1/auth/verify-email/:token`

Verifies a user account using the unhashed token sent to their email.

- **Authentication:** Not Required
- **Content-Type:** N/A

#### Path Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `token` | String | Yes | Hex verification token from email link |

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Email verified successfully",
  "data": {}
}
```

#### Error Responses
| Status | Meaning / Reason |
| :--- | :--- |
| **400** | Invalid or expired verification link |
| **500** | Internal server error |

---

### POST `/api/v1/auth/resend-verification-email`

Generates a new verification token and resends the verification email.

- **Authentication:** Not Required
- **Content-Type:** `application/json`

#### Request Body

```json
{
  "email": "jane.doe@student.edu"
}
```

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Verification email sent successfully",
  "data": {}
}
```

#### Error Responses
| Status | Meaning / Reason |
| :--- | :--- |
| **400** | Email is already verified / Validation failed |
| **404** | User not found |
| **500** | Internal server error |

---

### GET `/api/v1/auth/me`

Fetches the profile and college details of the currently authenticated user.

- **Authentication:** Required (`verifyJWT`)
- **Role:** Any (`student`, `admin`, `super_admin`)
- **Content-Type:** N/A

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Current user fetched successfully",
  "data": {
    "id": "67be02a2b3c4d5e6f7a8b9c1",
    "fullName": "Jane Doe",
    "email": "jane.doe@student.edu",
    "role": "student",
    "isVerified": true,
    "avatar": {
      "publicId": null,
      "url": "https://placehold.co/200x200"
    },
    "college": {
      "id": "67be01a2b3c4d5e6f7a8b9c0",
      "name": "Institute of Technology & Science",
      "collegeCode": "INS-K79A2"
    }
  }
}
```

#### Error Responses
| Status | Meaning / Reason |
| :--- | :--- |
| **401** | Unauthorized request or invalid/expired access token |
| **404** | User not found |
| **500** | Internal server error |

---

### POST `/api/v1/auth/refresh-token`

Rotates the access token and refresh token using the `refreshToken` HTTP cookie.

- **Authentication:** Required (`refreshToken` cookie)
- **Content-Type:** N/A

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Access token refreshed successfully",
  "data": {
    "user": {
      "id": "67be02a2b3c4d5e6f7a8b9c1",
      "fullName": "Jane Doe",
      "email": "jane.doe@student.edu",
      "role": "student",
      "college": "67be01a2b3c4d5e6f7a8b9c0"
    }
  }
}
```

#### Error Responses
| Status | Meaning / Reason |
| :--- | :--- |
| **401** | Refresh token is required / Invalid or expired refresh token |
| **500** | Internal server error |

---

### POST `/api/v1/auth/logout`

Invalidates the user's refresh token in the database and clears authentication cookies.

- **Authentication:** Required (`verifyJWT`)
- **Content-Type:** N/A

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Logged out successfully",
  "data": {}
}
```

---

## 3. College Management

### POST `/api/v1/auth/college/register`

Creates a new college tenant and registers its primary administrator account atomically inside a database transaction.

- **Authentication:** Not Required
- **Role:** Public
- **Content-Type:** `application/json`

#### Request Body

```json
{
  "collegeName": "Institute of Technology & Science",
  "adminName": "John Admin",
  "email": "admin@college.edu",
  "password": "AdminPassword123!"
}
```

#### Validation Rules
- `collegeName`: String, 3 to 100 characters.
- `adminName`: String, 3 to 50 characters.
- `email`: Valid email address, lowercased, trimmed.
- `password`: String, 8 to 32 characters.

#### Success Response (`201 Created`)

```json
{
  "statusCode": 201,
  "success": true,
  "message": "College registered successfully. Please check your email to verify the account.",
  "data": {
    "collegeCode": "INS-K79A2",
    "admin": {
      "id": "67be01a2b3c4d5e6f7a8b9c0",
      "fullName": "John Admin",
      "email": "admin@college.edu",
      "role": "admin",
      "isVerified": false
    }
  }
}
```

#### Error Responses
| Status | Meaning / Reason |
| :--- | :--- |
| **400** | Validation failed |
| **409** | User already exists with this email |
| **500** | Internal server error |

---

## 4. Project Proposals

### POST `/api/v1/project-proposals`

Submits a new academic proposal with a required abstract PDF. Uploads the file to Cloudinary and notifies the college administrator.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `student`
- **Tenant Scope:** Scoped to student's college
- **Content-Type:** `multipart/form-data`

#### Form Fields
- `title` (text): String, 5 to 150 characters.
- `team` (text): JSON string representation of team object:
  ```json
  {
    "size": 2,
    "members": [
      { "name": "Jane Doe" },
      { "name": "John Smith" }
    ]
  }
  ```
  *(Validation: `team.size` must match `team.members.length`, size 1–10, member name 2–50 chars).*
- `abstractPdf` (file): Required PDF file, max size 5 MB.

#### Success Response (`201 Created`)

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Project proposal submitted successfully",
  "data": {
    "_id": "67be03a2b3c4d5e6f7a8b9c2",
    "title": "Autonomous Drone Navigation System",
    "team": {
      "size": 2,
      "members": [
        { "name": "Jane Doe" },
        { "name": "John Smith" }
      ]
    },
    "abstractPdf": {
      "url": "https://res.cloudinary.com/.../abstract.pdf",
      "publicId": "nexora/project-proposals/abc123"
    },
    "createdBy": "67be02a2b3c4d5e6f7a8b9c1",
    "college": "67be01a2b3c4d5e6f7a8b9c0",
    "status": "pending",
    "adminRemarks": null,
    "reviewedBy": null,
    "reviewedAt": null,
    "createdAt": "2026-08-27T10:00:00.000Z",
    "updatedAt": "2026-08-27T10:00:00.000Z"
  }
}
```

---

### GET `/api/v1/project-proposals/my`

Retrieves all proposals submitted by the authenticated student.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `student`
- **Content-Type:** N/A

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Project proposals fetched successfully",
  "data": [
    {
      "_id": "67be03a2b3c4d5e6f7a8b9c2",
      "title": "Autonomous Drone Navigation System",
      "team": {
        "size": 2,
        "members": [
          { "name": "Jane Doe" },
          { "name": "John Smith" }
        ]
      },
      "abstractPdf": {
        "url": "https://res.cloudinary.com/.../abstract.pdf",
        "publicId": "nexora/project-proposals/abc123"
      },
      "status": "pending",
      "adminRemarks": null,
      "createdAt": "2026-08-27T10:00:00.000Z"
    }
  ]
}
```

---

### GET `/api/v1/project-proposals/pending`

Retrieves all pending proposals submitted by students within the administrator's college.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `admin`
- **Tenant Scope:** Scoped to admin's college

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Pending project proposals fetched successfully",
  "data": [
    {
      "_id": "67be03a2b3c4d5e6f7a8b9c2",
      "title": "Autonomous Drone Navigation System",
      "createdBy": {
        "_id": "67be02a2b3c4d5e6f7a8b9c1",
        "fullName": "Jane Doe",
        "email": "jane.doe@student.edu"
      },
      "college": {
        "_id": "67be01a2b3c4d5e6f7a8b9c0",
        "name": "Institute of Technology & Science",
        "collegeCode": "INS-K79A2"
      },
      "status": "pending",
      "createdAt": "2026-08-27T10:00:00.000Z"
    }
  ]
}
```

---

### PATCH `/api/v1/project-proposals/:id/approve`

Approves a pending proposal.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `admin`
- **Path Parameters:** `id` (Proposal ObjectId)

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Project proposal approved successfully",
  "data": {
    "_id": "67be03a2b3c4d5e6f7a8b9c2",
    "status": "approved",
    "reviewedBy": "67be01a2b3c4d5e6f7a8b9c0",
    "reviewedAt": "2026-08-27T10:15:00.000Z",
    "adminRemarks": null
  }
}
```

---

### PATCH `/api/v1/project-proposals/:id/reject`

Rejects a pending proposal with required administrative remarks.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `admin`
- **Path Parameters:** `id` (Proposal ObjectId)

#### Request Body

```json
{
  "adminRemarks": "Please clarify your methodology and testing setup."
}
```
*(Validation: `adminRemarks` string, 5 to 800 characters).*

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Project proposal rejected successfully",
  "data": {
    "_id": "67be03a2b3c4d5e6f7a8b9c2",
    "status": "rejected",
    "adminRemarks": "Please clarify your methodology and testing setup.",
    "reviewedBy": "67be01a2b3c4d5e6f7a8b9c0",
    "reviewedAt": "2026-08-27T10:15:00.000Z"
  }
}
```

---

### PATCH `/api/v1/project-proposals/:id`

Updates and resubmits a rejected proposal. Sets status back to `pending`.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `student`
- **Ownership:** Creator of proposal
- **Requirement:** Proposal status must currently be `rejected`.
- **Content-Type:** `multipart/form-data`

#### Form Fields (At least one required)
- `title` (text, optional): 5–150 characters.
- `team` (text, optional): JSON string representing team object.
- `abstractPdf` (file, optional): PDF file, max 5 MB.

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Project proposal updated and resubmitted successfully",
  "data": {
    "_id": "67be03a2b3c4d5e6f7a8b9c2",
    "status": "pending",
    "adminRemarks": null,
    "reviewedBy": null,
    "reviewedAt": null
  }
}
```

---

### DELETE `/api/v1/project-proposals/:id`

Deletes a proposal (only permitted if status is `pending` or `rejected`) and removes its PDF from Cloudinary.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `student`
- **Ownership:** Creator of proposal

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Project proposal deleted successfully",
  "data": {
    "id": "67be03a2b3c4d5e6f7a8b9c2"
  }
}
```

---

## 5. Projects

### POST `/api/v1/projects`

Creates a new academic project with optional screenshots and supporting document.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `student`
- **Tenant Scope:** Scoped to student's college
- **Content-Type:** `multipart/form-data`

#### Form Fields
- `title` (text): String, 3–100 characters.
- `summary` (text): String, 20–500 characters.
- `description` (text): String, 50–5000 characters.
- `technologies` (text): JSON array string (e.g. `'["React", "Node.js"]'`).
- `domain` (text): String, 2–50 characters.
- `department` (text): String, 2–100 characters.
- `academicYear` (text): Format `YYYY-YY` (e.g. `"2025-26"`).
- `teamMembers` (text): JSON array string (e.g. `'[{"name":"Jane Doe","role":"Lead"}]'`).
- `github` (text, optional): JSON object string (e.g. `'{"url":"https://github.com/org/repo","access":"protected"}'`).
- `deployedLink` (text, optional): JSON object string (e.g. `'{"url":"https://app.demo","access":"public"}'`).
- `screenshots` (files, optional): Up to 5 image files (JPEG, PNG, WEBP, max 5 MB each).
- `supportingDocument` (file, optional): Single PDF file (max 5 MB).

#### Success Response (`201 Created`)

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Project created successfully",
  "data": {
    "_id": "67be04a2b3c4d5e6f7a8b9c3",
    "title": "Smart Campus IoT System",
    "summary": "IoT and Web platform for smart campus automation.",
    "domain": "Web Development",
    "department": "Computer Science",
    "academicYear": "2025-26",
    "technologies": ["React", "Node.js", "MongoDB"],
    "isFeatured": false,
    "screenshots": [
      {
        "url": "https://res.cloudinary.com/.../screenshot1.png",
        "publicId": "nexora/projects/screenshots/s1"
      }
    ],
    "github": {
      "url": "https://github.com/org/repo",
      "access": "protected"
    },
    "deployedLink": {
      "url": "https://app.demo",
      "access": "public"
    },
    "supportingDocument": {
      "name": "report.pdf",
      "url": "https://res.cloudinary.com/.../report.pdf",
      "publicId": "nexora/projects/documents/d1",
      "access": "public"
    },
    "createdBy": "67be02a2b3c4d5e6f7a8b9c1",
    "college": "67be01a2b3c4d5e6f7a8b9c0",
    "createdAt": "2026-08-27T10:00:00.000Z"
  }
}
```

---

### GET `/api/v1/projects`

Retrieves paginated projects scoped to the user's college with multi-criteria search and filtering.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `student` or `admin`

#### Query Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `search` | String | Optional | Case-insensitive search on title, summary, technologies, domain |
| `technology` | String | Optional | Filter by exact technology name |
| `domain` | String | Optional | Filter by domain |
| `department` | String | Optional | Filter by department |
| `academicYear`| String | Optional | Filter by academic year (e.g. `2025-26`) |
| `page` | Integer | `1` | Page number (min: 1) |
| `limit` | Integer | `10` | Projects per page (min: 1, max: 50) |

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Projects fetched successfully",
  "data": {
    "projects": [
      {
        "_id": "67be04a2b3c4d5e6f7a8b9c3",
        "title": "Smart Campus IoT System",
        "summary": "IoT and Web platform for smart campus automation.",
        "technologies": ["React", "Node.js", "MongoDB"],
        "domain": "Web Development",
        "department": "Computer Science",
        "academicYear": "2025-26",
        "isFeatured": false,
        "screenshots": [
          {
            "url": "https://res.cloudinary.com/.../screenshot1.png",
            "publicId": "nexora/projects/screenshots/s1"
          }
        ],
        "createdBy": {
          "_id": "67be02a2b3c4d5e6f7a8b9c1",
          "fullName": "Jane Doe"
        },
        "createdAt": "2026-08-27T10:00:00.000Z"
      }
    ],
    "pagination": {
      "totalProjects": 1,
      "totalPages": 1,
      "currentPage": 1,
      "limit": 10,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

---

### GET `/api/v1/projects/featured`

Retrieves featured projects for the current academic year within the authenticated user's college.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `student` or `admin`

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Featured projects fetched successfully",
  "data": [
    {
      "_id": "67be04a2b3c4d5e6f7a8b9c3",
      "title": "Smart Campus IoT System",
      "academicYear": "2025-26",
      "isFeatured": true,
      "createdBy": {
        "_id": "67be02a2b3c4d5e6f7a8b9c1",
        "fullName": "Jane Doe"
      }
    }
  ]
}
```

---

### GET `/api/v1/projects/:id`

Retrieves comprehensive project details.

**Resource Sanitization:**
- If requester is the **owner**, all resource URLs are returned.
- If requester is **not the owner**:
  - Resources with `access: "public"` return `url` and `isAccessible: true`.
  - Resources with `access: "protected"` return `url: null` and `isAccessible: false` unless the student has an **approved access request** for that specific resource.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `student` or `admin`
- **Path Parameters:** `id` (Project ObjectId)

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Project fetched successfully",
  "data": {
    "_id": "67be04a2b3c4d5e6f7a8b9c3",
    "title": "Smart Campus IoT System",
    "summary": "IoT and Web platform for smart campus automation.",
    "description": "Full detailed architectural breakdown...",
    "domain": "Web Development",
    "department": "Computer Science",
    "academicYear": "2025-26",
    "technologies": ["React", "Node.js"],
    "teamMembers": [
      { "name": "Jane Doe", "role": "Lead" }
    ],
    "screenshots": [
      {
        "url": "https://res.cloudinary.com/.../s1.png",
        "publicId": "nexora/projects/screenshots/s1"
      }
    ],
    "github": {
      "url": null,
      "access": "protected",
      "isAccessible": false
    },
    "deployedLink": {
      "url": "https://app.demo",
      "access": "public",
      "isAccessible": true
    },
    "supportingDocument": {
      "name": "report.pdf",
      "url": null,
      "access": "protected",
      "isAccessible": false
    },
    "createdBy": {
      "_id": "67be02a2b3c4d5e6f7a8b9c1",
      "fullName": "Jane Doe"
    },
    "college": "67be01a2b3c4d5e6f7a8b9c0"
  }
}
```

---

### PATCH `/api/v1/projects/:id`

Updates project fields, screenshots, and supporting document.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `student`
- **Ownership:** Project creator
- **Content-Type:** `multipart/form-data`

#### Form Fields (Optional)
- `title`, `summary`, `description`, `technologies`, `domain`, `department`, `academicYear`, `teamMembers`, `github`, `deployedLink`, `screenshots` (up to 5 images), `supportingDocument` (1 PDF).

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Project updated successfully",
  "data": {
    "_id": "67be04a2b3c4d5e6f7a8b9c3",
    "title": "Smart Campus IoT System (Updated)"
  }
}
```

---

### DELETE `/api/v1/projects/:id`

Deletes a project and its Cloudinary media assets.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `student`
- **Ownership:** Project creator

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Project deleted successfully",
  "data": null
}
```

---

### PATCH `/api/v1/projects/:projectId/feature`

Features a project (project must be in the current academic year and admin's college).

- **Authentication:** Required (`verifyJWT`)
- **Role:** `admin`

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Project featured successfully",
  "data": {
    "_id": "67be04a2b3c4d5e6f7a8b9c3",
    "isFeatured": true
  }
}
```

---

### PATCH `/api/v1/projects/:projectId/unfeature`

Removes featured status from a project.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `admin`

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Project unfeatured successfully",
  "data": {
    "_id": "67be04a2b3c4d5e6f7a8b9c3",
    "isFeatured": false
  }
}
```

---

## 6. Project Resources & Granular Access

### GET `/api/v1/projects/:projectId/resources/:resourceType`

Retrieves the direct URL for a specific resource. Permitted if resource is public, if requester is the project owner, or if requester holds an approved access request.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `student` or `admin`
- **Path Parameters:**
  - `projectId` (Project ObjectId)
  - `resourceType` (Enum: `github`, `deployedLink`, `supportingDocument`)

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Project resource fetched successfully",
  "data": {
    "resourceType": "github",
    "url": "https://github.com/org/repo",
    "accessStatus": "approved"
  }
}
```

#### Error Responses
| Status | Meaning / Reason |
| :--- | :--- |
| **400** | Invalid resource type |
| **403** | Access denied / Resource is protected and no approved access request exists |
| **404** | Project or resource not found |

---

## 7. Project Access Requests

### POST `/api/v1/projects/:projectId/access-requests`

Submits a resource-level access request to the owner of another project within the same college.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `student`
- **Path Parameters:** `projectId` (Target Project ObjectId)

#### Request Body

```json
{
  "resourceType": "github"
}
```
*(Validation: `resourceType` must be `"github"`, `"deployedLink"`, or `"supportingDocument"`).*

#### Success Response (`201 Created`)

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Project access request created successfully",
  "data": {
    "_id": "67be05a2b3c4d5e6f7a8b9c4",
    "project": "67be04a2b3c4d5e6f7a8b9c3",
    "requestedBy": "67be02a2b3c4d5e6f7a8b9c1",
    "resourceType": "github",
    "status": "pending",
    "respondedAt": null,
    "createdAt": "2026-08-27T10:00:00.000Z"
  }
}
```

---

### GET `/api/v1/projects/access-requests/my`

Retrieves all access requests submitted by the authenticated student.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `student`

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Your project access requests fetched successfully",
  "data": [
    {
      "_id": "67be05a2b3c4d5e6f7a8b9c4",
      "resourceType": "github",
      "status": "pending",
      "project": {
        "_id": "67be04a2b3c4d5e6f7a8b9c3",
        "title": "Smart Campus IoT System",
        "domain": "Web Development",
        "department": "Computer Science",
        "academicYear": "2025-26",
        "createdBy": "67be09a2b3c4d5e6f7a8b9c8",
        "college": "67be01a2b3c4d5e6f7a8b9c0"
      },
      "createdAt": "2026-08-27T10:00:00.000Z"
    }
  ]
}
```

---

### GET `/api/v1/projects/:projectId/access-requests`

Retrieves incoming access requests for a specific project owned by the student.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `student`
- **Ownership:** Requester must own the target project

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Project access requests fetched successfully",
  "data": [
    {
      "_id": "67be05a2b3c4d5e6f7a8b9c4",
      "project": "67be04a2b3c4d5e6f7a8b9c3",
      "resourceType": "github",
      "status": "pending",
      "requestedBy": {
        "_id": "67be08a2b3c4d5e6f7a8b9c7",
        "fullName": "Alice Walker",
        "email": "alice@student.edu"
      },
      "createdAt": "2026-08-27T10:00:00.000Z"
    }
  ]
}
```

---

### PATCH `/api/v1/projects/access-requests/:requestId/approve`

Approves a pending access request and notifies the requester.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `student`
- **Ownership:** Project owner

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Project access request approved successfully",
  "data": {
    "_id": "67be05a2b3c4d5e6f7a8b9c4",
    "status": "approved",
    "respondedAt": "2026-08-27T10:15:00.000Z"
  }
}
```

---

### PATCH `/api/v1/projects/access-requests/:requestId/reject`

Rejects a pending access request and notifies the requester.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `student`
- **Ownership:** Project owner

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Project access request rejected successfully",
  "data": {
    "_id": "67be05a2b3c4d5e6f7a8b9c4",
    "status": "rejected",
    "respondedAt": "2026-08-27T10:15:00.000Z"
  }
}
```

---

### DELETE `/api/v1/projects/access-requests/:requestId`

Cancels a pending access request submitted by the student.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `student`
- **Ownership:** Requester of the access request

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Project access request cancelled successfully",
  "data": null
}
```

---

## 8. AI Project Recommendations

### POST `/api/v1/recommendations`

Generates a structured, AI-powered project recommendation using Google Gemini.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `student`
- **Tenant Scope:** Bound to student's college
- **Content-Type:** `application/json`

#### Request Body

```json
{
  "skills": ["Python", "OpenCV", "FastAPI"],
  "domain": "Computer Vision",
  "teamSize": 2,
  "difficulty": "INTERMEDIATE",
  "projectType": "REAL_WORLD"
}
```

#### Validation Rules
- `skills`: Array of strings (1 to 15 items, max 50 characters each).
- `domain`: String (2 to 50 characters).
- `teamSize`: Integer (1 or 2).
- `difficulty`: Enum (`"BEGINNER"`, `"INTERMEDIATE"`, `"ADVANCED"`).
- `projectType`: Enum (`"ACADEMIC"`, `"REAL_WORLD"`, `"INNOVATIVE"`, `"RESEARCH"`).

#### Success Response (`201 Created`)

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Project recommendation generated successfully",
  "data": {
    "_id": "67be06a2b3c4d5e6f7a8b9c5",
    "student": "67be02a2b3c4d5e6f7a8b9c1",
    "college": "67be01a2b3c4d5e6f7a8b9c0",
    "skills": ["Python", "OpenCV", "FastAPI"],
    "domain": "Computer Vision",
    "teamSize": 2,
    "difficulty": "INTERMEDIATE",
    "projectType": "REAL_WORLD",
    "title": "Smart Attendance and Emotion Tracker",
    "whyRecommended": "Utilizes your OpenCV experience to automate attendance monitoring.",
    "introduction": "An edge AI attendance system utilizing face verification...",
    "problemStatement": "Manual roll call consumes valuable instructional time...",
    "proposedSolution": "Automated face detection on live camera feeds...",
    "keyFeatures": [
      "Real-time face detection",
      "Automated attendance report generation",
      "Engagement analytics dashboard"
    ],
    "technologies": ["Python", "OpenCV", "FastAPI", "React"],
    "expectedOutcome": "A fully functional prototype tested on student batches...",
    "conclusion": "A high-impact final year project with practical deployment viability.",
    "createdAt": "2026-08-27T10:00:00.000Z"
  }
}
```

---

### GET `/api/v1/recommendations`

Retrieves all saved recommendations generated for the student.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `student`

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Project recommendations fetched successfully",
  "data": [
    {
      "_id": "67be06a2b3c4d5e6f7a8b9c5",
      "title": "Smart Attendance and Emotion Tracker",
      "domain": "Computer Vision",
      "difficulty": "INTERMEDIATE",
      "createdAt": "2026-08-27T10:00:00.000Z"
    }
  ]
}
```

---

### DELETE `/api/v1/recommendations/:id`

Deletes a saved recommendation belonging to the student.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `student`

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Project recommendation deleted successfully",
  "data": null
}
```

---

## 9. Notifications

### GET `/api/v1/notifications`

Retrieves all notifications for the authenticated user, sorted in descending order.

- **Authentication:** Required (`verifyJWT`)
- **Role:** Any

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Notifications fetched successfully",
  "data": [
    {
      "_id": "67be07a2b3c4d5e6f7a8b9c6",
      "recipient": "67be02a2b3c4d5e6f7a8b9c1",
      "type": "PROJECT_ACCESS_APPROVED",
      "title": "Project Access Approved",
      "message": "Your request for github access has been approved for the project 'Smart Campus'.",
      "relatedResource": "67be04a2b3c4d5e6f7a8b9c3",
      "isRead": false,
      "createdAt": "2026-08-27T10:00:00.000Z"
    }
  ]
}
```

---

### GET `/api/v1/notifications/unread-count`

Returns the count of unread notifications for the user.

- **Authentication:** Required (`verifyJWT`)

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Unread notification count fetched successfully",
  "data": {
    "count": 3
  }
}
```

---

### PATCH `/api/v1/notifications/:id/read`

Marks a specific notification as read.

- **Authentication:** Required (`verifyJWT`)

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Notification marked as read successfully",
  "data": {
    "_id": "67be07a2b3c4d5e6f7a8b9c6",
    "isRead": true
  }
}
```

---

### PATCH `/api/v1/notifications/read-all`

Marks all unread notifications for the user as read.

- **Authentication:** Required (`verifyJWT`)

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "All notifications marked as read successfully",
  "data": null
}
```

---

### DELETE `/api/v1/notifications/:id`

Deletes a single notification.

- **Authentication:** Required (`verifyJWT`)

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Notification deleted successfully",
  "data": {
    "id": "67be07a2b3c4d5e6f7a8b9c6"
  }
}
```

---

## 10. Dashboards & Analytics

### GET `/api/v1/dashboard/admin`

Returns college-level administrative metrics, academic year distributions, proposal breakdowns, popular technologies, and trending domains.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `admin`
- **Tenant Scope:** Scoped to admin's college

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Dashboard analytics fetched successfully",
  "data": {
    "kpis": {
      "totalStudents": 150,
      "totalProjects": 45,
      "pendingProposals": 8,
      "featuredProjects": 5
    },
    "projectsByAcademicYear": [
      { "academicYear": "2024-25", "count": 20 },
      { "academicYear": "2025-26", "count": 25 }
    ],
    "proposalOverview": {
      "pending": 8,
      "approved": 32,
      "rejected": 5
    },
    "popularTechnologies": [
      { "technology": "React", "count": 28 },
      { "technology": "Node.js", "count": 25 }
    ],
    "trendingDomains": [
      { "domain": "Web Development", "count": 18 },
      { "domain": "Artificial Intelligence", "count": 12 }
    ]
  }
}
```

---

### GET `/api/v1/dashboard/student`

Returns personal project contribution counts, access requests sent/received, proposal status summary, and discovery projects.

- **Authentication:** Required (`verifyJWT`)
- **Role:** `student`
- **Tenant Scope:** Scoped to student and student's college

#### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Student dashboard fetched successfully",
  "data": {
    "kpis": {
      "projectContributions": 2,
      "accessRequestsSent": 4,
      "accessRequestsReceived": 3
    },
    "proposal": {
      "exists": true,
      "id": "67be03a2b3c4d5e6f7a8b9c2",
      "title": "Autonomous Drone Navigation System",
      "teamSize": 2,
      "status": "approved",
      "adminRemarks": null,
      "createdAt": "2026-08-27T10:00:00.000Z",
      "updatedAt": "2026-08-27T10:05:00.000Z"
    },
    "discoverProjects": [
      {
        "_id": "67be04a2b3c4d5e6f7a8b9c3",
        "title": "Smart Campus IoT System",
        "summary": "IoT and Web platform for smart campus automation.",
        "technologies": ["React", "Node.js"],
        "domain": "Web Development",
        "department": "Computer Science",
        "academicYear": "2025-26",
        "isFeatured": true,
        "createdAt": "2026-08-27T10:00:00.000Z"
      }
    ]
  }
}
```
