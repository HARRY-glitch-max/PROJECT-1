// src/pages/PostJob.jsx
import { useState, useContext } from "react";
import { createJob } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";

export default function PostJob() {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salary: "",
    employerId: user?.employerId || "", // auto-fill from context
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...formData,
        requirements: formData.requirements
          .split(",")
          .map((req) => req.trim()), // ensure array
      };

      const res = await createJob(payload);
      setSuccess("Job posted successfully!");
      console.log("Job created:", res.data);

      // Reset form
      setFormData({
        title: "",
        description: "",
        requirements: "",
        location: "",
        salary: "",
        employerId: user?.employerId || "",
      });
    } catch (err) {
      console.error("Job post failed:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to post job");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-bold mb-4">Post a Job</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Job Title"
          className="w-full border p-2"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Job Description"
          className="w-full border p-2"
          required
        />
        <textarea
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          placeholder="Requirements (comma separated)"
          className="w-full border p-2"
          required
        />
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border p-2"
          required
        />
        <input
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="Salary"
          className="w-full border p-2"
          required
        />

        {/* employerId is hidden, auto-filled from context */}
        <input type="hidden" name="employerId" value={formData.employerId} />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Post Job
        </button>
      </form>
    </div>
  );
}
