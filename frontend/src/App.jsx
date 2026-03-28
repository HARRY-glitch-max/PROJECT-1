import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { AuthContext } from "./contexts/AuthContext";
import Navbar from "./components/layout/Navbar";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";

// Shared
import ChatPage from "./pages/ChatPage";

// Jobseeker
import JobseekerLogin from "./pages/JobseekerLogin";
import JobseekerRegister from "./pages/JobseekerRegister";
import JobseekerDashboard from "./pages/JobseekerDashboard";
import JobseekerNotifications from "./pages/JobseekerNotifications";
import JobseekerInterviews from "./pages/JobseekerInterviews";

// Employer
import EmployerLogin from "./pages/EmployerLogin";
import EmployerRegister from "./pages/EmployerRegister";
import EmployerDashboard from "./pages/EmployerDashboard";

// Admin
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import AdminDashboard from "./pages/AdminDashboard";

const AppContent = () => {
  const { loading, user, role } = useContext(AuthContext);
  const location = useLocation();

  const hideNavbar =
    location.pathname.startsWith("/employer/dashboard") ||
    location.pathname.startsWith("/admin/dashboard") ||
    location.pathname.startsWith("/jobseeker/dashboard");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isAuthenticated = !!user;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {!hideNavbar && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* ================= JOBSEEKER ================= */}

          <Route
            path="/jobseeker/login"
            element={
              !isAuthenticated ? (
                <JobseekerLogin />
              ) : (
                <Navigate to="/jobseeker/dashboard" replace />
              )
            }
          />

          <Route
            path="/jobseeker/register"
            element={
              !isAuthenticated ? (
                <JobseekerRegister />
              ) : (
                <Navigate to="/jobseeker/dashboard" replace />
              )
            }
          />

          <Route
            path="/jobseeker/dashboard/*"
            element={
              isAuthenticated && role === "jobseeker" ? (
                <JobseekerDashboard />
              ) : (
                <Navigate to="/jobseeker/login" replace />
              )
            }
          />

          <Route
            path="/jobseeker/dashboard/notifications"
            element={
              isAuthenticated && role === "jobseeker" ? (
                <JobseekerNotifications />
              ) : (
                <Navigate to="/jobseeker/login" replace />
              )
            }
          />

          <Route
            path="/jobseeker/dashboard/interviews"
            element={
              isAuthenticated && role === "jobseeker" ? (
                <JobseekerInterviews />
              ) : (
                <Navigate to="/jobseeker/login" replace />
              )
            }
          />

          {/* ================= EMPLOYER ================= */}

          <Route
            path="/employer/login"
            element={
              !isAuthenticated ? (
                <EmployerLogin />
              ) : (
                <Navigate to="/employer/dashboard" replace />
              )
            }
          />

          <Route
            path="/employer/register"
            element={
              !isAuthenticated ? (
                <EmployerRegister />
              ) : (
                <Navigate to="/employer/dashboard" replace />
              )
            }
          />

          <Route
            path="/employer/dashboard/*"
            element={
              isAuthenticated && role === "employer" ? (
                <EmployerDashboard />
              ) : (
                <Navigate to="/employer/login" replace />
              )
            }
          />

          {/* ================= ADMIN ================= */}

          <Route
            path="/admin/login"
            element={
              !isAuthenticated ? (
                <AdminLogin />
              ) : (
                <Navigate to="/admin/dashboard" replace />
              )
            }
          />

          <Route
            path="/admin/register"
            element={
              !isAuthenticated ? (
                <AdminRegister />
              ) : (
                <Navigate to="/admin/dashboard" replace />
              )
            }
          />

          <Route
            path="/admin/dashboard/*"
            element={
              isAuthenticated && role === "admin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/admin/login" replace />
              )
            }
          />

          {/* ================= SHARED ================= */}

          <Route
            path="/chat"
            element={
              isAuthenticated ? (
                <ChatPage />
              ) : (
                <Navigate to="/jobseeker/login" replace />
              )
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!hideNavbar && (
        <footer className="py-10 text-center text-slate-500 dark:text-slate-600 text-sm border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          © 2026 JobConnect. All rights reserved.
        </footer>
      )}
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;