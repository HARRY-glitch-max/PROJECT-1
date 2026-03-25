// src/pages/EmployerRegister.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { registerEmployer } from "../services/api"; // ✅ employer-specific register
import { AuthContext } from "../contexts/AuthContext";

export default function EmployerRegister() {
  const navigate = useNavigate();
  const { login: setAuth } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    contactInformation: {
      email: "",
      phone: "",
      address: "",
    },
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["email", "phone", "address"].includes(name)) {
      setFormData({
        ...formData,
        contactInformation: {
          ...formData.contactInformation,
          [name]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await registerEmployer(formData); // ✅ hits /api/employers/register
      localStorage.setItem("jobConnectUser", JSON.stringify(res.data));
      setAuth(res.data, res.data.token);

      // Redirect to employer dashboard after successful registration
      navigate("/employer/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md p-6 rounded">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Employer Register</h2>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Company Name"
          required
        />
        <Input
          type="text"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          placeholder="Industry"
          required
        />
        <Input
          type="email"
          name="email"
          value={formData.contactInformation.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <Input
          type="text"
          name="phone"
          value={formData.contactInformation.phone}
          onChange={handleChange}
          placeholder="Phone"
        />
        <Input
          type="text"
          name="address"
          value={formData.contactInformation.address}
          onChange={handleChange}
          placeholder="Address"
        />
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
}
