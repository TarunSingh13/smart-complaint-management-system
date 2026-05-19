import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import Login            from './pages/Login';
import Signup           from './pages/Signup';
import Dashboard        from './pages/Dashboard';
import RegisterComplaint from './pages/RegisterComplaint';
import ComplaintList    from './pages/ComplaintList';
import AIAnalysis       from './pages/AIAnalysis';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Public Routes */}
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          }/>
          <Route path="/register-complaint" element={
            <PrivateRoute><RegisterComplaint /></PrivateRoute>
          }/>
          <Route path="/complaints" element={
            <PrivateRoute><ComplaintList /></PrivateRoute>
          }/>
          <Route path="/ai-analysis" element={
            <PrivateRoute><AIAnalysis /></PrivateRoute>
          }/>

          {/* Default Route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;