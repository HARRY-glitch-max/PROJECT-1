import { createContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Sync session on load
  useEffect(() => {
    const savedUser = localStorage.getItem('jobConnectUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('jobConnectUser');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Universal Login
   * Hits /admin/login for Admins or /users/login for others
   */
  const login = async (email, password, isAdmin = false) => {
    const endpoint = isAdmin ? '/admin/login' : '/users/login';
    const { data } = await apiClient.post(endpoint, { email, password });

    setUser(data);
    localStorage.setItem('jobConnectUser', JSON.stringify(data));
    return data;
  };

  /**
   * Universal Registration
   * Handles Jobseekers, Employers, and Admin
   */
  const register = async (formData, isAdmin = false) => {
    const endpoint = isAdmin ? '/admin/register' : '/users/register';
    const { data } = await apiClient.post(endpoint, formData);

    setUser(data);
    localStorage.setItem('jobConnectUser', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jobConnectUser');
  };

  // Helper values for easy use in Components (like Navbar)
  const role = (user?.roles || user?.accountType)?.toLowerCase();
  const isCompanyAdmin = role === 'admin';
  const isEmployer = role === 'employer';
  const isJobseeker = role === 'jobseeker';

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading,
      role,
      isCompanyAdmin,
      isEmployer,
      isJobseeker,
      employerId: user?.employerId || user?.employer 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
