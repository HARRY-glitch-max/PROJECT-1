// src/components/layout/Navbar.jsx
import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { login, register, logout, user } = useContext(AuthContext);

  const handleLogin = async (role) => {
    try {
      // Replace with actual email/password inputs or modal
      await login("test@example.com", "password123", role);
      console.log(`${role} logged in successfully`);
    } catch (err) {
      console.error(`Login failed for ${role}`, err);
    }
  };

  const handleRegister = async (role) => {
    try {
      await register({ email: "new@example.com", password: "password123" }, role);
      console.log(`${role} registered successfully`);
    } catch (err) {
      console.error(`Registration failed for ${role}`, err);
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-slate-900 text-white">
      <Link to="/" className="font-bold text-lg">JobConnect</Link>

      <div className="flex gap-4">
        {/* Dropdown buttons */}
        <button onClick={() => handleLogin("employer")} className="px-3 py-1 bg-blue-600 rounded">
          Employer Login
        </button>
        <button onClick={() => handleRegister("employer")} className="px-3 py-1 bg-green-600 rounded">
          Employer Register
        </button>

        <button onClick={() => handleLogin("admin")} className="px-3 py-1 bg-purple-600 rounded">
          Admin Login
        </button>
        <button onClick={() => handleRegister("admin")} className="px-3 py-1 bg-pink-600 rounded">
          Admin Register
        </button>

        {user && (
          <button onClick={logout} className="px-3 py-1 bg-red-600 rounded">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
