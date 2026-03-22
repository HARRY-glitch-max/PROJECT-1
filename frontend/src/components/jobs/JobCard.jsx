import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Clock, ChevronRight } from 'lucide-react';

const JobCard = ({ job }) => {
  // Destructure with fallbacks to prevent "undefined" errors if backend data is missing
  const {
    _id,
    title = "Job Title",
    company = "Company Name",
    location = "Remote / On-site",
    type = "Full-time",
    salary = "Competitive",
    createdAt
  } = job;

  // Helper to format date (e.g., "2 days ago")
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          {/* Company Logo Placeholder */}
          <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl border border-blue-100">
            {company.charAt(0)}
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-slate-500 font-medium">{company}</p>
          </div>
        </div>

        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {type}
        </span>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-y-3 mt-6 border-t border-slate-50 pt-4">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <MapPin size={16} className="text-slate-400" />
          {location}
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <DollarSign size={16} className="text-slate-400" />
          {salary}
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Briefcase size={16} className="text-slate-400" />
          {type}
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Clock size={16} className="text-slate-400" />
          Posted {formatDate(createdAt)}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 flex items-center justify-between">
        <Link 
          to={`/jobs/${_id}`}
          className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
        >
          View Details <ChevronRight size={16} />
        </Link>
        
        <Link 
          to={`/apply/${_id}`}
          className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors shadow-sm"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
};

export default JobCard;