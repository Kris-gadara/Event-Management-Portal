import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import api from '../../utils/api';

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    studentId: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const { showSuccess, showError, showInfo } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('Image size should be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        showError('Please select a valid image file');
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    setUploading(true);
    showInfo('Uploading image...');

    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await api.post('/upload/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      showSuccess('Image uploaded successfully!');
      return response.data.url;
    } catch (error) {
      showError('Failed to upload image');
      console.error('Upload error:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload image if selected
      let imageUrl = formData.image;
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          setLoading(false);
          return;
        }
      }

      const registrationData = {
        ...formData,
        image: imageUrl
      };

      const result = await register(registrationData);

      if (result.success) {
        showSuccess('Registration successful! Please login.');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        showError(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      showError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container" style={{ maxWidth: '500px' }}>
        <h2>Student Registration</h2>
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
            <label>Student ID</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="e.g., 23DITXX"
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
            <label>Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g., Computer Science"
              required
            />
          </div>
          <div className="form-group">
            <label>Profile Picture (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                padding: 'var(--space-sm)',
                border: '2px dashed var(--primary-gradient-start)',
                borderRadius: '12px',
                backgroundColor: 'rgba(102, 126, 234, 0.05)',
                cursor: 'pointer'
              }}
            />
            {imagePreview && (
              <div style={{ marginTop: 'var(--space-md)', textAlign: 'center' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: '200px',
                    maxHeight: '200px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <p style={{
                  marginTop: 'var(--space-sm)',
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)'
                }}>
                  Preview
                </p>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%' }}
            disabled={loading || uploading}
          >
            {loading ? '⏳ Registering...' : uploading ? '📤 Uploading...' : '✓ Register'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 'var(--space-lg)', color: 'var(--text-light)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default StudentRegister;
