import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { Briefcase, Home, LogIn, UserPlus, LogOut, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Logo & Home */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Briefcase className="h-7 w-7" />
            <span className="text-xl font-bold tracking-tight">JobConnect</span>
          </Link>
          
          <Link 
            to="/" 
            className="hidden items-center gap-1 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 md:flex"
          >
            <Home size={18} />
            Home
          </Link>
        </div>

        {/* Right Side: Auth Buttons & Theme Toggle */}
        <div className="flex items-center gap-4">
          
          {/* Dark Mode Toggle */}
          <button 
            onClick={toggleTheme}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2" />

          {!user ? (
            <div className="flex items-center gap-2">
              <Link 
                to="/login" 
                className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400 transition"
              >
                <LogIn size={18} />
                Login
              </Link>
              <Link 
                to="/register" 
                className="flex items-center gap-1 rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-200 dark:shadow-none transition"
              >
                <UserPlus size={18} />
                Register
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                to="/dashboard" 
                className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600"
              >
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;