# LeadDesk Mini

A full-stack lead generation and management application built with React, Node.js, Express, and MongoDB.

## Data Model

The application uses two primary data models stored in MongoDB:

### 1. Lead
Stores information submitted by potential clients from the landing page.
- `name` (String): Full name of the prospect.
- `email` (String): Contact email address.
- `budgetRange` (String): Selected budget bracket.
- `message` (String): Project details.
- `status` (Enum): Current stage of the lead (`New`, `Contacted`, `Closed`). Defaults to `New`.
- `createdAt` (Date): Timestamp of submission.

### 2. Admin
Stores administrator credentials for accessing the dashboard.
- `username` (String): Unique admin username.
- `passwordHash` (String): Securely hashed password using `bcryptjs`.

---

## Authentication Approach

The admin dashboard is secured using **JSON Web Tokens (JWT)**. 

1. **Login Flow**: 
   - The user visits `/admin/login` and submits credentials.
   - The backend `POST /api/auth/login` endpoint compares the provided password with the hashed password in the database using `bcryptjs`.
   - If successful, a JWT signed with a secret key is returned.
2. **Session Handling**: 
   - The frontend stores the JWT in `localStorage`.
   - React Router uses a `<ProtectedRoute>` wrapper around `/admin`. If no token exists in `localStorage`, it redirects to `/admin/login`.
3. **API Protection**:
   - The frontend attaches the token to API requests using the `Authorization: Bearer <token>` header.
   - A backend `authMiddleware` intercepts requests to protected routes (`GET /api/leads` and `PATCH /api/leads/:id`). It verifies the token signature before allowing access. If the token is invalid or missing, it responds with a `401 Unauthorized`, which prompts the frontend to clear `localStorage` and redirect to the login page.

---

## Deployment

The repository includes deployment configurations for deploying the stack on free-tier platforms.

### Backend (Render)
A `render.yaml` blueprint is provided in the `backend/` directory.
- Simply connect your repository to Render.
- Render will automatically provision a Web Service using the blueprint.
- Ensure you provide a valid `MONGODB_URI` environment variable connecting to a MongoDB Atlas cluster.

### Frontend (Vercel)
A `vercel.json` configuration is provided in the `frontend/` directory to handle SPA routing rewrites.
- Connect your repository to Vercel.
- Set the Root Directory to `frontend`.
- Set the `VITE_API_URL` environment variable to your deployed Render backend URL.

## Local Development

**1. Clone the repository**
**2. Setup Backend:**
```bash
cd backend
npm install
npm run dev
```
*(Requires a local MongoDB instance running on port 27017, or a `MONGODB_URI` in `.env`)*

**3. Setup Frontend:**
```bash
cd frontend
npm install
npm run dev
```

*Note: The backend automatically seeds a default admin user (`username: admin`, `password: password123`) on startup if no admins exist in the database.*
