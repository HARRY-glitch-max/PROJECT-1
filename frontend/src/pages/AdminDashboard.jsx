// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { getAdminReports } from "../services/api"; // ✅ backend reports endpoint
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await getAdminReports(); // ✅ calls /api/admin/reports
        setReports(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-md p-6 rounded">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">
        Admin Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Jobs Section */}
        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">Jobs</h3>
          <p>Total: {reports.jobs.total}</p>
          <p>Active: {reports.jobs.active}</p>
          <p>Closed: {reports.jobs.closed}</p>
        </div>

        {/* Applications Section */}
        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">Applications</h3>
          <p>Total: {reports.applications.total}</p>
          <p>Shortlisted: {reports.applications.shortlisted}</p>
          <p>Hired: {reports.applications.hired}</p>
          <p>Rejected: {reports.applications.rejected}</p>
          <p>Pending: {reports.applications.pending}</p>
        </div>

        {/* Interviews Section */}
        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">Interviews</h3>
          <p>Total: {reports.interviews.total}</p>
          <p>Completed: {reports.interviews.completed}</p>
          <p>Scheduled: {reports.interviews.scheduled}</p>
          <p>Cancelled: {reports.interviews.cancelled}</p>
        </div>
      </div>

      <div className="mt-6">
        <Button onClick={() => navigate("/admin/profile")}>
          Go to Profile
        </Button>
      </div>
    </div>
  );
}
