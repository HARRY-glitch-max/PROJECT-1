import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const JobCard = ({ job }) => {
  const [showApply, setShowApply] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Application submitted:", formData);
    setShowApply(false);
    setFormData({ name: "", email: "", message: "" });
  };

  // ✅ Guard clause: handle missing or undefined job
  if (!job) {
    return (
      <Card className="shadow-md p-6 text-gray-500 italic mb-4">
        <p>Loading job details...</p>
      </Card>
    );
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition mb-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {job.title || "Untitled Position"}
          </h2>
          <span className="text-sm text-gray-500">{job.location || "N/A"}</span>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-gray-600 mb-3">
          {job.description
            ? `${job.description.slice(0, 120)}...`
            : "No description available."}
        </p>

        <div className="text-sm text-gray-500 mb-2">
          <span className="font-medium">Company:</span> {job.company || "N/A"}
        </div>

        <div className="text-sm text-gray-500 mb-2">
          <span className="font-medium">Salary:</span>{" "}
          {job.salary ? `$${job.salary.toLocaleString()}` : "Not specified"}
        </div>

        <div className="text-sm text-gray-500 mb-4">
          <span className="font-medium">Posted by:</span>{" "}
          {job.postedBy?.name || "Anonymous"}
        </div>

        {!showApply ? (
          <Button onClick={() => setShowApply(true)}>Apply Now</Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Textarea
              name="message"
              placeholder="Why are you a good fit?"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              required
            />
            <div className="flex gap-2">
              <Button type="submit">Submit</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowApply(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default JobCard;
