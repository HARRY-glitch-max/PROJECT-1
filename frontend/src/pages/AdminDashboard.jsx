// src/pages/AdminDashboard.jsx
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { AuthContext } from "../contexts/AuthContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, role, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-blue-700">Admin Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Logged in as <strong>{user?.name}</strong> ({role})
            </span>
            <Button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Profile</h3>
            <p className="text-gray-600 mb-4">
              Manage your admin profile details.
            </p>
            <Button onClick={() => navigate("/admin/profile")}>
              Go to Profile
            </Button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-green-700 mb-2">Reports</h3>
            <p className="text-gray-600 mb-4">
              View jobs, applications, and interviews reports.
            </p>
            <Button onClick={() => navigate("/admin/reports")}>
              View Reports
            </Button>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Welcome back!
          </h3>
          <p className="text-gray-600">
            Use the quick actions above to manage your admin tasks. You can
            update your profile or check reports. This dashboard is designed to
            give you a clean overview and easy navigation.
          </p>
        </div>
      </div>
    </div>
  );
}
