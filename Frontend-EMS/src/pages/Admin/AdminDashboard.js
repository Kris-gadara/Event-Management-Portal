import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../utils/api';

const AdminHome = () => {
  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <div className="card">
        <h3>Welcome to Event Management System</h3>
        <p>Use the navigation above to manage faculties and view system information.</p>
      </div>
    </div>
  );
};

const RegisterFaculty = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNo: '',
    password: '',
    photo: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await api.post('/admin/register-faculty', formData);
      setMessage(response.data.message);
      setFormData({ name: '', email: '', contactNo: '', password: '', photo: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register faculty');
    }
  };

  return (
    <div className="container">
      <h2>Register Faculty</h2>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <input
              type="text"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Photo URL (optional)</label>
            <input
              type="text"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
            />
          </div>
          {message && <div className="success">{message}</div>}
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn btn-primary">Register Faculty</button>
        </form>
      </div>
    </div>
  );
};

const FacultyList = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      const response = await api.get('/admin/faculties');
      setFaculties(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching faculties:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this faculty?')) {
      try {
        await api.delete(`/admin/faculty/${id}`);
        fetchFaculties();
      } catch (error) {
        console.error('Error deleting faculty:', error);
      }
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>Faculty List</h2>
      <div className="card">
        {faculties.length === 0 ? (
          <p>No faculties registered yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact No</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculties.map((faculty) => (
                <tr key={faculty._id}>
                  <td>{faculty.name}</td>
                  <td>{faculty.email}</td>
                  <td>{faculty.contactNo}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(faculty._id)}
                      className="btn btn-danger"
                      style={{ fontSize: '12px', padding: '5px 10px' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navItems = [
    { label: 'Home', path: '/admin' },
    { label: 'Register Faculty', path: '/admin/register-faculty' },
    { label: 'Faculty List', path: '/admin/faculties' }
  ];

  return (
    <>
      <Navbar role="admin" navItems={navItems} />
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/register-faculty" element={<RegisterFaculty />} />
        <Route path="/faculties" element={<FacultyList />} />
      </Routes>
    </>
  );
};

export default AdminDashboard;
