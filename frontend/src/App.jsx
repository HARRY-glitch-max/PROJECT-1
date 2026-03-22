import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

// 1. Fixed plural folder name: 'context' -> 'contexts'
import { AuthContext } from "./contexts/AuthContext"; 

// 2. Fixed subfolder path: 'components' -> 'components/layout'
import Navbar from "./components/layout/Navbar"; 

// 3. Keep these as is (assuming pages are directly in src/pages)
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import EmployerLogin from "./pages/EmployerLogin";
import PostJob from "./pages/PostJob";
import EmployerDashboard from "./pages/EmployerDashboard";

const AppContent = () => {
  const { loading, isAuthenticated, auth } = useContext(AuthContext);
  const location = useLocation();

  // Hide Navbar when inside employer dashboard
  const hideNavbar = location.pathname.startsWith("/employer/dashboard");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {!hideNavbar && <Navbar />}

      {/* Removed the 'p-4' from main so the Hero banner can be full-width */}
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/profile" replace />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <Register /> : <Navigate to="/profile" replace />}
          />
          <Route
            path="/employer/login"
            element={!isAuthenticated ? <EmployerLogin /> : <Navigate to="/employer/dashboard" replace />}
          />

          {/* Jobseeker-only routes */}
          <Route
            path="/jobs"
            element={isAuthenticated && auth?.role === "jobseeker" ? <Jobs /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profile"
            element={isAuthenticated && auth?.role === "jobseeker" ? <Profile /> : <Navigate to="/login" replace />}
          />

          {/* Shared route */}
          <Route
            path="/chat"
            element={isAuthenticated ? <Chat /> : <Navigate to="/login" replace />}
          />

          {/* Employer-only routes */}
          <Route
            path="/jobs/create"
            element={isAuthenticated && auth?.role === "employer" ? <PostJob /> : <Navigate to="/employer/login" replace />}
          />
          <Route
            path="/employer/dashboard/*"
            element={isAuthenticated && auth?.role === "employer" ? <EmployerDashboard /> : <Navigate to="/employer/login" replace />}
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