import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import ViewParticipants from './ViewParticipants';
import { useToast } from '../../components/Toast';
import api from '../../utils/api';
import { Target, Tent, ClipboardList, CheckCircle2, Loader2, Calendar, Clock, MapPin, Upload, Image, FileText, Mail, Building2, X, Check, AlertCircle } from 'lucide-react';

const CoordinatorHome = () => {
  return (
    <div className="coordinator-dashboard">
      <div className="dashboard-container">
        <div className="welcome-section">
          <div className="welcome-icon">
            <Target size={32} />
          </div>
          <h1>Coordinator Dashboard</h1>
          <p>Create and manage exciting events for your club!</p>
        </div>
        
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon purple">
              <Tent size={24} />
            </div>
            <div className="stat-content">
              <h3>Create Events</h3>
              <p>Organize amazing events and engage students</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">
              <ClipboardList size={24} />
            </div>
            <div className="stat-content">
              <h3>Manage Events</h3>
              <p>Track and monitor all your events</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <CheckCircle2 size={24} />
            </div>
            <div className="stat-content">
              <h3>Approval Status</h3>
              <p>View event approval status</p>
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
  
  .coordinator-dashboard {
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
  
  .stat-icon.green {
    background: linear-gradient(135deg, #22c55e 0%, #10b981 100%);
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

const CreateEvent = () => {
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    address: '',
    contactEmail: ''
  });

  const [primaryImageFile, setPrimaryImageFile] = useState(null);
  const [primaryImagePreview, setPrimaryImagePreview] = useState(null);
  const [additionalImage1File, setAdditionalImage1File] = useState(null);
  const [additionalImage1Preview, setAdditionalImage1Preview] = useState(null);
  const [additionalImage2File, setAdditionalImage2File] = useState(null);
  const [additionalImage2Preview, setAdditionalImage2Preview] = useState(null);
  const [additionalImage3File, setAdditionalImage3File] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [additionalImage3Preview, setAdditionalImage3Preview] = useState(null);

  const [additionalDesc1, setAdditionalDesc1] = useState('');
  const [additionalDesc2, setAdditionalDesc2] = useState('');
  const [additionalDesc3, setAdditionalDesc3] = useState('');

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const processImageFile = (file, setFile, setPreview, imageName) => {
    if (file.size > 5 * 1024 * 1024) {
      showError(`${imageName} size should be less than 5MB`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      showError(`Please select a valid image file for ${imageName}`);
      return;
    }

    setFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e, setFile, setPreview, imageName) => {
    const file = e.target.files[0];
    if (file) {
      processImageFile(file, setFile, setPreview, imageName);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e, setFile, setPreview, imageName) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      processImageFile(file, setFile, setPreview, imageName);
    }
  };

  const uploadSingleImage = async (file, imageName) => {
    if (!file) return null;

    try {
      const uploadData = new FormData();
      uploadData.append('image', file);

      const response = await api.post('/upload/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data.url;
    } catch (error) {
      showError(`Failed to upload ${imageName}`);
      console.error(`Upload error for ${imageName}:`, error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.date || !formData.time || !formData.venue) {
      showWarning('Please fill in all required fields');
      return;
    }

    if (!primaryImageFile) {
      showWarning('Please upload a primary image for the event card');
      return;
    }

    setUploading(true);
    showInfo('Uploading event images...');

    try {
      const primaryImageUrl = await uploadSingleImage(primaryImageFile, 'Primary Image');
      if (!primaryImageUrl) {
        setUploading(false);
        return;
      }

      const additionalImageUrls = [];

      if (additionalImage1File) {
        const url = await uploadSingleImage(additionalImage1File, 'Additional Image 1');
        if (url) additionalImageUrls.push(url);
      }

      if (additionalImage2File) {
        const url = await uploadSingleImage(additionalImage2File, 'Additional Image 2');
        if (url) additionalImageUrls.push(url);
      }

      if (additionalImage3File) {
        const url = await uploadSingleImage(additionalImage3File, 'Additional Image 3');
        if (url) additionalImageUrls.push(url);
      }

      const additionalDescriptions = [];
      if (additionalDesc1.trim()) additionalDescriptions.push(additionalDesc1.trim());
      if (additionalDesc2.trim()) additionalDescriptions.push(additionalDesc2.trim());
      if (additionalDesc3.trim()) additionalDescriptions.push(additionalDesc3.trim());

      const eventData = {
        ...formData,
        primaryImage: primaryImageUrl,
        additionalImages: additionalImageUrls,
        additionalDescriptions: additionalDescriptions,
        image: primaryImageUrl
      };

      const response = await api.post('/coordinator/create-event', eventData);
      showSuccess(response.data.message || 'Event created successfully! Waiting for faculty approval.');

      setFormData({
        name: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        address: '',
        contactEmail: ''
      });
      setPrimaryImageFile(null);
      setPrimaryImagePreview(null);
      setAdditionalImage1File(null);
      setAdditionalImage1Preview(null);
      setAdditionalImage2File(null);
      setAdditionalImage2Preview(null);
      setAdditionalImage3File(null);
      setAdditionalImage3Preview(null);
      setAdditionalDesc1('');
      setAdditionalDesc2('');
      setAdditionalDesc3('');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create event');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="coordinator-dashboard">
      <div className="form-container">
        <div className="form-header">
          <div className="form-icon">
            <Tent size={28} />
          </div>
          <h1>Create New Event</h1>
          <p>Fill in the details to create an amazing event</p>
        </div>
        
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-section">
            <h2><FileText size={20} /> Basic Information</h2>
            
            <div className="form-group">
              <label>Event Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter event name"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your event..."
                rows="4"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label><Calendar size={16} /> Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label><Clock size={16} /> Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label><MapPin size={16} /> Venue</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Enter venue name"
                required
              />
            </div>
            
            <div className="form-group">
              <label><Building2 size={16} /> Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address of the venue"
                required
              />
            </div>
            
            <div className="form-group">
              <label><Mail size={16} /> Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="contact@example.com"
                required
              />
            </div>
          </div>
          
          <div className="form-section">
            <h2><Image size={20} /> Primary Image (Required)</h2>
            <p className="section-hint">This image will be displayed on the event card</p>
            
            <div
              className="image-upload-zone primary"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, setPrimaryImageFile, setPrimaryImagePreview, 'Primary Image')}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setPrimaryImageFile, setPrimaryImagePreview, 'Primary Image')}
                id="primary-image-input"
                required
              />
              <label htmlFor="primary-image-input">
                {primaryImagePreview ? (
                  <div className="image-preview-wrapper">
                    <img src={primaryImagePreview} alt="Primary Preview" />
                    <div className="image-overlay">
                      <Upload size={24} />
                      <span>Change Image</span>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon"><Upload size={28} /></div>
                    <span className="upload-text">Click or drag image here</span>
                    <span className="upload-hint">Max size: 5MB</span>
                  </div>
                )}
              </label>
            </div>
          </div>
          
          <div className="form-section">
            <h2><Image size={20} /> Additional Images (Optional)</h2>
            <p className="section-hint">Upload up to 2 additional images for the detail page</p>
            
            <div className="additional-images-grid">
              <div className="additional-image-set">
                <h3>Image & Description Set 1</h3>
                <div
                  className="image-upload-zone secondary"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, setAdditionalImage1File, setAdditionalImage1Preview, 'Additional Image 1')}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setAdditionalImage1File, setAdditionalImage1Preview, 'Additional Image 1')}
                    id="additional-image-1-input"
                  />
                  <label htmlFor="additional-image-1-input">
                    {additionalImage1Preview ? (
                      <div className="image-preview-wrapper small">
                        <img src={additionalImage1Preview} alt="Additional 1 Preview" />
                        <div className="image-overlay">
                          <Upload size={20} />
                        </div>
                      </div>
                    ) : (
                      <div className="upload-placeholder small">
                        <Upload size={20} />
                        <span>Upload Image</span>
                      </div>
                    )}
                  </label>
                </div>
                <textarea
                  value={additionalDesc1}
                  onChange={(e) => setAdditionalDesc1(e.target.value)}
                  placeholder="Description for this section..."
                  rows="3"
                />
              </div>
              
              <div className="additional-image-set">
                <h3>Image & Description Set 2</h3>
                <div
                  className="image-upload-zone secondary"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, setAdditionalImage2File, setAdditionalImage2Preview, 'Additional Image 2')}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setAdditionalImage2File, setAdditionalImage2Preview, 'Additional Image 2')}
                    id="additional-image-2-input"
                  />
                  <label htmlFor="additional-image-2-input">
                    {additionalImage2Preview ? (
                      <div className="image-preview-wrapper small">
                        <img src={additionalImage2Preview} alt="Additional 2 Preview" />
                        <div className="image-overlay">
                          <Upload size={20} />
                        </div>
                      </div>
                    ) : (
                      <div className="upload-placeholder small">
                        <Upload size={20} />
                        <span>Upload Image</span>
                      </div>
                    )}
                  </label>
                </div>
                <textarea
                  value={additionalDesc2}
                  onChange={(e) => setAdditionalDesc2(e.target.value)}
                  placeholder="Description for this section..."
                  rows="3"
                />
              </div>
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
                <Tent size={20} />
                <span>Create Event</span>
              </>
            )}
          </button>
        </form>
      </div>
      
      <style>{createEventStyles}</style>
    </div>
  );
};

const createEventStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
  
  .coordinator-dashboard {
    min-height: calc(100vh - 70px);
    background: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 50%, #f0fdf4 100%);
    padding: 40px 24px;
    font-family: 'DM Sans', -apple-system, sans-serif;
  }
  
  .form-container {
    max-width: 800px;
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
  
  .event-form {
    background: white;
    border-radius: 24px;
    padding: 40px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.04);
  }
  
  .form-section {
    margin-bottom: 32px;
    padding-bottom: 32px;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .form-section:last-of-type {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  .form-section h2 {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 8px;
    font-family: 'Outfit', sans-serif;
  }
  
  .form-section h2 svg {
    color: #0ea5e9;
  }
  
  .section-hint {
    font-size: 14px;
    color: #64748b;
    margin-bottom: 20px;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 600;
    color: #334155;
    margin-bottom: 8px;
  }
  
  .form-group label svg {
    color: #0ea5e9;
  }
  
  .event-form input,
  .event-form textarea {
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
  
  .event-form input:focus,
  .event-form textarea:focus {
    outline: none;
    border-color: #1e40af;
    background: white;
    box-shadow: 0 0 0 4px rgba(30, 64, 175, 0.1);
  }
  
  .event-form textarea {
    resize: vertical;
    min-height: 100px;
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
  
  .image-upload-zone.primary .upload-placeholder {
    padding: 48px;
    border: 2px dashed #1e40af;
    border-radius: 16px;
    background: #f0f9ff;
    text-align: center;
    transition: all 0.3s ease;
  }
  
  .image-upload-zone.primary .upload-placeholder:hover {
    border-color: #0ea5e9;
    background: #e0f2fe;
  }
  
  .upload-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin: 0 auto 16px;
  }
  
  .upload-text {
    display: block;
    font-size: 16px;
    font-weight: 600;
    color: #1e40af;
    margin-bottom: 4px;
  }
  
  .upload-hint {
    display: block;
    font-size: 13px;
    color: #64748b;
  }
  
  .image-preview-wrapper {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
  }
  
  .image-preview-wrapper img {
    width: 100%;
    height: 300px;
    object-fit: cover;
  }
  
  .image-preview-wrapper.small img {
    height: 150px;
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
    font-weight: 600;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .image-preview-wrapper:hover .image-overlay {
    opacity: 1;
  }
  
  .additional-images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }
  
  .additional-image-set {
    background: #f8fafc;
    border-radius: 16px;
    padding: 20px;
  }
  
  .additional-image-set h3 {
    font-size: 15px;
    font-weight: 600;
    color: #0ea5e9;
    margin-bottom: 16px;
  }
  
  .image-upload-zone.secondary .upload-placeholder {
    padding: 24px;
    border: 2px dashed #0ea5e9;
    border-radius: 12px;
    background: white;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  
  .image-upload-zone.secondary .upload-placeholder.small {
    color: #0ea5e9;
  }
  
  .additional-image-set textarea {
    margin-top: 16px;
  }
  
  .submit-btn {
    width: 100%;
    padding: 18px 32px;
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    color: white;
    border: none;
    border-radius: 14px;
    font-size: 17px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.3s ease;
    box-shadow: 0 6px 20px rgba(30, 64, 175, 0.3);
    font-family: 'DM Sans', sans-serif;
    margin-top: 24px;
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
  
  @media (max-width: 600px) {
    .form-row {
      grid-template-columns: 1fr;
    }
    
    .event-form {
      padding: 24px;
    }
  }
`;

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/coordinator/events');
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="coordinator-dashboard">
        <div className="loading-state">
          <div className="loading-icon">
            <Loader2 size={32} className="spin" />
          </div>
          <h2>Loading events...</h2>
        </div>
        <style>{myEventsStyles}</style>
      </div>
    );
  }

  return (
    <div className="coordinator-dashboard">
      <div className="dashboard-container">
        <div className="page-header">
          <div className="header-icon">
            <ClipboardList size={28} />
          </div>
          <h1>My Events</h1>
        </div>
        
        {events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Tent size={48} />
            </div>
            <h3>No Events Yet</h3>
            <p>Start creating amazing events for your club!</p>
          </div>
        ) : (
          <div className="events-table-wrapper">
            <table className="events-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Venue</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event._id}>
                    <td className="event-name">{event.name}</td>
                    <td>
                      <span className="table-icon"><Calendar size={14} /></span>
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td>
                      <span className="table-icon"><Clock size={14} /></span>
                      {event.time}
                    </td>
                    <td>
                      <span className="table-icon"><MapPin size={14} /></span>
                      {event.venue}
                    </td>
                    <td>
                      {event.status === 'approved' && (
                        <span className="status-badge approved">
                          <Check size={14} />
                          Approved
                        </span>
                      )}
                      {event.status === 'rejected' && (
                        <span className="status-badge rejected">
                          <X size={14} />
                          Rejected
                        </span>
                      )}
                      {event.status === 'pending' && (
                        <span className="status-badge pending">
                          <AlertCircle size={14} />
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <style>{myEventsStyles}</style>
    </div>
  );
};

const myEventsStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
  
  .coordinator-dashboard {
    min-height: calc(100vh - 70px);
    background: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 50%, #f0fdf4 100%);
    padding: 40px 24px;
    font-family: 'DM Sans', -apple-system, sans-serif;
  }
  
  .dashboard-container {
    max-width: 1200px;
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
  
  .events-table-wrapper {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }
  
  .events-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .events-table th {
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    color: white;
    padding: 18px 20px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .events-table td {
    padding: 18px 20px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 14px;
    color: #475569;
  }
  
  .events-table tr:last-child td {
    border-bottom: none;
  }
  
  .events-table tr:hover td {
    background: #f8fafc;
  }
  
  .event-name {
    font-weight: 600;
    color: #0f172a;
  }
  
  .table-icon {
    color: #0ea5e9;
    margin-right: 6px;
    display: inline-flex;
    vertical-align: middle;
  }
  
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 50px;
    font-size: 13px;
    font-weight: 600;
  }
  
  .status-badge.approved {
    background: #dcfce7;
    color: #166534;
  }
  
  .status-badge.rejected {
    background: #fee2e2;
    color: #991b1b;
  }
  
  .status-badge.pending {
    background: #fef3c7;
    color: #92400e;
  }
`;

const CoordinatorDashboard = () => {
  const navItems = [
    { label: 'Home', path: '/coordinator' },
    { label: 'Create Event', path: '/coordinator/create-event' },
    { label: 'My Events', path: '/coordinator/events' },
    { label: 'View Participants', path: '/coordinator/participants' }
  ];

  return (
    <>
      <Navbar role="coordinator" navItems={navItems} />
      <Routes>
        <Route path="/" element={<CoordinatorHome />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/events" element={<MyEvents />} />
        <Route path="/participants" element={<ViewParticipants />} />
      </Routes>
    </>
  );
};

export default CoordinatorDashboard;
