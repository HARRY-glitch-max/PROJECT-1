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

// Chat page (shared between employer & jobseeker)
import ChatPage from "./pages/ChatPage";

// Role-specific pages
import JobseekerLogin from "./pages/JobseekerLogin";
import JobseekerRegister from "./pages/JobseekerRegister";
import JobseekerProfile from "./pages/JobseekerProfile";
import JobseekerDashboard from "./pages/JobseekerDashboard";
import ApplyJob from "./pages/ApplyJob";

import EmployerLogin from "./pages/EmployerLogin";
import EmployerRegister from "./pages/EmployerRegister";
import EmployerProfile from "./pages/EmployerProfile";
import EmployerDashboard from "./pages/EmployerDashboard";
import PostJob from "./pages/PostJob";
import EmployerApplications from "./pages/EmployerApplications";

import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import AdminProfile from "./pages/AdminProfile";
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
          {/* Public routes */}
          <Route path="/" element={<Home key={location.pathname} />} />

          {/* Jobseeker routes */}
          <Route
            path="/jobseeker/login"
            element={
              !isAuthenticated ? (
                <JobseekerLogin key={location.pathname} />
              ) : (
                <Navigate to="/jobseeker/dashboard" replace />
              )
            }
          />
          <Route
            path="/jobseeker/register"
            element={
              !isAuthenticated ? (
                <JobseekerRegister key={location.pathname} />
              ) : (
                <Navigate to="/jobseeker/dashboard" replace />
              )
            }
          />
          <Route
            path="/jobs"
            element={
              isAuthenticated && role === "jobseeker" ? (
                <Jobs key={location.pathname} />
              ) : (
                <Navigate to="/jobseeker/login" replace />
              )
            }
          />
          <Route
            path="/jobs/:jobId/apply"
            element={
              isAuthenticated && role === "jobseeker" ? (
                <ApplyJob key={location.pathname} />
              ) : (
                <Navigate to="/jobseeker/login" replace />
              )
            }
          />
          <Route
            path="/jobseeker/profile"
            element={
              isAuthenticated && role === "jobseeker" ? (
                <JobseekerProfile key={location.pathname} />
              ) : (
                <Navigate to="/jobseeker/login" replace />
              )
            }
          />
          <Route
            path="/jobseeker/dashboard/*"
            element={
              isAuthenticated && role === "jobseeker" ? (
                <JobseekerDashboard key={location.pathname} />
              ) : (
                <Navigate to="/jobseeker/login" replace />
              )
            }
          />

          {/* Employer routes */}
          <Route
            path="/employer/login"
            element={
              !isAuthenticated ? (
                <EmployerLogin key={location.pathname} />
              ) : (
                <Navigate to="/employer/dashboard" replace />
              )
            }
          />
          <Route
            path="/employer/register"
            element={
              !isAuthenticated ? (
                <EmployerRegister key={location.pathname} />
              ) : (
                <Navigate to="/employer/dashboard" replace />
              )
            }
          />
          <Route
            path="/employer/profile"
            element={
              isAuthenticated && role === "employer" ? (
                <EmployerProfile key={location.pathname} />
              ) : (
                <Navigate to="/employer/login" replace />
              )
            }
          />
          <Route
            path="/jobs/create"
            element={
              isAuthenticated && role === "employer" ? (
                <PostJob key={location.pathname} />
              ) : (
                <Navigate to="/employer/login" replace />
              )
            }
          />
          <Route
            path="/employer/dashboard/applications"
            element={
              isAuthenticated && role === "employer" ? (
                <EmployerApplications key={location.pathname} />
              ) : (
                <Navigate to="/employer/login" replace />
              )
            }
          />
          <Route
            path="/employer/dashboard/*"
            element={
              isAuthenticated && role === "employer" ? (
                <EmployerDashboard key={location.pathname} />
              ) : (
                <Navigate to="/employer/login" replace />
              )
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/login"
            element={
              !isAuthenticated ? (
                <AdminLogin key={location.pathname} />
              ) : (
                <Navigate to="/admin/dashboard" replace />
              )
            }
          />
          <Route
            path="/admin/register"
            element={
              !isAuthenticated ? (
                <AdminRegister key={location.pathname} />
              ) : (
                <Navigate to="/admin/dashboard" replace />
              )
            }
          />
          <Route
            path="/admin/profile"
            element={
              isAuthenticated && role === "admin" ? (
                <AdminProfile key={location.pathname} />
              ) : (
                <Navigate to="/admin/login" replace />
              )
            }
          />
          <Route
            path="/admin/dashboard/*"
            element={
              isAuthenticated && role === "admin" ? (
                <AdminDashboard key={location.pathname} />
              ) : (
                <Navigate to="/admin/login" replace />
              )
            }
          />

          {/* Shared Chat route */}
          <Route
            path="/chat"
            element={
              isAuthenticated ? (
                <ChatPage key={location.pathname} />
              ) : (
                <Navigate to="/jobseeker/login" replace />
              )
            }
          />

          {/* Catch-all */}
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
