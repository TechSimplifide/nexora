<div align="center">

# 🚀 Nexora

### Product Requirements Document (PRD)

**Version:** 1.0  
**Project Type:** Multi-Tenant SaaS Web Application  
**Status:** Draft

---

_A centralized academic project collaboration platform for colleges._

</div>

---

# Table of Contents

1. Project Overview
2. Problem Statement
3. Objectives
4. Target Users
5. User Roles
6. Product Features
7. Functional Requirements
8. Non-Functional Requirements
9. System Workflows
10. Database Collections
11. Technology Stack
12. Expected Outcome
13. Future Scope
14. Conclusion

---

# 1. Project Overview

## Project Name

**Nexora**

## Project Type

Multi-College Academic Project Collaboration Platform (SaaS)

## Description

Nexora is a modern web-based platform designed to help educational institutions digitally manage Final Year Projects (FYP). It enables students to upload previous projects, submit project proposals, discover innovative ideas, and securely access project resources through a permission-based workflow.

The platform follows a **multi-tenant architecture**, allowing multiple colleges to use a single application while ensuring complete data isolation and security for each institution.

---

# 2. Problem Statement

Many educational institutions still manage final-year projects manually or through scattered records, resulting in several challenges:

- Difficulty accessing previous year projects
- Repetition of similar project ideas
- Manual proposal approval processes
- Poor project record management
- Limited inspiration for students
- No centralized project repository
- Lack of secure access control

---

# 3. Objectives

The primary objectives of Nexora are:

- Centralize academic project management
- Digitize project proposal workflows
- Reduce duplicate project ideas
- Improve project discoverability
- Enable secure project sharing
- Support multiple colleges using a single platform
- Provide AI-powered project recommendations
- Improve collaboration between students and administrators

---

# 4. Target Users

The platform is primarily designed for:

- 🎓 Students
- 👨‍💼 College Administrators
- 🏫 Educational Institutions

---

# 5. User Roles

## 5.1 Student

Students can:

- Register and Login
- Manage profile
- Upload completed projects
- Submit project proposals
- Explore previous projects
- Search and filter projects
- Request access to private projects
- Receive notifications
- Get AI-generated project ideas

---

## 5.2 Administrator

Administrators can:

- Manage students
- Review project proposals
- Approve or reject proposals
- Add proposal remarks
- Manage featured projects
- Monitor uploaded projects
- Handle project access requests
- Manage platform content

---

# 6. Product Features

---

## 6.1 Multi-College Architecture

- SaaS-based architecture
- Multiple colleges on one platform
- Secure tenant isolation
- Data separated using `collegeId`

---

## 6.2 Authentication & Authorization

### Features

- JWT Authentication
- Role-Based Access Control (RBAC)
- Protected APIs
- Protected Routes
- Password Encryption (bcrypt)

---

## 6.3 Previous Year Project Archive

Students can upload:

- Project Title
- Description
- Technologies Used
- Domain
- Academic Year
- Team Members
- Screenshots
- GitHub Repository
- Demo Link (Optional)
- Summary PDF

Students can also browse all previous projects.

---

## 6.4 Smart Search & Filtering

Projects can be filtered using:

- Project Title
- Technology
- Domain
- Academic Year
- Featured Projects

---

## 6.5 Featured Project Showcase

Administrators can mark projects as:

- Featured

Featured projects receive higher visibility on the homepage.

---

## 6.6 Project Proposal Workflow

Students can:

- Submit proposal
- Upload abstract PDF
- Add team members

Administrators can:

- Review proposals
- Approve proposals
- Reject proposals
- Add remarks

### Proposal Status

| Status   | Description           |
| -------- | --------------------- |
| Pending  | Waiting for review    |
| Approved | Accepted by admin     |
| Rejected | Rejected with remarks |

---

## 6.7 Project Access Request Workflow

Each project has one visibility type.

### Public

Anyone from the same college can view complete project details.

### Request Access

Students must request permission before viewing:

- Source Code
- GitHub Repository
- Documents
- Complete Resources

Project owner can:

- Approve Request
- Reject Request

---

## 6.8 AI Project Recommendation

Students provide:

- Skills
- Interests
- Preferred Technologies

The AI module generates:

- Suitable project ideas
- Recommended technologies
- Domain suggestions
- Difficulty level

Suggestion history will also be stored.

---

## 6.9 Notification System

Students receive notifications for:

- Proposal Approved
- Proposal Rejected
- Access Request Approved
- Access Request Rejected
- Important Updates

Notifications can be marked as read.

---

# 7. Functional Requirements

---

## Authentication Module

- User Registration
- User Login
- JWT Generation
- Password Hashing
- Authorization Middleware

---

## User Module

- Update Profile
- View Profile
- Manage Student Accounts

---

## Project Module

- Upload Project
- Edit Project
- Delete Project
- View Projects
- Search Projects
- Filter Projects
- Feature Project

---

## Proposal Module

- Submit Proposal
- Review Proposal
- Approve Proposal
- Reject Proposal
- Add Remarks
- Track Proposal Status

---

## Access Request Module

- Send Request
- View Requests
- Approve Request
- Reject Request
- Track Status

---

## AI Suggestion Module

- Generate Suggestions
- Store Suggestion History
- View Previous Suggestions

---

## Notification Module

- Create Notification
- Mark as Read
- Notification History

---

# 8. Non-Functional Requirements

## Security

- JWT Authentication
- bcrypt Password Hashing
- Protected APIs
- Role-Based Authorization
- Secure File Uploads

---

## Performance

- Optimized MongoDB Queries
- Fast API Responses
- Lazy Loading
- Pagination

---

## Scalability

- Multi-Tenant Architecture
- Modular Backend
- Cloud Storage
- RESTful APIs

---

## Reliability

- Error Handling
- Validation
- Logging
- Secure File Storage

---

## Responsiveness

- Mobile Friendly
- Tablet Support
- Desktop Support
- Responsive Dashboard

---

# 9. System Workflows

---

## 9.1 Project Proposal Workflow

```text
Student
   │
   ▼
Submit Proposal
   │
   ▼
Admin Reviews Proposal
   │
   ├───────────────┐
   ▼               ▼
Approve         Reject
   │               │
   ▼               ▼
Notification   Notification
```

---

## 9.2 Project Access Workflow

```text
Student
   │
   ▼
Request Project Access
   │
   ▼
Project Owner Reviews
   │
   ├───────────────┐
   ▼               ▼
Approve         Reject
   │               │
   ▼               ▼
Full Access    Notification
```

---

# 10. Database Collections

The application consists of the following MongoDB collections:

| Collection      | Purpose                     |
| --------------- | --------------------------- |
| colleges        | College information         |
| students        | Student accounts            |
| admins          | Administrator accounts      |
| projects        | Uploaded projects           |
| proposals       | Project proposals           |
| access_requests | Project permission requests |
| notifications   | User notifications          |
| ai_suggestions  | AI recommendation history   |

---

# 11. Technology Stack

## Frontend

- React.js
- Tailwind CSS
- React Router DOM

---

## Backend

- Node.js
- Express.js

---

## Database

- MongoDB

---

## Authentication

- JWT
- bcrypt

---

## File Storage

- Cloudinary

---

## AI Integration

- Google Gemini API
- OpenAI API _(Optional)_

---

## Version Control

- Git
- GitHub

---

# 12. Expected Outcome

After successful implementation, Nexora will provide:

- ✅ Centralized project repository
- ✅ Efficient proposal management
- ✅ AI-powered project recommendations
- ✅ Secure project sharing
- ✅ Reduced duplicate project ideas
- ✅ Better project discoverability
- ✅ Simplified academic workflows
- ✅ Multi-college support

---

# 13. Future Scope

Future enhancements may include:

- 💬 Real-time Chat
- 👥 Team Collaboration
- ⭐ Project Ratings & Reviews
- 🤖 Advanced AI Recommendations
- 📊 Analytics Dashboard
- 📅 Project Timeline Tracking
- 🎥 Video Demonstrations
- 🏆 Achievement & Badges
- 💼 Internship & Industry Collaboration
- 🔔 Real-time Notifications using WebSockets

---

# 14. Conclusion

Nexora aims to modernize how educational institutions manage final-year academic projects. By combining project archiving, proposal management, secure collaboration, AI-powered recommendations, and a scalable multi-tenant architecture, the platform creates a comprehensive ecosystem that benefits students, administrators, and colleges alike.

It not only preserves valuable academic work but also encourages innovation, improves accessibility, and streamlines the entire project lifecycle.

---

<div align="center">

**Built with ❤️ for Academic Innovation**

**Nexora © 2026**

</div>
