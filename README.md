JobConnect – MERN Stack Job Portal
JobConnect is a full-stack job portal built with the MERN stack (MongoDB, Express.js, React, Node.js). It allows users to register, log in, browse jobs, apply for positions, and manage their profiles. Employers can post and manage job listings.

🚀 Features
- 🔐 JWT-based authentication
- 👤 Role-based access (Jobseeker vs Employer)
- 📄 Resume upload (Multer)
- 📋 Job listing and application tracking
- 🔧 RESTful API with Express
- ⚛️ React frontend with protected routes
- 🌐 Deployed backend (Render) and frontend (Vercel)

🧱 Project Structure
project-root/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env



⚙️ Installation
1. Clone the repo
git clone https://github.com/HARRY-glitch-max/PROJECT-1.git
cd jobconnect


2. Backend Setup
cd backend
npm install


Create .env:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret


3. Frontend Setup
cd frontend
npm install


Create frontend/.env:
VITE_API_URL=http://localhost:5000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_anVzdC1yb29zdGVyLTcwLmNsZXJrLmFjY291bnRzLmRldiQ



🧪 Running Locally
Backend
npm run dev


Frontend
npm run dev



🔐 Authentication Flow
- Users register/login via /users/register and /users/login
- JWT token is returned and stored in localStorage
- Protected routes use ProtectedRoute.jsx to guard access
- Backend uses authMiddleware.js to verify tokens

📦 API Endpoints
Auth
- POST /users/register
- POST /users/login
- GET /users/profile (protected)
Jobs
- GET /jobs
- GET /jobs/:id
- POST /jobs (employer only)
- PUT /jobs/:id
- DELETE /jobs/:id
Applications
- POST /applications/:jobId
- GET /applications (user-specific)

🧠 How It Works
- Frontend uses Axios to call backend APIs, attaching JWT tokens automatically
- Backend uses Express routes and Mongoose models to handle data
- ProtectedRoute.jsx ensures only logged-in users access sensitive pages
- Navbar.jsx dynamically shows links based on login state
- JobCard.jsx displays job listings fetched from the backend

🚀 Deployment
- Backend deployed to Render
- Frontend deployed to Vercel
- Environment variables configured in both platforms

🧪 Testing & Debugging
- Use Postman or frontend to test endpoints
- Console logs and error handling are built into controllers
- JWT errors return 401 with descriptive messages

