<div align="center">

# 🎯 LeadDesk

**A full-stack lead generation and management platform built for speed, security, and simplicity.**

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://lead-desk-omega.vercel.app)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Framework-Express-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)

[Live App](https://lead-desk-omega.vercel.app) · [Report Bug](https://github.com/Harshvardhan00001/LeadDesk/issues) · [Request Feature](https://github.com/Harshvardhan00001/LeadDesk/issues)

</div>

---

## 📖 Overview

**LeadDesk** is a lightweight MERN-stack application that lets businesses capture leads from a public landing page and manage them through a secure, JWT-authenticated admin dashboard. Built with a clean separation between `frontend` and `backend`, it's designed to be cloned, configured, and deployed to production in minutes.

---

## ✨ Features

- 📝 **Public Lead Capture** — Landing page form to collect name, email, budget range, and project details
- 🔐 **JWT-Secured Admin Dashboard** — Token-based authentication with protected routes
- 📊 **Lead Lifecycle Tracking** — Manage lead status through `New → Contacted → Closed`
- 🔑 **Hashed Credentials** — Passwords secured with `bcryptjs`
- 🛡️ **Protected API Routes** — Middleware-enforced authorization on sensitive endpoints
- ☁️ **One-Click Deployment** — Pre-configured for Render (backend) and Vercel (frontend)

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB (Mongoose) |
| Auth | JSON Web Tokens (JWT), bcryptjs |
| Deployment | Render (API), Vercel (Client) |

---

## 🗂️ Data Model

### Lead
| Field | Type | Description |
|---|---|---|
| `name` | String | Full name of the prospect |
| `email` | String | Contact email address |
| `budgetRange` | String | Selected budget bracket |
| `message` | String | Project details |
| `status` | Enum | `New` \| `Contacted` \| `Closed` (default: `New`) |
| `createdAt` | Date | Submission timestamp |

### Admin
| Field | Type | Description |
|---|---|---|
| `username` | String | Unique admin username |
| `passwordHash` | String | Bcrypt-hashed password |

---

## 🔐 Authentication Flow

1. **Login** — User submits credentials at `/admin/login`; `POST /api/auth/login` verifies the password against the stored hash and returns a signed JWT.
2. **Session Handling** — The frontend stores the JWT in `localStorage`; a `<ProtectedRoute>` wrapper guards `/admin` and redirects unauthenticated users to login.
3. **API Protection** — Requests attach `Authorization: Bearer <token>`; an `authMiddleware` validates the token on protected routes (`GET /api/leads`, `PATCH /api/leads/:id`) and returns `401 Unauthorized` on failure, prompting the client to clear the token and redirect.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local on port `27017`, or a `MONGODB_URI` from MongoDB Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/Harshvardhan00001/LeadDesk.git
cd LeadDesk
```

### 2. Set up the backend
```bash
cd backend
npm install
npm run dev
```

### 3. Set up the frontend
```bash
cd frontend
npm install
npm run dev
```


---

## ☁️ Deployment

### Backend — Render
A `render.yaml` blueprint is included in `backend/`.
1. Connect the repository to Render.
2. Render provisions a Web Service automatically from the blueprint.
3. Set the `MONGODB_URI` environment variable to your MongoDB Atlas connection string.

### Frontend — Vercel
A `vercel.json` config is included in `frontend/` for SPA routing.
1. Connect the repository to Vercel.
2. Set the **Root Directory** to `frontend`.
3. Set `VITE_API_URL` to your deployed Render backend URL.

---

## 📁 Project Structure

```
LeadDesk/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts      # Login logic, JWT issuance
│   │   │   └── leadController.ts      # Lead CRUD & status updates
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts      # JWT verification for protected routes
│   │   ├── models/
│   │   │   ├── Admin.ts               # Admin schema (username, passwordHash)
│   │   │   └── Lead.ts                # Lead schema (name, email, status, etc.)
│   │   ├── routes/
│   │   │   ├── authRoutes.ts          # /api/auth endpoints
│   │   │   └── leadRoutes.ts          # /api/leads endpoints
│   │   └── index.ts                   # App entry point
│   ├── .env.example
│   ├── package.json
│   ├── render.yaml                    # Render deployment blueprint
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/                    # Images & static assets
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   └── Themetoggle.tsx
│   │   ├── hooks/
│   │   │   └── Usethememode.ts        # Dark/light theme hook
│   │   ├── pages/
│   │   │   ├── AdminLoginPage.tsx
│   │   │   ├── AdminPage.tsx          # Protected dashboard
│   │   │   └── LandingPage.tsx        # Public lead-capture page
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vercel.json                    # SPA routing config for Vercel
│   └── vite.config.ts
│
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License.

---

<div align="center">

Built by [Harshvardhan00001](https://github.com/Harshvardhan00001)

</div>
