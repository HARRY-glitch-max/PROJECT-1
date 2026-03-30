import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyApplications } from '../api/applications';
import { FileText, Clock, MessageSquare, Loader2 } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';

const MyApplications = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        if (!user?._id) return;
        const data = await getMyApplications(user._id);
        setApps(data);
      } catch (err) {
        console.error("Error fetching applications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [user?._id]);

  const handleMessageClick = (e, app) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Extract the Employer ID safely
    // This handles both populated objects and raw ID strings
    const employer = app.jobId?.employerId;
    const targetId = typeof employer === 'object' ? employer?._id : employer;
    const companyName = employer?.companyName || "Employer";

    console.log("Navigating to chat with ID:", targetId);

    if (targetId && targetId !== "undefined") {
      /**
       * 2. ✅ FIXED NAVIGATION PATH
       * We use the nested dashboard route: /jobseeker/dashboard/messages/:receiverId
       * We also pass the company name in the query string so the ChatPage header is instant.
       */
      navigate(`/jobseeker/dashboard/messages/${targetId}?name=${encodeURIComponent(companyName)}`);
    } else {
      alert("Employer information is missing. Chat cannot be started.");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      submitted: "bg-blue-100 text-blue-700",
      reviewing: "bg-yellow-100 text-yellow-700",
      shortlisted: "bg-purple-100 text-purple-700",
      hired: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
        <p className="text-slate-500">Loading your history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 font-heading">My Applications</h1>

      {apps.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Job Title</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Resume</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {apps.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{app.jobId?.title || "Position Removed"}</div>
                    <div className="text-xs text-slate-500 font-medium">
                      {app.jobId?.employerId?.companyName || "Employer"} • {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <a 
                      href={app.resume} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium"
                    >
                      <FileText size={14} /> View
                    </a>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      type="button"
                      onClick={(e) => handleMessageClick(e, app)}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-md shadow-blue-100"
                    >
                      <MessageSquare size={14} />
                      Message
                    </button>
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
          <button onClick={() => navigate('/jobs')} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold">
            Browse Jobs
          </button>
        </div>
      )}
    </div>
  );
};

export default MyApplications;