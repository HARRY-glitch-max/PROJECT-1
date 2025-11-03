import React from "react";

const JobCard = ({ job }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 hover:shadow-lg transition">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
        <span className="text-sm text-gray-500">{job.location}</span>
      </div>

      <p className="text-gray-600 mb-2">{job.description.slice(0, 120)}...</p>

      <div className="text-sm text-gray-500 mb-2">
        <span className="font-medium">Company:</span> {job.company}
      </div>

      <div className="text-sm text-gray-500 mb-2">
        <span className="font-medium">Salary:</span> ${job.salary?.toLocaleString()}
      </div>

      <div className="text-sm text-gray-500 mb-4">
        <span className="font-medium">Posted by:</span> {job.postedBy?.name || "Anonymous"}
      </div>

      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Apply Now
      </button>
    </div>
  );
};

export default JobCard;