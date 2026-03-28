import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useCallback } from "react"; 
import axios from "axios"; 
import Jobs from "./Jobs";
import MyApplications from "./MyApplications";
import Messages from "./Messages";
import JobseekerProfile from "./JobseekerProfile";
import JobseekerNotifications from "./JobseekerNotifications";
import JobseekerInterviews from "./JobseekerInterviews";

import { AuthContext } from "../contexts/AuthContext";
import Button from "../components/ui/Button";
import { 
  Search, 
  FileText, 
  Mail, 
  User, 
  Bell, 
  Calendar, 
  LogOut,
  LayoutDashboard 
} from "lucide-react";

const NavItem = ({ to, label, icon: Icon, badgeCount }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        }`
      }
    >
      <div className="flex items-center space-x-3">
        <Icon size={20} />
        <span className="font-semibold">{label}</span>
      </div>
      {badgeCount > 0 && (
        <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full border-2 border-white">
          {badgeCount}
        </span>
      )}
    </NavLink>
  </li>
);

export default function JobseekerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const [interviewCount, setInterviewCount] = useState(0); // ✅ Track actual interview count

  // Fetch Notifications and Unread Count
  const fetchUnreadCount = useCallback(async () => {
    try {
      if (!user?._id) return;
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`/api/notifications/user/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (err) {
      console.error("Unread fetch error", err);
    }
  }, [user?._id]);

  // Fetch Interview Count for the Stat Card
  const fetchInterviewCount = useCallback(async () => {
    try {
      if (!user?._id) return;
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`/api/interviews/user/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInterviewCount(Array.isArray(data) ? data.length : 0);
    } catch (err) {
      console.error("Interview count fetch error", err);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchUnreadCount();
    fetchInterviewCount();
    const interval = setInterval(() => {
        fetchUnreadCount();
        fetchInterviewCount();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount, fetchInterviewCount]);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center space-x-2 mb-10 px-2 cursor-pointer" onClick={() => navigate("/jobseeker/dashboard")}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-100">H</div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">HireFlow</h2>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <NavItem to="jobs" label="Browse Jobs" icon={Search} />
            <NavItem to="applications" label="My Applications" icon={FileText} />
            <NavItem to="interviews" label="Interviews" icon={Calendar} badgeCount={interviewCount > 0 ? interviewCount : null} />
            
            <NavItem 
              to="notifications" 
              label="Notifications" 
              icon={Bell} 
              badgeCount={unreadCount} 
            />

            <NavItem to="messages" label="Messages" icon={Mail} />
            <NavItem to="profile" label="Profile" icon={User} />
          </ul>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="flex items-center space-x-3 mb-6 px-2">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=2563eb&color=fff&bold=true`} 
              className="w-12 h-12 rounded-2xl border-2 border-slate-50 shadow-sm"
              alt="Profile" 
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 leading-tight truncate">{user?.name || "Jobseeker"}</p>
              <p className="text-xs text-blue-600 font-medium">Verified Account</p>
            </div>
          </div>
          <Button
            onClick={logout}
            className="w-full bg-slate-50 border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <LogOut size={18} /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto h-screen">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Hello, {user?.name?.split(' ')[0] || 'there'}! 👋
            </h1>
            <p className="text-slate-500 mt-1 text-lg font-medium">
              You have <span className="text-blue-600 font-bold">{unreadCount}</span> new notifications today.
            </p>
          </div>
          
          <button 
            onClick={() => navigate("notifications")}
            className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm relative group active:scale-95"
          >
            <Bell size={26} className="group-hover:rotate-12 transition-transform" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[11px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group" onClick={() => navigate("applications")}>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileText size={24} />
                </div>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Applications</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">12</h3>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group" onClick={() => navigate("interviews")}>
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Calendar size={24} />
                </div>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Interviews</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{interviewCount}</h3>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group" onClick={() => navigate("messages")}>
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <Mail size={24} />
                </div>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">New Messages</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">4</h3>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                  <User size={24} />
                </div>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Profile Score</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">85%</h3>
            </div>
        </div>

        <section className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 min-h-[600px] overflow-hidden">
          <div className="p-8 lg:p-10">
            <Routes>
              <Route path="jobs" element={<Jobs />} />
              <Route path="applications" element={<MyApplications />} />
              <Route path="messages" element={<Messages />} />
              <Route path="profile" element={<JobseekerProfile />} />
              <Route path="notifications" element={<JobseekerNotifications refreshBadge={fetchUnreadCount} />} />
              <Route path="interviews" element={<JobseekerInterviews />} />
              
              <Route index element={
                <div className="flex flex-col items-center justify-center py-24 text-center">
                   <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mb-8 rotate-3 shadow-inner">
                      <LayoutDashboard size={48} />
                   </div>
                   <h3 className="text-3xl font-black text-slate-900">Your Command Center</h3>
                   <p className="text-slate-500 mt-3 mb-10 text-lg max-w-md">Everything you need to land your next dream role is right here.</p>
                   <Button onClick={() => navigate("jobs")} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-105 transition-transform">Start Searching</Button>
                </div>
              } />
            </Routes>
          </div>
        </section>
      </main>
    </div>
  );
}