import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useToast } from '../../components/Toast';
import api from '../../utils/api';

const FacultyHome = () => {
  return (
    <div className="dashboard">
      <h2>Faculty Dashboard</h2>
      <div className="section">
        <h3>Welcome, Faculty! 👨‍🏫</h3>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-light)', marginBottom: 'var(--space-xl)' }}>
          Manage clubs, assign coordinators, and verify event requests. Your role is crucial in organizing campus activities!
        </p>
        <div className="card-grid">
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)' }}>🎭</h3>
            <h4>Club Management</h4>
            <p>Create and manage student clubs</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)' }}>👥</h3>
            <h4>Coordinators</h4>
            <p>Assign coordinators to clubs</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)' }}>✅</h3>
            <h4>Event Verification</h4>
            <p>Approve or reject event requests</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateClub = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { showSuccess, showError, showInfo } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showError('Image size should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        showError('Please select a valid image file');
        return;
      }

      setImageFile(file);

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
    showInfo('Uploading club image...');

    try {
      const uploadData = new FormData();
      uploadData.append('image', imageFile);

      const response = await api.post('/upload/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

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

    try {
      let imageUrl = formData.image;
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) return;
      }

      const clubData = {
        ...formData,
        image: imageUrl
      };

      const response = await api.post('/faculty/create-club', clubData);
      showSuccess(response.data.message || 'Club created successfully! 🎭');
      setFormData({ name: '', description: '', image: '' });
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create club');
    }
  };

  return (
    <div className="dashboard">
      <h2>Create Club 🎭</h2>
      <div className="section">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Club Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter club name"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe the club's purpose and activities"
            />
          </div>
          <div className="form-group">
            <label>Club Image (optional)</label>
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
                  alt="Club Preview"
                  style={{
                    maxWidth: '300px',
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
          <button type="submit" style={{ width: '100%' }} disabled={uploading}>
            {uploading ? '📤 Uploading...' : '🎭 Create Club →'}
          </button>
        </form>
      </div>
    </div>
  );
};

const ManageClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClub, setSelectedClub] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError, showWarning } = useToast();

  useEffect(() => {
    fetchClubs();
    fetchStudents();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await api.get('/faculty/clubs');
      setClubs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clubs:', error);
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get('/faculty/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleAssignCoordinator = async () => {
    if (!selectedClub || !selectedStudent) {
      showWarning('Please select both club and student');
      return;
    }

    try {
      await api.post('/faculty/assign-coordinator', {
        clubId: selectedClub,
        studentId: selectedStudent
      });
      showSuccess('Coordinator assigned successfully! 👥');
      fetchClubs();
      setSelectedClub('');
      setSelectedStudent('');
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to assign coordinator');
    }
  };

  if (loading) return (
    <div className="dashboard">
      <div className="section">
        <h2>Loading clubs...</h2>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <h2>Manage Clubs 🎭</h2>

      <div className="section">
        <h3>Assign Coordinator</h3>
        <div className="form-group">
          <label>Select Club</label>
          <select value={selectedClub} onChange={(e) => setSelectedClub(e.target.value)}>
            <option value="">-- Select Club --</option>
            {clubs.map((club) => (
              <option key={club._id} value={club._id}>
                {club.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Select Student</label>
          <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
            <option value="">-- Select Student --</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name} ({student.email})
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleAssignCoordinator} style={{ width: '100%' }}>
          Assign Coordinator →
        </button>
      </div>

      <div className="section" style={{ marginTop: 'var(--space-2xl)' }}>
        <h3>My Clubs</h3>
        {clubs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
            <h3 style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🎭</h3>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>
              No clubs created yet.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Club Name</th>
                  <th>Description</th>
                  <th>Coordinator</th>
                </tr>
              </thead>
              <tbody>
                {clubs.map((club) => (
                  <tr key={club._id}>
                    <td><strong>{club.name}</strong></td>
                    <td>{club.description}</td>
                    <td>
                      {club.coordinator ? (
                        <span className="badge badge-success">
                          👤 {club.coordinator.name}
                        </span>
                      ) : (
                        <span className="badge badge-pending">
                          Not assigned
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
    </div>
  );
};

const VerifyEvents = () => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const [pending, approved] = await Promise.all([
        api.get('/faculty/events/pending'),
        api.get('/faculty/events/approved')
      ]);
      setPendingEvents(pending.data);
      setApprovedEvents(approved.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (eventId) => {
    try {
      await api.put(`/faculty/verify-event/${eventId}`, { status: 'approved' });
      showSuccess('Event approved successfully! ✅');
      fetchEvents();
    } catch (error) {
      showError('Failed to approve event');
    }
  };

  const handleReject = async (eventId) => {
    try {
      await api.put(`/faculty/verify-event/${eventId}`, { status: 'rejected' });
      showSuccess('Event rejected');
      fetchEvents();
    } catch (error) {
      showError('Failed to reject event');
    }
  };

  if (loading) return (
    <div className="dashboard">
      <div className="section">
        <h2>Loading events...</h2>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <h2>Verify Events ✅</h2>

      <div className="section">
        <h3>Pending Events</h3>
        {pendingEvents.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
            <h3 style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>✅</h3>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>
              No pending events to review.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Created By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingEvents.map((event) => (
                  <tr key={event._id}>
                    <td><strong>{event.name}</strong></td>
                    <td>📅 {new Date(event.date).toLocaleDateString()}</td>
                    <td>📍 {event.venue}</td>
                    <td>👤 {event.createdBy?.name}</td>
                    <td>
                      <button
                        onClick={() => handleApprove(event._id)}
                        className="btn-success"
                        style={{ fontSize: '0.85rem', padding: 'var(--space-sm) var(--space-md)', marginRight: 'var(--space-sm)' }}
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleReject(event._id)}
                        className="btn-danger"
                        style={{ fontSize: '0.85rem', padding: 'var(--space-sm) var(--space-md)' }}
                      >
                        ✗ Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="section">
        <h3 style={{
          fontSize: '1.5rem',
          background: 'linear-gradient(135deg, var(--success-gradient-start), var(--success-gradient-end))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 'var(--space-lg)'
        }}>
          ✅ Approved Events
        </h3>
        {approvedEvents.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-xxl)' }}>
            <p style={{ fontSize: '3rem', margin: '0 0 var(--space-md) 0' }}>📋</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No approved events yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Created By</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {approvedEvents.map((event) => (
                  <tr key={event._id}>
                    <td><strong>{event.name}</strong></td>
                    <td>📅 {new Date(event.date).toLocaleDateString()}</td>
                    <td>📍 {event.venue}</td>
                    <td>👤 {event.createdBy?.name}</td>
                    <td><span className="badge-success">✓ Approved</span></td>
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

const FacultyDashboard = () => {
  const navItems = [
    { label: 'Home', path: '/faculty' },
    { label: 'Create Club', path: '/faculty/create-club' },
    { label: 'Manage Clubs', path: '/faculty/clubs' },
    { label: 'Verify Events', path: '/faculty/events' }
  ];

  return (
    <>
      <Navbar role="faculty" navItems={navItems} />
      <Routes>
        <Route path="/" element={<FacultyHome />} />
        <Route path="/create-club" element={<CreateClub />} />
        <Route path="/clubs" element={<ManageClubs />} />
        <Route path="/events" element={<VerifyEvents />} />
      </Routes>
    </>
  );
};

export default FacultyDashboard;
