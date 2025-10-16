import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import FacultyDashboard from './pages/Faculty/FacultyDashboard';
import CoordinatorDashboard from './pages/Coordinator/CoordinatorDashboard';
import StudentDashboard from './pages/Student/StudentDashboard';
import StudentRegister from './pages/Student/StudentRegister';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<StudentRegister />} />

          <Route
            path="/admin/*"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/faculty/*"
            element={
              <PrivateRoute allowedRoles={['faculty']}>
                <FacultyDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/coordinator/*"
            element={
              <PrivateRoute allowedRoles={['coordinator']}>
                <CoordinatorDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/student/*"
            element={
              <PrivateRoute allowedRoles={['student']}>
                <StudentDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
