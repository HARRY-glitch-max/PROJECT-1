import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { 
  FileText, 
  MessageSquare, 
  User, 
  Briefcase,
  Loader2,
  AlertCircle,
  CheckCircle2, 
  XCircle,
  Calendar
} from "lucide-react";
import {
  getEmployerApplications,
  updateApplicationStatus,
} from "../api/applications";
import StatusBadge from "../components/applications/StatusBadge";

const EmployerApplications = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);

  const fetchApps = async () => {
    if (!user?.employerId) {
      setError("Employer identity not verified. Please log in as an employer.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getEmployerApplications(user.employerId);
      setApps(data || []);
      setCount((data || []).length);
    } catch (err) {
      setError("Failed to synchronize application data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.employerId) fetchApps();
  }, [user?.employerId]);

  const handleReview = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      setApps((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      alert(`Failed to update status to ${newStatus}. Please try again.`);
    }
  };

  /**
   * ✅ FIXED NAVIGATION
   * Navigates to the chat within the Employer Dashboard context.
   */
  const handleMessage = (app) => {
    if (!app?.userId?._id) return;
    
    // We navigate to 'chat/ID' instead of '/chat/ID' to stay 
    // inside the current /employer/ path prefix.
    navigate(`../chat/${app.userId._id}`, {
      state: { 
        receiverName: app.userId.name,
        jobTitle: app.jobId?.title 
      },
    });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing Pipeline...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Talent Pipeline</h1>
          <p className="text-slate-500 font-medium">
            Review candidates, update application statuses, and manage communications.
          </p>
        </div>
        <div className="bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100">
          <span className="text-blue-600 font-black text-2xl">{count}</span>
          <span className="ml-2 text-blue-800 font-bold text-sm uppercase tracking-tight">Total Applicants</span>
        </div>
      </header>

      {error ? (
        <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center gap-4 text-red-600 font-bold">
          <AlertCircle /> {error}
        </div>
      ) : apps.length > 0 ? (
        <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Position</th>
                  <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Candidate</th>
                  <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Documents</th>
                  <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Current Status</th>
                  <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Management Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {apps.map((app) => (
                  <tr key={app._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          <Briefcase size={18} />
                        </div>
                        <span className="font-bold text-slate-900">{app.jobId?.title || "General Role"}</span>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900">{app.userId?.name || "Anonymous"}</span>
                        <span className="text-xs text-slate-400 font-bold tracking-tight">{app.userId?.email}</span>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      {app.resume ? (
                        <a
                          href={app.resume}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-wider hover:text-blue-800 transition-colors"
                        >
                          <FileText size={16} /> View CV
                        </a>
                      ) : (
                        <span className="text-slate-300 italic text-xs font-medium">No CV</span>
                      )}
                    </td>

                    <td className="px-8 py-6">
                      <StatusBadge status={app.status} />
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleReview(app._id, "shortlisted")}
                          className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all"
                          title="Shortlist"
                        >
                          <CheckCircle2 size={20} />
                        </button>

                        <button
                          onClick={() => handleReview(app._id, "rejected")}
                          className="p-2 text-red-500 hover:bg-red-100 rounded-xl transition-all"
                          title="Reject"
                        >
                          <XCircle size={20} />
                        </button>

                        <button
                          onClick={() => handleReview(app._id, "interview")}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 shadow-md shadow-blue-200 transition-all"
                        >
                          <Calendar size={14} />
                          Interview
                        </button>

                        {/* Message Button - Now stays in Dashboard */}
                        <button
                          onClick={() => handleMessage(app)}
                          className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all shadow-md active:scale-95"
                          title="Message Candidate"
                        >
                          <MessageSquare size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
            <User size={40} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Queue is empty</h3>
          <p className="text-slate-500 font-medium">New applicants will appear here as they apply.</p>
        </div>
      )}
    </div>
  );
};

export default EmployerApplications;