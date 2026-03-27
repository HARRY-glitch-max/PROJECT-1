import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { FileText, ExternalLink, MessageSquare } from "lucide-react";
import {
  getEmployerApplications,
  updateApplicationStatus,
} from "../api/applications";
import StatusBadge from "../components/applications/StatusBadge";

const EmployerApplications = ({ setSelectedChatUser }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);

  // --- Fetch applications for the logged-in employer ---
  const fetchApps = async () => {
    if (!user?.employerId) {
      setError("Employer ID not found. Are you logged in as an employer?");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getEmployerApplications(user.employerId);
      setApps(data.applications || []);
      setCount(data.count || 0);
    } catch (err) {
      console.error("Error fetching employer applications", err);
      setError("Failed to load applications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [user?.employerId]);

  // --- Handle application status updates ---
  const handleReview = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      setApps((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error("Error updating status", err);
      alert("Failed to update status. Try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Applications for My Jobs</h1>
      {count > 0 && (
        <p className="text-slate-600 mb-6">{count} applications found</p>
      )}

      {loading ? (
        <p>Loading applications...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : apps.length > 0 ? (
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4">Job Title</th>
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Resume</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">{app.jobId?.title}</td>
                  <td className="px-6 py-4">
                    {app.userId?.name}
                    <br />
                    <span className="text-sm text-slate-500">
                      {app.userId?.email}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={app.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <FileText size={14} /> View <ExternalLink size={14} />
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-4 flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleReview(app._id, "shortlisted")}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Shortlist
                    </button>
                    <button
                      onClick={() => handleReview(app._id, "rejected")}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleReview(app._id, "interview")}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Mark Interview
                    </button>

                    {/* --- Updated: Message button navigates to chat --- */}
                    <button
                      onClick={() => {
                        if (setSelectedChatUser) {
                          setSelectedChatUser({
                            id: app.userId._id,
                            name: app.userId.name,
                          });
                        }
                        navigate("/employer/chat"); // ✅ go to chat route
                      }}
                      className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-1"
                    >
                      <MessageSquare size={14} /> Message
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed">
          <p>No applications yet.</p>
        </div>
      )}
    </div>
  );
};

export default EmployerApplications;
