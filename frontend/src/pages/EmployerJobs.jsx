// src/pages/EmployerJobs.jsx
import React, { useEffect, useState } from "react";
import { getEmployerJobs, getJobApplications, shortlistCandidate } from "../services/api";

export default function EmployerJobs() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmployerJobs()
      .then(res => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load your jobs");
        setLoading(false);
      });
  }, []);

  const handleViewApplications = async (jobId) => {
    setSelectedJob(jobId);
    try {
      const res = await getJobApplications(jobId);
      setApplications(res.data);
    } catch {
      setError("Failed to load applications");
    }
  };

  const handleShortlist = async (applicationId) => {
    try {
      await shortlistCandidate(applicationId);
      setApplications(applications.map(app =>
        app._id === applicationId ? { ...app, status: "shortlisted" } : app
      ));
    } catch {
      setError("Failed to shortlist candidate");
    }
  };

  if (loading) return <p className="p-4">Loading your jobs...</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Posted Jobs</h2>
      {error && <p className="text-red-600">{error}</p>}
      <ul className="space-y-4">
        {jobs.map(job => (
          <li key={job._id} className="border p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p className="text-gray-600">{job.description}</p>
            <button
              onClick={() => handleViewApplications(job._id)}
              className="mt-2 px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              View Applications
            </button>
          </li>
        ))}
      </ul>

      {selectedJob && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Applications for Job</h3>
          <ul className="space-y-4">
            {applications.map(app => (
              <li key={app._id} className="border p-4 rounded shadow">
                <p className="font-semibold">{app.candidateName}</p>
                <p className="text-gray-600">Status: {app.status}</p>
                <p className="text-gray-600">Resume: {app.resumeLink}</p>
                <button
                  onClick={() => handleShortlist(app._id)}
                  disabled={app.status === "shortlisted"}
                  className={`mt-2 px-3 py-1 rounded ${
                    app.status === "shortlisted"
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {app.status === "shortlisted" ? "Shortlisted" : "Shortlist"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
