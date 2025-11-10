import React, { useState } from "react";
import { createJob } from "../lib/api";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const JobForm = ({ onJobCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    company: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await createJob(formData);
      if (onJobCreated) onJobCreated(res.data);
      setFormData({
        title: "",
        description: "",
        location: "",
        salary: "",
        company: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto shadow-md p-6">
      <CardHeader>
        <h2 className="text-xl font-bold">Post a Job</h2>
      </CardHeader>

      <CardContent>
        {error && <p className="text-red-500 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Job Title</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Briefly describe the job..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. New York, Remote"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Salary</label>
            <Input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. 80000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Company</label>
            <Input
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. OpenAI"
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Posting..." : "Post Job"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobForm;
