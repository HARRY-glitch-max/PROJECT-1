import React, { useEffect, useState, useContext } from "react";
import { getJobs, deleteJob } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Building2, 
  Trash2, 
  Edit3, 
  ChevronRight,
  SearchX
} from "lucide-react";

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

        if (role === "employer") {
          // Ensure we are comparing the correct IDs based on your MERN schema
          allJobs = allJobs.filter(
            (job) => job.employerId?._id === user?.employerId || job.employerId === user?.employerId
          );
        }

        setJobs(allJobs);
      } catch (err) {
        console.error("Failed to load jobs:", err.response?.data || err.message);
        setError("Unable to retrieve job listings at this time.");
      } finally {
        setLoading(false);
      }
    };

    // Trigger fetch for jobs-related paths
    const jobPaths = ["/jobs", "/applications", "/my-jobs", "/jobseeker/dashboard"];
    const shouldFetch = jobPaths.some(path => location.pathname.includes(path));

    if (shouldFetch && (role === "jobseeker" || role === "employer")) {
      fetchJobs();
    } else {
      setLoading(false);
    }
  }, [role, user, location.pathname]);

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await deleteJob(jobId);
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (err) {
      setError("Failed to delete job.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-slate-500 font-medium">Fetching opportunities...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            {role === "employer" ? "Your Listings" : "Discover Jobs"}
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            {role === "employer" 
              ? "Manage and track your active job postings." 
              : "Find your next career move with top companies."}
          </p>
        </div>
        {role === "employer" && (
          <button 
            onClick={() => navigate("/employer/dashboard/post-job")}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Post New Job
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 font-medium">
          {error}
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[32px] border border-slate-100 shadow-sm">
          <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-400">
            <SearchX size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No jobs found</h3>
          <p className="text-slate-500 mt-1">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job) => {
            const jobId = job._id || job.id;
            return (
              <div
                key={jobId}
                className="bg-white border border-slate-100 rounded-[32px] p-8 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 group flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 border border-slate-100 group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors">
                    <Building2 size={28} />
                  </div>
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    {job.type}
                  </span>
                </div>

                <div className="flex-grow">
                  <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-slate-400 font-bold text-sm uppercase tracking-tight mb-4 flex items-center gap-2">
                    {job.employerId?.companyName || "Private Company"}
                  </p>
                  <p className="text-slate-600 line-clamp-2 mb-6 font-medium leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="space-y-3 mb-8 pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-slate-500 font-semibold text-sm">
                    <MapPin size={18} className="text-slate-300" /> {job.location}
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 font-semibold text-sm">
                    <DollarSign size={18} className="text-slate-300" /> {job.salary}
                  </div>
                </div>

                <div className="mt-auto">
                  {role === "jobseeker" ? (
                    <button
                      onClick={() => navigate(`/apply/${jobId}`)}
                      className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all group/btn"
                    >
                      Apply Now <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/employer/dashboard/edit-job/${jobId}`)}
                        className="flex-1 bg-slate-50 text-slate-600 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"
                      >
                        <Edit3 size={18} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(jobId)}
                        className="px-4 bg-red-50 text-red-600 py-3 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}