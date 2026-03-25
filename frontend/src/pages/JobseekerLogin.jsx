// src/pages/JobseekerLogin.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { loginJobseeker } from "../services/api";   // ✅ calls /api/jobseekers/login
import { AuthContext } from "../contexts/AuthContext";

export default function JobseekerLogin() {
  const navigate = useNavigate();
  const { login: setAuth } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginJobseeker(formData);

      // Save user + token locally
      localStorage.setItem("jobConnectUser", JSON.stringify(res.data));
      setAuth(res.data, res.data.token);

      // Redirect directly to jobseeker dashboard
      navigate("/jobseeker/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white dark:bg-slate-900 shadow-md p-6 rounded">
      <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">
        Jobseeker Login
      </h2>

      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
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
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
