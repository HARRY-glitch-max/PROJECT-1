import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getProfile()
      .then(res => {
        setProfile(res.data);
        setFormData({ name: res.data.name, email: res.data.email });
      })
      .catch(() => setProfile(null));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await updateProfile(formData); // ✅ only pass formData
      setProfile(res.data);
      setSuccess("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  if (!profile) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      {!editing ? (
        <>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <button
            onClick={() => setEditing(true)}
            className="mt-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-4">
          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
