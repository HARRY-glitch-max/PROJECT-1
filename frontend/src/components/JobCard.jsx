import React from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";

const JobCard = ({ job }) => {
  return (
    <Card className="hover:shadow-lg transition">
      <h3 className="text-xl font-bold text-blue-700 mb-2">{job.title}</h3>
      <p className="text-gray-600 mb-2">
        <span className="font-medium">Company:</span> {job.company}
      </p>
      <p className="text-gray-600 mb-2">
        <span className="font-medium">Location:</span> {job.location}
      </p>
      {job.salary && (
        <p className="text-gray-600 mb-2">
          <span className="font-medium">Salary:</span> ${job.salary.toLocaleString()}
        </p>
      )}
      <p className="text-gray-700 mb-4">{job.description}</p>
      {job.postedBy && (
        <p className="text-sm text-gray-500">
          Posted by <span className="font-medium">{job.postedBy.name}</span>
        </p>
      )}
      <div className="mt-4">
        <Button>Apply Now</Button>
      </div>
    </Card>
  );
};

export default JobCard;
