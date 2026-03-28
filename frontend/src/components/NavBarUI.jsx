import { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Button from "./ui/Button";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /** * ✅ IMPROVED ROLE DETECTION
   * Since systems are separate, we check every possible field where 
   * the role might be stored (role, roles, or accountType).
   */
  const rawRole = user?.role || user?.roles || user?.accountType;
  const role = typeof rawRole === 'string' ? rawRole.toLowerCase() : "";

  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo / Brand */}
        <Link to="/" className="text-2xl font-bold text-white tracking-tight">
          JobConnect
        </Link>

        {/* Navigation Links */}
        <ul className="flex space-x-6 text-white font-medium items-center">
          {/* Public Home Link - only if not logged in */}
          {!user && (
            <li>
              <Link to="/" className="hover:text-blue-100 transition-colors">Home</Link>
            </li>
          )}

          {user ? (
            <>
              {/* JOBSEEKER LINKS */}
              {role === "jobseeker" && (
                <>
                  <li><NavLink to="/jobs" className={({isActive}) => isActive ? "text-blue-200 underline" : "hover:text-blue-100"}>Find Jobs</NavLink></li>
                  <li><NavLink to="/my-applications" className={({isActive}) => isActive ? "text-blue-200 underline" : "hover:text-blue-100"}>Applied</NavLink></li>
                  <li><NavLink to="/chat" className={({isActive}) => isActive ? "text-blue-200 underline" : "hover:text-blue-100"}>Messages</NavLink></li>
                </>
              )}

              {/* EMPLOYER LINKS */}
              {role === "employer" && (
                <>
                  <li><NavLink to="/employer/dashboard" className={({isActive}) => isActive ? "text-blue-200 underline" : "hover:text-blue-100"}>Dashboard</NavLink></li>
                  <li><NavLink to="/jobs/create" className={({isActive}) => isActive ? "text-blue-200 underline" : "hover:text-blue-100"}>Post Job</NavLink></li>
                  <li><NavLink to="/chat" className={({isActive}) => isActive ? "text-blue-200 underline" : "hover:text-blue-100"}>Inbox</NavLink></li>
                </>
              )}

              {/* ADMIN LINKS */}
              {role === "admin" && (
                <>
                  <li><NavLink to="/admin/dashboard" className={({isActive}) => isActive ? "text-blue-200 underline" : "hover:text-blue-100"}>Admin Panel</NavLink></li>
                  <li><NavLink to="/admin/reports" className={({isActive}) => isActive ? "text-blue-200 underline" : "hover:text-blue-100"}>Reports</NavLink></li>
                </>
              )}

              {/* User Profile Info (Optional) */}
              <li className="pl-4 border-l border-blue-400 text-sm opacity-90">
                {user.name || user.companyName}
              </li>

              {/* Common Logout */}
              <li>
                <Button
                  onClick={handleLogout}
                  className="bg-white text-blue-600 px-4 py-1.5 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-sm"
                >
                  Logout
                </Button>
              </li>
            </>
          ) : (
            <>
              {/* LOGIN OPTIONS */}
              <li><NavLink to="/login" className="hover:text-blue-100">Login</NavLink></li>
              <li><NavLink to="/register" className="hover:text-blue-100">Register</NavLink></li>
              <li>
                <NavLink 
                  to="/admin/login" 
                  className="bg-blue-800 px-3 py-1.5 rounded-lg hover:bg-blue-900 transition-colors border border-blue-400"
                >
                  Admin Portal
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}