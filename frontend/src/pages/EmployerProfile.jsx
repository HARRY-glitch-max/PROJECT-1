// src/pages/EmployerProfile.jsx
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { getEmployerProfile, updateEmployerProfile } from "../services/api"; // ✅ API layer
import { AuthContext } from "../contexts/AuthContext";

export default function EmployerProfile() {
  const navigate = useNavigate();
  const { login: setAuth } = useContext(AuthContext);

  const [profile, setProfile] = useState({
    companyName: "",
    industry: "",
    contactInformation: {
      email: "",
      phone: "",
      address: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getEmployerProfile(); // ✅ calls /api/employers/:id
        setProfile(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["email", "phone", "address"].includes(name)) {
      setProfile({
        ...profile,
        contactInformation: {
          ...profile.contactInformation,
          [name]: value,
        },
      });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await updateEmployerProfile(profile); // ✅ calls PUT /api/employers/:id
      setSuccess("Profile updated successfully!");
      setAuth(res.data, res.data.token); // refresh auth context if token returned
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error && !success) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md p-6 rounded">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Employer Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          name="companyName"
          value={profile.companyName}
          onChange={handleChange}
          placeholder="Company Name"
          required
        />
        <Input
          type="text"
          name="industry"
          value={profile.industry}
          onChange={handleChange}
          placeholder="Industry"
          required
        />
        <Input
          type="email"
          name="email"
          value={profile.contactInformation.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <Input
          type="text"
          name="phone"
          value={profile.contactInformation.phone}
          onChange={handleChange}
          placeholder="Phone"
        />
        <Input
          type="text"
          name="address"
          value={profile.contactInformation.address}
          onChange={handleChange}
          placeholder="Address"
        />

        <Button type="submit" className="w-full">
          Update Profile
        </Button>
      </form>

      {success && <p className="text-green-600 text-sm mt-4">{success}</p>}
      {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
    </div>
  );
}
