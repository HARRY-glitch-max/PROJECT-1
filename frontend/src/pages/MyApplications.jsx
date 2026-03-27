// src/pages/MyApplications.jsx
import React, { useState, useEffect, useContext } from 'react';
import { getMyApplications } from '../api/applications';
import { FileText, ExternalLink, Clock } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';

const MyApplications = () => {
  const { user } = useContext(AuthContext);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        if (!user?._id) return;
        const data = await getMyApplications(user._id); // ✅ pass userId
        setApps(data);
      } catch (err) {
        console.error("Error fetching applications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [user?._id]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-700";
      case "reviewing":
        return "bg-yellow-100 text-yellow-700";
      case "shortlisted":
        return "bg-purple-100 text-purple-700";
      case "hired":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">My Applications</h1>

      {loading ? (
        <p className="text-slate-500">Loading your history...</p>
      ) : apps.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Job Title</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date Applied</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Resume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {apps.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {app.jobId?.title || "Position Removed"}
                    {app.jobId?.employerId?.companyName && (
                      <div className="text-sm text-slate-500">
                        {app.jobId.employerId.companyName}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {new Date(app.dateApplied || app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusBadge(app.status)}`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={app.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      <FileText size={14} /> View File <ExternalLink size={14} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <Clock className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 mb-4">You haven't applied to any jobs yet.</p>
          <a
            href="/jobs"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Browse Jobs
          </a>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
