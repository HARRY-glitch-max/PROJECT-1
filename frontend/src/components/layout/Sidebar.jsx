import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Home,
  Briefcase,
  FileText,
  Users,
  Settings,
  LogOut,
  MessageSquare,
} from "lucide-react";
import Button from "../ui/Button";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Define navigation items based on role
  const getNavItems = () => {
    if (!user?.role) return [];

    switch (user.role) {
      case "jobseeker":
        return [
          { to: "/jobseeker/dashboard", label: "Home", icon: Home },
          { to: "/jobs", label: "Browse Jobs", icon: Briefcase },
          { to: "/jobseeker/dashboard/applications", label: "My Applications", icon: FileText },
          { to: "/jobseeker/dashboard/interviews", label: "Interviews", icon: Users },
          { to: "/jobseeker/dashboard/chat", label: "Chat", icon: MessageSquare }, // ✅ Jobseeker chat
          { to: "/jobseeker/dashboard/settings", label: "Settings", icon: Settings },
        ];
      case "employer":
        return [
          { to: "/employer/dashboard", label: "Home", icon: Home },
          { to: "/employer/dashboard/interviews", label: "Interviews", icon: Users },
          { to: "/employer/dashboard/chat", label: "Chat", icon: MessageSquare }, // ✅ Employer chat
          { to: "/employer/dashboard/post-job", label: "Post Job", icon: Briefcase },
          { to: "/employer/dashboard/my-jobs", label: "My Jobs", icon: Briefcase },
          { to: "/employer/dashboard/applications", label: "Applications", icon: FileText },
          { to: "/employer/dashboard/settings", label: "Settings", icon: Settings },
        ];
      case "admin":
        return [
          { to: "/admin/dashboard", label: "Home", icon: Home },
          { to: "/admin/dashboard/jobs", label: "Manage Jobs", icon: Briefcase },
          { to: "/admin/dashboard/applications", label: "Applications", icon: FileText },
          { to: "/admin/dashboard/users", label: "Users", icon: Users },
          { to: "/admin/dashboard/settings", label: "Settings", icon: Settings },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
          {user?.role
            ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard`
            : "Dashboard"}
        </h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname.startsWith(to)
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <Button
          onClick={logout}
          variant="danger"
          className="w-full flex items-center gap-2 justify-center"
        >
          <LogOut size={18} /> Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
