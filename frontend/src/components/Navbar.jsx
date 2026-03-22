import { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Button from "./ui/Button";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext); // Using 'user' to match updated context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Check for role/accountType and normalize
  const role = (user?.roles || user?.accountType)?.toLowerCase();

  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo / Brand */}
        <Link to="/" className="text-2xl font-bold text-white">JobConnect</Link>

        {/* Navigation Links */}
        <ul className="flex space-x-6 text-white font-medium items-center">
          {/* Public Home Link - only if not logged in */}
          {!user && (
            <li>
              <Link to="/" className="hover:text-gray-200 transition-colors">Home</Link>
            </li>
          )}

          {user ? (
            <>
              {/* JOBSEEKER LINKS */}
              {role === "jobseeker" && (
                <>
                  <li><NavLink to="/jobs" className="hover:text-gray-200">Jobs Posted</NavLink></li>
                  <li><NavLink to="/chat" className="hover:text-gray-200">Chatbox</NavLink></li>
                </>
              )}

              {/* EMPLOYER LINKS */}
              {role === "employer" && (
                <>
                  <li><NavLink to="/jobs/create" className="hover:text-gray-200">Post Job</NavLink></li>
                  <li><NavLink to="/employer/dashboard" className="hover:text-gray-200">Dashboard</NavLink></li>
                </>
              )}

              {/* ADMIN (Linked to Employer) LINKS */}
              {role === "admin" && (
                <>
                  <li><NavLink to="/admin/reports" className="hover:text-gray-200">Company Reports</NavLink></li>
                  <li><NavLink to="/admin/dashboard" className="hover:text-gray-200">Admin Panel</NavLink></li>
                </>
              )}

              {/* Common Logout Button for all logged-in users */}
              <li>
                <Button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 transition-colors"
                >
                  Logout
                </Button>
              </li>
            </>
          ) : (
            <>
              {/* LOGIN OPTIONS */}
              <li><NavLink to="/login" className="hover:text-gray-200">Login</NavLink></li>
              <li><NavLink to="/register" className="hover:text-gray-200">Register</NavLink></li>
              <li>
                <NavLink 
                  to="/admin/login" 
                  className="bg-blue-800 px-3 py-1 rounded hover:bg-blue-900 transition-colors"
                >
                  Admin Login
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}