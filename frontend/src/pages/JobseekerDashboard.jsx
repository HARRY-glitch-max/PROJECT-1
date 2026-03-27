// src/pages/JobseekerDashboard.jsx
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import Jobs from "./Jobs";
import MyApplications from "./MyApplications";
import Messages from "./Messages";
import JobseekerProfile from "./JobseekerProfile";
import { AuthContext } from "../contexts/AuthContext";
import Button from "../components/ui/Button";

// Professional Icons (Lucide-react is great for this, but using text/emojis if you haven't installed it)
const NavItem = ({ to, label, icon }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-blue-50 text-blue-700 shadow-sm"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        }`
      }
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </NavLink>
  </li>
);

export default function JobseekerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center space-x-2 mb-10 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">J</div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">HireFlow</h2>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <NavItem to="jobs" label="Browse Jobs" icon="🔍" />
            <NavItem to="applications" label="My Applications" icon="📝" />
            <NavItem to="messages" label="Messages" icon="✉️" />
            <NavItem to="profile" label="Profile" icon="👤" />
          </ul>
        </nav>

        {/* User Card & Logout */}
        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="flex items-center space-x-3 mb-6 px-2">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0D8ABC&color=fff`} 
              alt="Profile" 
              className="w-10 h-10 rounded-full"
            />
            <div className="overflow-hidden text-ellipsis">
              <p className="text-sm font-semibold text-slate-900 leading-none">{user?.name || "Guest"}</p>
              <p className="text-xs text-slate-500 mt-1 truncate">Jobseeker Account</p>
            </div>
          </div>
          <Button
            onClick={logout}
            className="w-full bg-slate-50 border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors py-2.5 rounded-xl font-medium"
          >
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 lg:p-12">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Hello, {user?.name?.split(' ')[0] || 'there'}! 👋
            </h1>
            <p className="text-slate-500 mt-2 text-lg max-w-2xl">
              Your career journey is looking bright. Check your latest updates and applications below.
            </p>
          </div>
          {/* Dashboard Visual Decoration */}
          <div className="hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&q=80&w=200&h=100" 
              className="rounded-2xl shadow-sm border border-white" 
              alt="Office space" 
            />
          </div>
        </header>

        {/* Stats Grid - Makes it look functional */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-sm text-slate-500 font-medium">Active Applications</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">12</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-sm text-slate-500 font-medium">New Messages</p>
                <h3 className="text-3xl font-bold text-blue-600 mt-1">4</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-sm text-slate-500 font-medium">Profile Strength</p>
                <h3 className="text-3xl font-bold text-green-600 mt-1">85%</h3>
            </div>
        </div>

        {/* Content Area */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 min-h-[500px] relative overflow-hidden">
          <div className="p-8">
            <Routes>
              <Route path="jobs" element={<Jobs />} />
              <Route path="applications" element={<MyApplications />} />
              <Route path="messages" element={<Messages />} />
              <Route path="profile" element={<JobseekerProfile />} />
              {/* Default view when no sub-route is selected */}
              <Route index element={
                <div className="flex flex-col items-center justify-center py-20 text-center">
                   <img 
                    src="https://images.unsplash.com/photo-1454165833767-027ff33027ef?auto=format&fit=crop&q=80&w=400" 
                    className="w-64 h-40 object-cover rounded-2xl mb-6 shadow-lg" 
                    alt="Start searching"
                   />
                   <h3 className="text-xl font-bold text-slate-800">Ready to find your next dream job?</h3>
                   <p className="text-slate-500 mt-2 mb-6">Browse through hundreds of listings tailored for you.</p>
                   <Button onClick={() => navigate("jobs")} className="bg-blue-600 text-white px-8 py-3 rounded-xl shadow-lg shadow-blue-200">Start Browsing</Button>
                </div>
              } />
            </Routes>
          </div>
        </section>
      </main>
    </div>
  );
}