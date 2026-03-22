// src/pages/PostJob.jsx
import { useState } from "react";
import { createJob } from "../services/api";

export default function PostJob() {
  const [formData, setFormData] = useState({ title: "", description: "", requirements: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createJob(formData);
      alert("Job posted successfully!");
    } catch (err) {
      alert("Failed to post job");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-bold mb-4">Post a Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Job Title" className="w-full border p-2" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Job Description" className="w-full border p-2" />
        <textarea name="requirements" value={formData.requirements} onChange={handleChange} placeholder="Requirements" className="w-full border p-2" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Post Job</button>
      </form>
    </div>
  );
}
