// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const login = async (email, password, role = 'jobseeker') => {
    let endpoint;
    if (role === 'admin') {
      endpoint = '/admin/login';
    } else if (role === 'employer') {
      endpoint = '/employers/login';
    } else {
      endpoint = '/jobseekers/login';
    }

    const { data } = await apiClient.post(endpoint, { email, password });
    const userWithRole = { ...data, role }; // ✅ attach role manually
    setUser(userWithRole);
    localStorage.setItem('jobConnectUser', JSON.stringify(userWithRole));
    return userWithRole;
  };

  const register = async (formData, role = 'jobseeker') => {
    let endpoint;
    if (role === 'admin') {
      endpoint = '/admin/register';
    } else if (role === 'employer') {
      endpoint = '/employers/register';
    } else {
      endpoint = '/jobseekers/register';
    }

    const { data } = await apiClient.post(endpoint, formData);
    const userWithRole = { ...data, role }; // ✅ attach role manually
    setUser(userWithRole);
    localStorage.setItem('jobConnectUser', JSON.stringify(userWithRole));
    return userWithRole;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jobConnectUser');
  };

  // ✅ now role is always defined
  const role = user?.role;
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
