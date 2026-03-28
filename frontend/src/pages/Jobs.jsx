import React, { useEffect, useState, useContext } from "react";
import { getJobs, updateJob, deleteJob } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function Jobs() {
  const { user, role } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getJobs();
        let allJobs = res.data || [];

        // Employers only see their own jobs
        if (role === "employer") {
          allJobs = allJobs.filter(
            (job) => job.employerId?._id === user?.employerId
          );
        }

        setJobs(allJobs);
      } catch (err) {
        console.error("Failed to load jobs:", err.response?.data || err.message);
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    // ✅ Only fetch when on applications or jobs routes
    if (
      location.pathname.includes("/applications") ||
      location.pathname.includes("/jobs") ||
      location.pathname.includes("/my-jobs")
    ) {
      if (role === "jobseeker" || role === "employer") {
        fetchJobs();
      } else {
        setLoading(false);
      }
    } else {
      // Skip fetching when not on jobs/applications page
      setLoading(false);
    }
  }, [role, user, location.pathname]);

  const handleDelete = async (jobId) => {
    try {
      await deleteJob(jobId);
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (err) {
      console.error("Failed to delete job:", err.response?.data || err.message);
      setError("Failed to delete job");
    }
  };

  const handleEdit = async (jobId) => {
    alert(`Edit job ${jobId} (implement form/modal here)`);
  };

  if (loading) return <p className="p-4">Loading jobs...</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        {role === "employer" ? "My Posted Jobs" : "Available Jobs"}
      </h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {jobs.length === 0 ? (
        <p className="text-gray-600">
          {role === "employer"
            ? "You have not posted any jobs yet."
            : "No jobs available right now."}
        </p>
      ) : (
        <ul className="space-y-6">
          {jobs.map((job) => {
            const jobId = job._id || job.id;
            return (
              <li
                key={jobId}
                className="border rounded-lg shadow-sm p-6 hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold text-blue-700">
                  {job.title}
                </h3>
                <p className="text-gray-700 mb-2">{job.description}</p>

                {job.requirements?.length > 0 && (
                  <div className="mb-2">
                    <p className="font-medium text-gray-800">Requirements:</p>
                    <ul className="list-disc list-inside text-gray-600">
                      {job.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {job.location && (
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Location:</span> {job.location}
                  </p>
                )}

                {job.salary && (
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Salary:</span> {job.salary}
                  </p>
                )}

                {job.employerId && (
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Employer:</span>{" "}
                    {job.employerId.companyName} ({job.employerId.industry})
                  </p>
                )}

                {/* Jobseeker actions */}
                {role === "jobseeker" && (
                  <button
                    onClick={() => navigate(`/jobs/${jobId}/apply`)}
                    className="mt-4 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                  >
                    Apply
                  </button>
                )}

                {/* Employer actions */}
                {role === "employer" && (
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => handleEdit(jobId)}
                      className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(jobId)}
                      className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
