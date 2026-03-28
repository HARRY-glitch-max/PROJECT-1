import React, { useEffect, useState, useContext } from "react";
import {
  scheduleInterview,
  getEmployerInterviews,
  cancelInterview,
  getEmployerApplications,
  getEmployerJobs,
} from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import StatusBadge from "../components/applications/StatusBadge";

export default function Interviews() {
  const { user } = useContext(AuthContext);

  // --- State Management ---
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]); 
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ jobId: "", candidateId: "", date: "", time: "", location: "" });

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const employerId = user?.employerId || user?._id; 

        // Fetch everything in parallel for speed
        const [interviewsRes, appsRes, jobsRes] = await Promise.all([
          getEmployerInterviews(employerId),
          getEmployerApplications(employerId),
          getEmployerJobs(employerId),
        ]);

        // Filter for shortlisted candidates only
        const shortlisted = (appsRes.data || []).filter(app => app.status === "shortlisted");
        
        setApplications(shortlisted);
        setJobs(jobsRes.data || []);
        setInterviews(interviewsRes.data || []);
      } catch (err) {
        console.error("Data fetch error:", err);
        setError(err.response?.data?.message || "Failed to load management data");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  // --- Logic: Only show candidates who applied for the selected job ---
  const filteredCandidates = applications.filter(app => app.jobId?._id === form.jobId);

  // --- Action: Schedule ---
  const handleSchedule = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.jobId || !form.candidateId || !form.date || !form.time) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      await scheduleInterview(form.jobId, {
        applicantId: form.candidateId,
        date: form.date,
        time: form.time,
        location: form.location || "Online/TBD",
      });

      alert("Interview scheduled successfully!");

      // Refresh list to show new interview
      const employerId = user?.employerId || user?._id;
      const refreshed = await getEmployerInterviews(employerId);
      setInterviews(refreshed.data || []);
      
      // Reset form
      setForm({ jobId: "", candidateId: "", date: "", time: "", location: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to schedule interview");
    }
  };

  // --- Action: Cancel ---
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this interview?")) return;
    try {
      await cancelInterview(id);
      // Optimistic UI update
      setInterviews(prev => prev.map(i => i?._id === id ? { ...i, status: "cancelled" } : i));
    } catch (err) {
      setError("Failed to cancel interview");
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500 animate-pulse">Loading dashboard...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Interview Management</h2>
        <p className="text-gray-600">Schedule and track candidate sessions</p>
      </header>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 shadow-sm" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* --- Scheduling Form --- */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-10">
        <h3 className="text-lg font-semibold mb-5 text-gray-700">Schedule New Session</h3>
        <form onSubmit={handleSchedule} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Job</label>
            <select
              value={form.jobId}
              onChange={(e) => setForm({ ...form, jobId: e.target.value, candidateId: "" })}
              className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            >
              <option value="">Select a Posting</option>
              {jobs.map(job => job && (
                <option key={job._id} value={job._id}>{job.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shortlisted Candidate</label>
            <select
              value={form.candidateId}
              onChange={(e) => setForm({ ...form, candidateId: e.target.value })}
              className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
              disabled={!form.jobId}
              required
            >
              <option value="">{form.jobId ? "Choose Candidate" : "Choose Job First"}</option>
              {filteredCandidates.map(app => app?.userId && (
                <option key={app.userId._id} value={app.userId._id}>
                  {app.userId.name} ({app.userId.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location / Link</label>
            <input
              type="text"
              placeholder="e.g. Zoom link or Office Room 202"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md">
            Confirm & Notify Candidate
          </button>
        </form>
      </section>

      {/* --- Interview List --- */}
      <section>
        <h3 className="text-xl font-bold mb-5 text-gray-800">Current Schedule</h3>
        {interviews.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500">No active interviews found in your schedule.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {interviews.map(i => {
              if (!i) return null; // Prevent crash on missing data

              return (
                <div key={i._id || Math.random()} className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-blue-900">{i.jobId?.title || "Deleted Job Posting"}</h4>
                    <p className="text-gray-700 flex items-center gap-2">
                      <span className="font-medium">Candidate:</span> {i.userId?.name || "Unknown"}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500 italic">
                      <span>📅 {i.date ? new Date(i.date).toLocaleDateString() : "No Date"}</span>
                      <span>⏰ {i.time || "TBD"}</span>
                      <span>📍 {i.location || "TBD"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <StatusBadge status={i.status || "scheduled"} />
                    {i.status === "scheduled" && (
                      <button
                        onClick={() => handleCancel(i._id)}
                        className="text-sm font-semibold text-red-500 hover:text-red-700 border border-red-200 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}