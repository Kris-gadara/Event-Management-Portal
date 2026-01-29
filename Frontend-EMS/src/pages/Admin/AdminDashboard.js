import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useToast } from '../../components/Toast';
import api from '../../utils/api';

const AdminHome = () => {
  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>
      <div className="section">
        <h3>Welcome to Event Management System 🎯</h3>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-light)', marginBottom: 'var(--space-xl)' }}>
          Manage the entire event management system. Register faculty members and oversee all activities.
        </p>
        <div className="card-grid">
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)' }}>👥</h3>
            <h4>Faculty Management</h4>
            <p>Register and manage faculty members</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)' }}>📊</h3>
            <h4>System Overview</h4>
            <p>Monitor all system activities</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)' }}>⚙️</h3>
            <h4>Settings</h4>
            <p>Configure system preferences</p>
          </div>
        </div>
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
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      // Create preview URL
      const previewURL = URL.createObjectURL(file);
      setPhotoPreview(previewURL);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'event_management');

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dyv0fhnnt/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      throw new Error('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let photoUrl = formData.photo;

      // Upload photo if a file was selected
      if (photoFile) {
        photoUrl = await uploadToCloudinary(photoFile);
      }

      const response = await api.post('/admin/register-faculty', {
        ...formData,
        photo: photoUrl
      });

      showSuccess(response.data.message || 'Faculty registered successfully! ✅');
      setFormData({ name: '', email: '', contactNo: '', password: '', photo: '' });
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to register faculty');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="dashboard">
      <h2>Register Faculty 👥</h2>
      <div className="section">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter faculty name"
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
              placeholder="faculty@example.com"
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
              placeholder="+1234567890"
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
              placeholder="Create a secure password"
            />
          </div>
          <div className="form-group">
            <label>Photo (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{
                padding: '10px',
                border: '2px dashed var(--primary-gradient-start)',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            />
            {photoPreview && (
              <div style={{ marginTop: 'var(--space-md)' }}>
                <img
                  src={photoPreview}
                  alt="Preview"
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            style={{ width: '100%' }}
            disabled={uploading}
          >
            {uploading ? '⏳ Uploading...' : 'Register Faculty →'}
          </button>
        </form>
      </div>
    </div>
  );
};

const FacultyList = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

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
    if (window.confirm('Are you sure you want to delete this faculty? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/faculty/${id}`);
        showSuccess('Faculty deleted successfully');
        fetchFaculties();
      } catch (error) {
        showError('Failed to delete faculty');
        console.error('Error deleting faculty:', error);
      }
    }
  };

  if (loading) return (
    <div className="dashboard">
      <div className="section">
        <h2>Loading faculties...</h2>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <h2>Faculty List 👥</h2>
      <div className="section">
        {faculties.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
            <h3 style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>👥</h3>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>
              No faculties registered yet.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {faculties.map((faculty) => (
                  <tr key={faculty._id}>
                    <td><strong>{faculty.name}</strong></td>
                    <td>📧 {faculty.email}</td>
                    <td>📞 {faculty.contactNo}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(faculty._id)}
                        className="btn-danger"
                        style={{ fontSize: '0.85rem', padding: 'var(--space-sm) var(--space-md)' }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
