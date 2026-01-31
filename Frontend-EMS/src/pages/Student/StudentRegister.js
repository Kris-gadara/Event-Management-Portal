import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import api from '../../utils/api';
import { User, Mail, Lock, Building2, IdCard, Upload, GraduationCap, UserPlus, ArrowRight, Check, Image, Eye, EyeOff, Calendar, Users, Trophy } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="register-page">
      {/* Left Side - Decorative */}
      <div className="register-left">
        <div className="register-left-content">
          <Link to="/" className="register-logo">
            <div className="logo-icon-wrapper">
              <GraduationCap size={32} strokeWidth={2.5} />
            </div>
            <span className="logo-text">Event Management System</span>
          </Link>
          
          <div className="register-welcome">
            <h1>Join Our Community</h1>
            <p>Create an account to discover amazing campus events, join student clubs, and connect with your peers.</p>
          </div>
          
          <div className="register-features">
            <div className="feature-item">
              <div className="feature-icon"><Calendar size={20} /></div>
              <span>Register for events easily</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><Users size={20} /></div>
              <span>Join student clubs</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><Trophy size={20} /></div>
              <span>Earn certificates & rewards</span>
            </div>
          </div>
        </div>
        
        <div className="register-decorations">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="register-right">
        <div className="register-container">
          <div className="register-header">
            <div className="register-icon">
              <UserPlus size={24} />
            </div>
            <h2>Create Account</h2>
            <p>Fill in your details to get started</p>
          </div>
          
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <User size={20} className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Student ID</label>
                <div className="input-wrapper">
                  <IdCard size={20} className="input-icon" />
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="e.g., 23DITXX"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <Lock size={20} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label>Department</label>
                <div className="input-wrapper">
                  <Building2 size={20} className="input-icon" />
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g., Computer Science"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label>Profile Picture (Optional)</label>
              <div className="image-upload-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="profile-image"
                  className="image-input"
                />
                <label htmlFor="profile-image" className="image-upload-label">
                  {imagePreview ? (
                    <div className="image-preview-container">
                      <img src={imagePreview} alt="Preview" className="image-preview" />
                      <div className="image-overlay">
                        <Image size={20} />
                        <span>Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <div className="upload-icon">
                        <Upload size={24} />
                      </div>
                      <span className="upload-text">Click to upload photo</span>
                      <span className="upload-hint">PNG, JPG up to 5MB</span>
                    </div>
                  )}
                </label>
              </div>
            </div>
            
            <button type="submit" className="register-btn" disabled={loading || uploading}>
              {loading ? (
                <span className="loading-text">Creating account...</span>
              ) : uploading ? (
                <span className="loading-text">Uploading image...</span>
              ) : (
                <>
                  <Check size={20} />
                  <span>Create Account</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
          
          <div className="register-divider">
            <span>or</span>
          </div>
          
          <p className="register-login">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>

      <style>{styles}</style>
    </div>
  );
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
  
  .register-page {
    display: flex;
    min-height: 100vh;
    font-family: 'DM Sans', -apple-system, sans-serif;
  }
  
  /* Left Side */
  .register-left {
    flex: 0 0 45%;
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    padding: 48px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }
  
  .register-left-content {
    position: relative;
    z-index: 1;
  }
  
  .register-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    margin-bottom: 80px;
  }
  
  .register-logo .logo-icon-wrapper {
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  .register-logo .logo-text {
    font-size: 20px;
    font-weight: 700;
    color: white;
    font-family: 'Outfit', sans-serif;
  }
  
  .register-welcome {
    margin-bottom: 60px;
  }
  
  .register-welcome h1 {
    font-size: 44px;
    font-weight: 800;
    color: white;
    margin-bottom: 16px;
    font-family: 'Outfit', sans-serif;
    letter-spacing: -1px;
  }
  
  .register-welcome p {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.6;
    max-width: 400px;
  }
  
  .register-features {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .feature-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 20px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: white;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  
  .feature-item:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(5px);
  }
  
  .feature-icon {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .register-decorations {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }
  
  .decoration-circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
  }
  
  .circle-1 {
    width: 400px;
    height: 400px;
    top: -150px;
    right: -150px;
  }
  
  .circle-2 {
    width: 300px;
    height: 300px;
    bottom: -100px;
    left: -100px;
  }
  
  .circle-3 {
    width: 200px;
    height: 200px;
    bottom: 20%;
    right: 10%;
    background: rgba(255, 255, 255, 0.08);
  }
  
  /* Right Side */
  .register-right {
    flex: 1;
    background: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
    overflow-y: auto;
  }
  
  .register-container {
    width: 100%;
    max-width: 520px;
    background: white;
    padding: 40px;
    border-radius: 24px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.04);
  }
  
  .register-header {
    text-align: center;
    margin-bottom: 32px;
  }
  
  .register-icon {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin: 0 auto 20px;
    box-shadow: 0 4px 16px rgba(30, 64, 175, 0.3);
  }
  
  .register-header h2 {
    font-size: 28px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 8px;
    font-family: 'Outfit', sans-serif;
  }
  
  .register-header p {
    font-size: 15px;
    color: #64748b;
  }
  
  .register-form .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  
  .register-form .form-group {
    margin-bottom: 20px;
  }
  
  .register-form label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #334155;
    margin-bottom: 8px;
  }
  
  .input-wrapper {
    position: relative;
  }
  
  .input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
  }
  
  .register-form input[type="email"],
  .register-form input[type="password"],
  .register-form input[type="text"] {
    width: 100%;
    padding: 12px 14px 12px 44px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 15px;
    color: #0f172a;
    transition: all 0.3s ease;
    background: #f8fafc;
    font-family: 'DM Sans', sans-serif;
  }
  
  .register-form input:focus {
    outline: none;
    border-color: #1e40af;
    background: white;
    box-shadow: 0 0 0 4px rgba(30, 64, 175, 0.1);
  }
  
  .register-form input::placeholder {
    color: #94a3b8;
  }
  
  .password-toggle {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.3s ease;
  }
  
  .password-toggle:hover {
    color: #1e40af;
  }
  
  /* Image Upload */
  .image-upload-wrapper {
    position: relative;
  }
  
  .image-input {
    display: none;
  }
  
  .image-upload-label {
    display: block;
    cursor: pointer;
  }
  
  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 28px;
    border: 2px dashed #e2e8f0;
    border-radius: 16px;
    background: #f8fafc;
    transition: all 0.3s ease;
  }
  
  .upload-placeholder:hover {
    border-color: #1e40af;
    background: rgba(30, 64, 175, 0.02);
  }
  
  .upload-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-bottom: 12px;
  }
  
  .upload-text {
    font-size: 14px;
    font-weight: 600;
    color: #334155;
    margin-bottom: 4px;
  }
  
  .upload-hint {
    font-size: 12px;
    color: #94a3b8;
  }
  
  .image-preview-container {
    position: relative;
    width: 100%;
    height: 160px;
    border-radius: 16px;
    overflow: hidden;
  }
  
  .image-preview {
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
    gap: 8px;
    color: white;
    font-weight: 500;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .image-preview-container:hover .image-overlay {
    opacity: 1;
  }
  
  .register-btn {
    width: 100%;
    padding: 14px 24px;
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(30, 64, 175, 0.3);
    font-family: 'DM Sans', sans-serif;
    margin-top: 8px;
  }
  
  .register-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.4);
  }
  
  .register-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .loading-text {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  
  .register-divider {
    display: flex;
    align-items: center;
    margin: 24px 0;
  }
  
  .register-divider::before,
  .register-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }
  
  .register-divider span {
    padding: 0 16px;
    color: #94a3b8;
    font-size: 14px;
    font-weight: 500;
  }
  
  .register-login {
    text-align: center;
    font-size: 15px;
    color: #64748b;
    margin: 0;
  }
  
  .register-login a {
    color: #1e40af;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .register-login a:hover {
    color: #0ea5e9;
  }
  
  /* Responsive */
  @media (max-width: 1024px) {
    .register-left {
      display: none;
    }
    
    .register-right {
      padding: 24px;
    }
    
    .register-container {
      padding: 32px;
    }
  }
  
  @media (max-width: 600px) {
    .register-right {
      padding: 16px;
    }
    
    .register-container {
      padding: 24px;
      border-radius: 20px;
    }
    
    .register-header h2 {
      font-size: 24px;
    }
    
    .register-form .form-row {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }
`;

export default StudentRegister;
