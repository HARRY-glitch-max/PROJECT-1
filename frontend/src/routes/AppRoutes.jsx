import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ApplyJob from "../pages/ApplyJob";
import MyApplications from "../pages/MyApplications";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Jobseeker-only route */}
      <Route
        path="/apply/:jobId"
        element={
          <ProtectedRoute allowedRoles={["jobseeker"]}>
            <ApplyJob />
          </ProtectedRoute>
        }
      />

      {/* Jobseeker dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["jobseeker"]}>
            <MyApplications />
          </ProtectedRoute>
        }
      />

      {/* Employer dashboard */}
      <Route
        path="/employer/dashboard"
        element={
          <ProtectedRoute allowedRoles={["employer"]}>
            <div>Employer Dashboard</div>
          </ProtectedRoute>
        }
      />

      {/* Admin dashboard */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <div>Admin Dashboard</div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
