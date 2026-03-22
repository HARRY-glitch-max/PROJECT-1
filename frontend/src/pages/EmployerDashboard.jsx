// src/pages/EmployerDashboard.jsx
import { Routes, Route, NavLink } from "react-router-dom";
import Chat from "./Chat";
import PostJob from "./PostJob";
import Interviews from "./Interviews";

export default function EmployerDashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Employer Dashboard</h2>
        <ul className="space-y-3">
          <li>
            <NavLink
              to="interviews"
              className={({ isActive }) =>
                isActive ? "font-bold underline" : "hover:underline"
              }
            >
              Interviews
            </NavLink>
          </li>
          <li>
            <NavLink
              to="chat"
              className={({ isActive }) =>
                isActive ? "font-bold underline" : "hover:underline"
              }
            >
              Chat
            </NavLink>
          </li>
          <li>
            <NavLink
              to="post-job"
              className={({ isActive }) =>
                isActive ? "font-bold underline" : "hover:underline"
              }
            >
              Post Job
            </NavLink>
          </li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <Routes>
          <Route path="interviews" element={<Interviews />} />
          <Route path="chat" element={<Chat />} />
          <Route path="post-job" element={<PostJob />} />
        </Routes>
      </main>
    </div>
  );
}
