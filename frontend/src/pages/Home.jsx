import React, { useState, useEffect, useContext } from 'react';
import JobCard from '../components/jobs/JobCard';
import { getAllJobs } from '../api/jobs';
import { Search, Sparkles } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';

export default function Home() {
  const { role } = useContext(AuthContext); // ✅ get role from context
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // ✅ Only fetch jobs for jobseekers or employers
    if (role === "jobseeker" || role === "employer") {
      fetchJobs();
    } else {
      setLoading(false); // admins skip fetching jobs
    }
  }, [role]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await getAllJobs(searchTerm);
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-600 to-blue-800 dark:from-slate-900 dark:to-slate-950 text-white pt-24 pb-32 px-6">
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-8 backdrop-blur-md animate-bounce-slow">
            <Sparkles size={16} className="text-yellow-300" />
            <span>Over 500+ new jobs posted this week!</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight">
            Find a job you love, <br />
            <span className="text-blue-200 drop-shadow-sm">click Apply, and boom!</span>
          </h1>
          
          <p className="text-xl mb-12 text-blue-100/80 max-w-2xl mx-auto font-medium">
            No long forms, no stress. Connect with top companies and get hired faster than ever.
          </p>

          {/* ✅ Show search bar only for jobseekers/employers */}
          {(role === "jobseeker" || role === "employer") && (
            <div className="flex flex-col md:flex-row gap-3 max-w-3xl mx-auto bg-white dark:bg-slate-900 p-3 rounded-3xl shadow-2xl border border-white/10">
              <div className="flex-1 flex items-center px-5 gap-3">
                <Search className="text-slate-400" size={24} />
                <input 
                  type="text" 
                  placeholder="Search job titles, skills, or companies..." 
                  className="w-full py-4 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 text-lg outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={fetchJobs}
                className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-10 py-4 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                Search Jobs
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ✅ Jobs feed only for jobseekers/employers */}
      {(role === "jobseeker" || role === "employer") && (
        <section className="relative z-20 -mt-12 px-6 max-w-6xl mx-auto">
          {loading ? (
            <p className="text-gray-600">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-gray-600">No jobs available right now.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job._id || job.id} job={job} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Trust section */}
      <section className="py-24 px-6 text-center">
        <div className="relative inline-block group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop" 
            alt="Career success"
            className="relative mx-auto rounded-[2.5rem] shadow-2xl w-full max-w-2xl border-4 border-white dark:border-slate-800"
          />
        </div>
      </section>

      <footer className="py-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          © 2026 <span className="text-blue-600 font-bold">JobConnect</span>. Built for the next generation of talent.
        </p>
      </footer>
    </div>
  );
}
