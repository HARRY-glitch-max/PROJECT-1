import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submitApplication } from '../api/applications';
import { AuthContext } from '../contexts/AuthContext';

const ApplyJob = () => {
  const { jobId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a resume");

    const formData = new FormData();
    formData.append('jobId', jobId);
    formData.append('userId', user._id);
    formData.append('resume', file); // Field name must match backend Multer

    try {
      setLoading(true);
      await submitApplication(formData);
      alert("Application sent successfully!");
      navigate('/dashboard');
    } catch (err) {
      alert("Error: " + err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Submit Application</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="file" 
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full border border-gray-300 p-2 rounded"
        />
        <button 
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Uploading to Cloudinary..." : "Apply Now"}
        </button>
      </form>
    </div>
  );
};

export default ApplyJob;