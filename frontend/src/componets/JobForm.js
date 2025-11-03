import React, { useState } from "react";
import { createJob } from "../services/api";

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
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">Post a Job</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Job Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          rows="4"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Salary</label>
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Company</label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Posting..." : "Post Job"}
      </button>
    </form>
  );
};

export default JobForm;