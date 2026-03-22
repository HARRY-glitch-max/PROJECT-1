import React, { useState, useContext } from "react"; // Added useContext
import { useNavigate } from "react-router-dom";
import { registerUser, registerEmployer } from "../services/api";
import { AuthContext } from "../contexts/AuthContext"; // Import AuthContext

const Register = () => {
  const { login } = useContext(AuthContext); // Use login from context
  const [formData, setFormData] = useState({
    role: "jobseeker",
    name: "",
    email: "",
    password: "",
    companyName: "",
    industry: "",
    phone: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let res;
      if (formData.role === "jobseeker") {
        res = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "jobseeker",
        });
      } else {
        res = await registerEmployer({
          companyName: formData.companyName,
          industry: formData.industry,
          contactInformation: {
            email: formData.email,
            phone: formData.phone,
          },
          password: formData.password,
        });
      }

      const { token, ...user } = res.data;

      // ✅ Save token for api.js interceptor
      localStorage.setItem("token", token);

      // ✅ Update global auth state immediately
      login(user, token);

      // ✅ Smart redirect
      navigate(user.roles === "employer" ? "/employer/dashboard" : "/profile");
      
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Check server connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md border border-gray-100"
      >
        <h2 className="text-3xl font-extrabold text-blue-800 mb-2 text-center">
          Join JobConnect
        </h2>
        <p className="text-gray-500 text-center mb-8">Start your journey today</p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-6">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">I am a...</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border-gray-300 border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="jobseeker">Job Seeker</option>
            <option value="employer">Employer</option>
          </select>
        </div>

        {/* Dynamic Fields */}
        <div className="space-y-4 mb-6">
          {formData.role === "jobseeker" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Tech Corp"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <input
                  type="text"
                  name="industry"
                  placeholder="e.g. Software, Finance"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {formData.role === "employer" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                placeholder="+1 234 567 890"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
              minLength={6}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white font-bold px-4 py-3 rounded-lg hover:bg-blue-700 w-full transition-all shadow-md active:transform active:scale-95 disabled:bg-blue-300"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button 
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Log In
          </button>
        </p>
      </form>
    </div>
  );
};

export default Register;