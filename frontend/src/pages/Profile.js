import React, { useEffect, useState } from "react";
import { getProfile } from "../services/api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setUser(res.data);
      } catch (err) {
        setError("Failed to load profile. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">{error || "Loading profile..."}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">My Profile</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-lg mb-2">
          <span className="font-semibold">Name:</span> {user.name}
        </p>
        <p className="text-lg mb-2">
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p className="text-lg mb-2">
          <span className="font-semibold">Role:</span> {user.role}
        </p>

        {user.role === "employer" && (
          <p className="text-gray-600 mt-4">
            You can post jobs from the <strong>Job Form</strong> page.
          </p>
        )}

        {user.role === "jobseeker" && (
          <p className="text-gray-600 mt-4">
            You can apply to jobs from the <strong>Jobs</strong> page.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;