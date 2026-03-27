// src/pages/Interviews.jsx
import React, { useEffect, useState, useContext } from "react";
import { scheduleInterview, getEmployerInterviews, cancelInterview } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";

export default function Interviews() {
  const { user } = useContext(AuthContext);
  const [interviews, setInterviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ jobId: "", candidateId: "", date: "", time: "" });

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await getEmployerInterviews();
        setInterviews(res.data || []);
      } catch (err) {
        console.error("Failed to load interviews:", err.response?.data || err.message);
        setError("Failed to load interviews");
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const handleSchedule = async (e) => {
    e.preventDefault();
    try {
      const interviewData = {
        candidateId: form.candidateId,
        date: form.date,
        time: form.time,
      };
      await scheduleInterview(form.jobId, interviewData);
      alert("Interview scheduled successfully!");
      setForm({ jobId: "", candidateId: "", date: "", time: "" });
    } catch (err) {
      console.error("Failed to schedule interview:", err.response?.data || err.message);
      setError("Failed to schedule interview");
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelInterview(id);
      setInterviews((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      console.error("Failed to cancel interview:", err.response?.data || err.message);
      setError("Failed to cancel interview");
    }
  };

  if (loading) return <p>Loading interviews...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Interviews</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Booking form */}
      <form onSubmit={handleSchedule} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Job ID"
          value={form.jobId}
          onChange={(e) => setForm({ ...form, jobId: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Candidate ID"
          value={form.candidateId}
          onChange={(e) => setForm({ ...form, candidateId: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <input
          type="time"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Schedule Interview
        </button>
      </form>

      {/* List of interviews */}
      {interviews.length === 0 ? (
        <p>No interviews scheduled yet.</p>
      ) : (
        <ul className="space-y-4">
          {interviews.map((i) => (
            <li key={i._id} className="border p-4 rounded shadow">
              <p><strong>Job:</strong> {i.jobId?.title}</p>
              <p><strong>Candidate:</strong> {i.candidateId?.name}</p>
              <p><strong>Date:</strong> {i.date}</p>
              <p><strong>Time:</strong> {i.time}</p>
              <button
                onClick={() => handleCancel(i._id)}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded"
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
