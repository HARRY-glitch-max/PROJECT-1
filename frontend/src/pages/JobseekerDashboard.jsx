// src/pages/JobseekerDashboard.jsx
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import Jobs from "./Jobs";
import MyApplications from "./MyApplications";
import Messages from "./Messages";
import JobseekerProfile from "./JobseekerProfile"; // ✅ updated import
import { AuthContext } from "../contexts/AuthContext";
import Button from "../components/ui/Button";

export default function JobseekerDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-green-700 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Jobseeker Dashboard</h2>
        <ul className="space-y-3">
          <li>
            <NavLink
              to="jobs"
              className={({ isActive }) =>
                isActive ? "font-bold underline" : "hover:underline"
              }
            >
              Browse Jobs
            </NavLink>
          </li>
          <li>
            <NavLink
              to="applications"
              className={({ isActive }) =>
                isActive ? "font-bold underline" : "hover:underline"
              }
            >
              My Applications
            </NavLink>
          </li>
          <li>
            <NavLink
              to="messages"
              className={({ isActive }) =>
                isActive ? "font-bold underline" : "hover:underline"
              }
            >
              Messages
            </NavLink>
          </li>
          <li>
            <NavLink
              to="profile"
              className={({ isActive }) =>
                isActive ? "font-bold underline" : "hover:underline"
              }
            >
              Profile
            </NavLink>
          </li>
        </ul>

        {/* Optional quick navigation */}
        <div className="mt-6">
          <Button onClick={() => navigate("/jobs")}>Find Jobs</Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <Routes>
          <Route path="jobs" element={<Jobs />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<JobseekerProfile />} /> {/* ✅ updated */}
        </Routes>
      </main>
    </div>
  );
}
