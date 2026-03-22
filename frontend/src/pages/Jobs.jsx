// src/pages/Jobs.jsx
import React, { useEffect, useState, useContext } from "react";
import { getJobs, applyToJob } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";

export default function Jobs() {
  const { auth } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    getJobs()
      .then(res => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load jobs");
        setLoading(false);
      });
  }, []);

  const handleApply = async (jobId) => {
    try {
      await applyToJob(jobId, {});
      setAppliedJobs([...appliedJobs, jobId]);
    } catch {
      setError("Failed to apply");
    }
  };

  if (loading) return <p className="p-4">Loading jobs...</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Available Jobs</h2>
      {error && <p className="text-red-600">{error}</p>}
      <ul className="space-y-4">
        {jobs.map(job => (
          <li key={job._id} className="border p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p className="text-gray-600">{job.description}</p>
            {auth && (
              <button
                onClick={() => handleApply(job._id)}
                disabled={appliedJobs.includes(job._id)}
                className={`mt-2 px-3 py-1 rounded ${
                  appliedJobs.includes(job._id)
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {appliedJobs.includes(job._id) ? "Applied" : "Apply"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
