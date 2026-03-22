import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ApplyJob from '../pages/ApplyJob';
import MyApplications from '../pages/MyApplications';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Locked Routes */}
      <Route path="/apply/:jobId" element={
        <ProtectedRoute>
          <ApplyJob />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <MyApplications />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;