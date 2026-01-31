import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useToast } from '../../components/Toast';
import api from '../../utils/api';
import { Shield, Users, BarChart3, Settings, UserPlus, Mail, Phone, Lock, Upload, Loader2, Trash2 } from 'lucide-react';

const AdminHome = () => {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <div className="welcome-section">
          <div className="welcome-icon">
            <Shield size={32} />
          </div>
          <h1>Admin Dashboard</h1>
          <p>Manage the entire event management system. Register faculty members and oversee all activities.</p>
        </div>
        
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon purple">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <h3>Faculty Management</h3>
              <p>Register and manage faculty members</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">
              <BarChart3 size={24} />
            </div>
            <div className="stat-content">
              <h3>System Overview</h3>
              <p>Monitor all system activities</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon cyan">
              <Settings size={24} />
            </div>
            <div className="stat-content">
              <h3>Settings</h3>
              <p>Configure system preferences</p>
            </div>
          </div>
        </div>
      </div>
      
      <style>{homeStyles}</style>
    </div>
  );
};

const homeStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
  
  .admin-dashboard {
    min-height: calc(100vh - 70px);
    background: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 50%, #f0fdf4 100%);
    padding: 40px 24px;
    font-family: 'DM Sans', -apple-system, sans-serif;
  }
  
  .dashboard-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .welcome-section {
    text-align: center;
    margin-bottom: 48px;
  }
  
  .welcome-icon {
    width: 72px;
    height: 72px;
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin: 0 auto 24px;
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.25);
  }
  
  .welcome-section h1 {
    font-size: 36px;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 12px;
    font-family: 'Outfit', sans-serif;
  }
  
  .welcome-section p {
    font-size: 17px;
    color: #64748b;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.7;
  }
  
  .quick-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }
  
  .stat-card {
    background: white;
    border-radius: 20px;
    padding: 28px;
    display: flex;
    align-items: flex-start;
    gap: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;
  }
  
  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(30, 64, 175, 0.12);
  }
  
  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .stat-icon.purple {
    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
    color: white;
  }
  
  .stat-icon.blue {
    background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
    color: white;
  }
  
  .stat-icon.cyan {
    background: linear-gradient(135deg, #0891b2 0%, #14b8a6 100%);
    color: white;
  }
  
  .stat-content h3 {
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 6px;
    font-family: 'Outfit', sans-serif;
  }
  
  .stat-content p {
    font-size: 14px;
    color: #64748b;
    line-height: 1.5;
    margin: 0;
  }
`;

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

      if (photoFile) {
        photoUrl = await uploadToCloudinary(photoFile);
      }

      const response = await api.post('/admin/register-faculty', {
        ...formData,
        photo: photoUrl
      });

      showSuccess(response.data.message || 'Faculty registered successfully!');
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
    <div className="admin-dashboard">
      <div className="form-container">
        <div className="form-header">
          <div className="form-icon">
            <UserPlus size={28} />
          </div>
          <h1>Register Faculty</h1>
          <p>Add a new faculty member to the system</p>
        </div>
        
        <form onSubmit={handleSubmit} className="faculty-form">
          <div className="form-group">
            <label><Users size={16} /> Full Name</label>
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
            <label><Mail size={16} /> Email Address</label>
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
            <label><Phone size={16} /> Contact Number</label>
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
            <label><Lock size={16} /> Password</label>
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
            <label><Upload size={16} /> Photo (Optional)</label>
            <div className="image-upload-zone">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                id="photo-input"
              />
              <label htmlFor="photo-input">
                {photoPreview ? (
                  <div className="image-preview-wrapper">
                    <img src={photoPreview} alt="Preview" />
                    <div className="image-overlay">
                      <Upload size={20} />
                      <span>Change</span>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon"><Upload size={24} /></div>
                    <span className="upload-text">Click to upload photo</span>
                  </div>
                )}
              </label>
            </div>
          </div>
          
          <button type="submit" className="submit-btn" disabled={uploading}>
            {uploading ? (
              <>
                <Loader2 size={20} className="spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <UserPlus size={20} />
                <span>Register Faculty</span>
              </>
            )}
          </button>
        </form>
      </div>
      
      <style>{registerStyles}</style>
    </div>
  );
};

const registerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
  
  .admin-dashboard {
    min-height: calc(100vh - 70px);
    background: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 50%, #f0fdf4 100%);
    padding: 40px 24px;
    font-family: 'DM Sans', -apple-system, sans-serif;
  }
  
  .form-container {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .form-header {
    text-align: center;
    margin-bottom: 40px;
  }
  
  .form-icon {
    width: 72px;
    height: 72px;
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin: 0 auto 24px;
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.25);
  }
  
  .form-header h1 {
    font-size: 32px;
    font-weight: 800;
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 8px;
    font-family: 'Outfit', sans-serif;
  }
  
  .form-header p {
    color: #64748b;
    font-size: 16px;
  }
  
  .faculty-form {
    background: white;
    border-radius: 24px;
    padding: 40px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.04);
  }
  
  .form-group {
    margin-bottom: 24px;
  }
  
  .form-group label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #334155;
    margin-bottom: 10px;
  }
  
  .form-group label svg {
    color: #0ea5e9;
  }
  
  .faculty-form input[type="text"],
  .faculty-form input[type="email"],
  .faculty-form input[type="password"] {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 15px;
    color: #0f172a;
    transition: all 0.3s ease;
    background: #f8fafc;
    font-family: 'DM Sans', sans-serif;
  }
  
  .faculty-form input:focus {
    outline: none;
    border-color: #1e40af;
    background: white;
    box-shadow: 0 0 0 4px rgba(30, 64, 175, 0.1);
  }
  
  .image-upload-zone {
    position: relative;
  }
  
  .image-upload-zone input {
    display: none;
  }
  
  .image-upload-zone label {
    display: block;
    cursor: pointer;
  }
  
  .upload-placeholder {
    padding: 32px;
    border: 2px dashed #e2e8f0;
    border-radius: 16px;
    background: #f8fafc;
    text-align: center;
    transition: all 0.3s ease;
  }
  
  .upload-placeholder:hover {
    border-color: #1e40af;
    background: #f0f9ff;
  }
  
  .upload-icon {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin: 0 auto 12px;
  }
  
  .upload-text {
    font-size: 14px;
    font-weight: 600;
    color: #1e40af;
  }
  
  .image-preview-wrapper {
    position: relative;
    width: 150px;
    height: 150px;
    margin: 0 auto;
    border-radius: 16px;
    overflow: hidden;
  }
  
  .image-preview-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(30, 64, 175, 0.7);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    color: white;
    font-weight: 600;
    font-size: 13px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .image-preview-wrapper:hover .image-overlay {
    opacity: 1;
  }
  
  .submit-btn {
    width: 100%;
    padding: 16px 32px;
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    color: white;
    border: none;
    border-radius: 14px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.3s ease;
    box-shadow: 0 6px 20px rgba(30, 64, 175, 0.3);
    font-family: 'DM Sans', sans-serif;
  }
  
  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(30, 64, 175, 0.4);
  }
  
  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .spin {
    animation: spin 1s linear infinite;
  }
`;

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
    <div className="admin-dashboard">
      <div className="loading-state">
        <div className="loading-icon">
          <Loader2 size={32} className="spin" />
        </div>
        <h2>Loading faculties...</h2>
      </div>
      <style>{listStyles}</style>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <div className="page-header">
          <div className="header-icon">
            <Users size={28} />
          </div>
          <h1>Faculty List</h1>
        </div>
        
        {faculties.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Users size={48} />
            </div>
            <h3>No Faculties Registered</h3>
            <p>Register your first faculty member to get started.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {faculties.map((faculty) => (
                  <tr key={faculty._id}>
                    <td className="name-cell">{faculty.name}</td>
                    <td>
                      <span className="table-icon"><Mail size={14} /></span>
                      {faculty.email}
                    </td>
                    <td>
                      <span className="table-icon"><Phone size={14} /></span>
                      {faculty.contactNo}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(faculty._id)}
                        className="delete-btn"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <style>{listStyles}</style>
    </div>
  );
};

const listStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
  
  .admin-dashboard {
    min-height: calc(100vh - 70px);
    background: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 50%, #f0fdf4 100%);
    padding: 40px 24px;
    font-family: 'DM Sans', -apple-system, sans-serif;
  }
  
  .dashboard-container {
    max-width: 1000px;
    margin: 0 auto;
  }
  
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
  }
  
  .loading-icon {
    width: 72px;
    height: 72px;
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-bottom: 20px;
  }
  
  .loading-state h2 {
    font-size: 20px;
    color: #64748b;
    font-weight: 600;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .spin {
    animation: spin 1s linear infinite;
  }
  
  .page-header {
    text-align: center;
    margin-bottom: 48px;
  }
  
  .header-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin: 0 auto 20px;
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.25);
  }
  
  .page-header h1 {
    font-size: 36px;
    font-weight: 800;
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-family: 'Outfit', sans-serif;
  }
  
  .empty-state {
    text-align: center;
    padding: 80px 24px;
    background: white;
    border-radius: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }
  
  .empty-icon {
    width: 96px;
    height: 96px;
    background: #f0f9ff;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0ea5e9;
    margin: 0 auto 24px;
  }
  
  .empty-state h3 {
    font-size: 24px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 8px;
    font-family: 'Outfit', sans-serif;
  }
  
  .empty-state p {
    font-size: 16px;
    color: #64748b;
  }
  
  .table-wrapper {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }
  
  .data-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .data-table th {
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    color: white;
    padding: 18px 20px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .data-table td {
    padding: 18px 20px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 14px;
    color: #475569;
  }
  
  .data-table tr:last-child td {
    border-bottom: none;
  }
  
  .data-table tr:hover td {
    background: #f8fafc;
  }
  
  .name-cell {
    font-weight: 600;
    color: #0f172a;
  }
  
  .table-icon {
    color: #0ea5e9;
    margin-right: 8px;
    display: inline-flex;
    vertical-align: middle;
  }
  
  .delete-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
  }
  
  .delete-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.35);
  }
`;

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
