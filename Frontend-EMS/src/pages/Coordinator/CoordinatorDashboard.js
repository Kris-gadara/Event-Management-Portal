import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import ViewParticipants from './ViewParticipants';
import { useToast } from '../../components/Toast';
import api from '../../utils/api';

const CoordinatorHome = () => {
  return (
    <div className="dashboard">
      <div className="section">
        <h1 style={{
          fontSize: '2.5rem',
          background: 'linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 'var(--space-md)'
        }}>
          🎯 Coordinator Dashboard
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-xxl)' }}>
          Create and manage exciting events for your club!
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-lg)',
          marginTop: 'var(--space-xl)'
        }}>
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🎪</div>
            <h3 style={{ marginBottom: 'var(--space-sm)', color: 'var(--primary-gradient-start)' }}>Create Events</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Organize amazing events and engage students</p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>📋</div>
            <h3 style={{ marginBottom: 'var(--space-sm)', color: 'var(--secondary-gradient-start)' }}>Manage Events</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Track and monitor all your events</p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>✅</div>
            <h3 style={{ marginBottom: 'var(--space-sm)', color: 'var(--success-gradient-start)' }}>Approval Status</h3>
            <p style={{ color: 'var(--text-secondary)' }}>View event approval status</p>
          </div>
        </div>
      </div>
    </div>
  );
};

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

  // State for 4 images: 1 primary + 3 additional
  const [primaryImageFile, setPrimaryImageFile] = useState(null);
  const [primaryImagePreview, setPrimaryImagePreview] = useState(null);
  const [additionalImage1File, setAdditionalImage1File] = useState(null);
  const [additionalImage1Preview, setAdditionalImage1Preview] = useState(null);
  const [additionalImage2File, setAdditionalImage2File] = useState(null);
  const [additionalImage2Preview, setAdditionalImage2Preview] = useState(null);
  const [additionalImage3File, setAdditionalImage3File] = useState(null);
  const [additionalImage3Preview, setAdditionalImage3Preview] = useState(null);

  // State for 3 additional descriptions
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

    // Validation
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
      // Upload all images
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

      // Collect additional descriptions
      const additionalDescriptions = [];
      if (additionalDesc1.trim()) additionalDescriptions.push(additionalDesc1.trim());
      if (additionalDesc2.trim()) additionalDescriptions.push(additionalDesc2.trim());
      if (additionalDesc3.trim()) additionalDescriptions.push(additionalDesc3.trim());

      const eventData = {
        ...formData,
        primaryImage: primaryImageUrl,
        additionalImages: additionalImageUrls,
        additionalDescriptions: additionalDescriptions,
        image: primaryImageUrl // Keep for backward compatibility
      };

      const response = await api.post('/coordinator/create-event', eventData);
      showSuccess(response.data.message || 'Event created successfully! Waiting for faculty approval.');

      // Reset form
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
    <div className="dashboard">
      <div className="section">
        <h2 style={{
          fontSize: '2rem',
          background: 'linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 'var(--space-xl)'
        }}>
          🎪 Create New Event
        </h2>
        <form onSubmit={handleSubmit}>
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
              required
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Venue</label>
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
            <label>Address</label>
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
            <label>Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="contact@example.com"
              required
            />
          </div>

          {/* Primary Image - Required for Event Card */}
          <div className="form-group">
            <label style={{
              fontWeight: '600',
              color: '#1e40af',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-xs)'
            }}>
              🖼️ Primary Image (Required - for Event Card)
            </label>
            <div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, setPrimaryImageFile, setPrimaryImagePreview, 'Primary Image')}
              style={{
                padding: 'var(--space-xl)',
                border: '2px dashed #1e40af',
                borderRadius: '12px',
                backgroundColor: '#f0f9ff',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setPrimaryImageFile, setPrimaryImagePreview, 'Primary Image')}
                id="primary-image-input"
                style={{ display: 'none' }}
                required
              />
              <label
                htmlFor="primary-image-input"
                style={{
                  cursor: 'pointer',
                  display: 'block',
                  color: '#1e40af',
                  fontWeight: '500'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>📁</div>
                <div>Click to select or drag and drop primary image</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 'var(--space-xs)' }}>Max size: 5MB</div>
              </label>
            </div>
            {primaryImagePreview && (
              <div style={{ marginTop: 'var(--space-md)', textAlign: 'center' }}>
                <img
                  src={primaryImagePreview}
                  alt="Primary Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '12px',
                    boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)'
                  }}
                />
                <p style={{
                  marginTop: 'var(--space-sm)',
                  fontSize: '0.9rem',
                  color: 'var(--primary-gradient-start)',
                  fontWeight: '500'
                }}>
                  ✓ Primary Image Preview
                </p>
              </div>
            )}
          </div>

          {/* Additional Images - Optional for Detail Page */}
          <div className="form-group">
            <label style={{
              fontWeight: '600',
              color: 'var(--secondary-gradient-start)',
              marginBottom: 'var(--space-sm)'
            }}>
              📸 Additional Images (Optional - for Detail Page)
            </label>
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-md)'
            }}>
              Upload up to 2 additional images to display in the event detail page
            </p>

            {/* Additional Image 1 */}
            <div style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-md)', backgroundColor: '#f0f9ff', borderRadius: '12px' }}>
              <label style={{ fontSize: '0.95rem', color: '#3b82f6', marginBottom: 'var(--space-sm)', display: 'block', fontWeight: '600' }}>
                📸 Image & Description Set 1
              </label>
              <label style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 'var(--space-xs)', display: 'block' }}>
                Image 1
              </label>
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, setAdditionalImage1File, setAdditionalImage1Preview, 'Additional Image 1')}
                style={{
                  padding: 'var(--space-lg)',
                  border: '2px dashed #3b82f6',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setAdditionalImage1File, setAdditionalImage1Preview, 'Additional Image 1')}
                  id="additional-image-1-input"
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="additional-image-1-input"
                  style={{
                    cursor: 'pointer',
                    display: 'block',
                    color: '#3b82f6',
                    fontSize: '0.9rem'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-xs)' }}>📁</div>
                  <div>Click or drag image here</div>
                </label>
              </div>
              {additionalImage1Preview && (
                <div style={{ marginTop: 'var(--space-sm)' }}>
                  <img
                    src={additionalImage1Preview}
                    alt="Additional 1 Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                </div>
              )}

              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 'var(--space-md)', marginBottom: 'var(--space-xs)', display: 'block' }}>
                Description 1 (appears opposite to Image 1 on detail page)
              </label>
              <textarea
                value={additionalDesc1}
                onChange={(e) => setAdditionalDesc1(e.target.value)}
                placeholder="Enter description for this section (e.g., what attendees will learn, activities planned, etc.)"
                rows="4"
                style={{
                  width: '100%',
                  padding: 'var(--space-sm)',
                  border: '2px dashed var(--secondary-gradient-start)',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(118, 75, 162, 0.05)',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Additional Image 2 */}
            <div style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-md)', backgroundColor: '#f0f9ff', borderRadius: '12px' }}>
              <label style={{ fontSize: '0.95rem', color: '#3b82f6', marginBottom: 'var(--space-sm)', display: 'block', fontWeight: '600' }}>
                📸 Image & Description Set 2
              </label>
              <label style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 'var(--space-xs)', display: 'block' }}>
                Image 2
              </label>
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, setAdditionalImage2File, setAdditionalImage2Preview, 'Additional Image 2')}
                style={{
                  padding: 'var(--space-lg)',
                  border: '2px dashed #3b82f6',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setAdditionalImage2File, setAdditionalImage2Preview, 'Additional Image 2')}
                  id="additional-image-2-input"
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="additional-image-2-input"
                  style={{
                    cursor: 'pointer',
                    display: 'block',
                    color: '#3b82f6',
                    fontSize: '0.9rem'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-xs)' }}>📁</div>
                  <div>Click or drag image here</div>
                </label>
              </div>
              {additionalImage2Preview && (
                <div style={{ marginTop: 'var(--space-sm)' }}>
                  <img
                    src={additionalImage2Preview}
                    alt="Additional 2 Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                </div>
              )}

              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 'var(--space-md)', marginBottom: 'var(--space-xs)', display: 'block' }}>
                Description 2 (appears opposite to Image 2 on detail page)
              </label>
              <textarea
                value={additionalDesc2}
                onChange={(e) => setAdditionalDesc2(e.target.value)}
                placeholder="Enter description for this section (e.g., benefits, requirements, what to expect, etc.)"
                rows="4"
                style={{
                  width: '100%',
                  padding: 'var(--space-sm)',
                  border: '2px dashed var(--secondary-gradient-start)',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(118, 75, 162, 0.05)',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', fontSize: '1.1rem' }}
            disabled={uploading}
          >
            {uploading ? '📤 Uploading Images...' : '🎪 Create Event →'}
          </button>
        </form>
      </div>
    </div>
  );
};

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
      <div className="dashboard">
        <div className="section">
          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>⏳ Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="section">
        <h2 style={{
          fontSize: '2rem',
          background: 'linear-gradient(135deg, var(--secondary-gradient-start), var(--secondary-gradient-end))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 'var(--space-xl)'
        }}>
          📋 My Events
        </h2>
        {events.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-xxl)' }}>
            <p style={{ fontSize: '3rem', margin: '0 0 var(--space-md) 0' }}>🎪</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No events created yet. Start creating amazing events!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
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
                    <td><strong>{event.name}</strong></td>
                    <td>📅 {new Date(event.date).toLocaleDateString()}</td>
                    <td>🕐 {event.time}</td>
                    <td>📍 {event.venue}</td>
                    <td>
                      {event.status === 'approved' && (
                        <span className="badge-success">✓ Approved</span>
                      )}
                      {event.status === 'rejected' && (
                        <span className="badge-danger">✗ Rejected</span>
                      )}
                      {event.status === 'pending' && (
                        <span className="badge-pending">⏳ Pending</span>
                      )}
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
