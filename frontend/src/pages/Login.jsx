import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { loginUser } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser(formData);

      // 1. Destructure the response
      const { token, ...user } = res.data;

      // 2. IMPORTANT: Save the token specifically as "token" for the API interceptor
      localStorage.setItem("token", token);

      // 3. Update Global Auth State
      login(user, token);

      // 4. Smart Redirect based on role
      if (user.roles === "admin") {
        navigate("/admin/dashboard");
      } else if (user.roles === "employer") {
        navigate("/employer/dashboard");
      } else {
        navigate("/profile"); // Default for jobseekers
      }

    } catch (err) {
      // Catch specific backend messages like "Invalid email or password"
      setError(err.response?.data?.message || "Login failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md p-6 rounded-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Welcome Back</h2>
      <p className="text-gray-500 mb-6 text-sm">Please enter your details to sign in.</p>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Email Address</label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@company.com"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </div>
        <Button type="submit" className="w-full py-3" disabled={loading}>
          {loading ? "Verifying..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}