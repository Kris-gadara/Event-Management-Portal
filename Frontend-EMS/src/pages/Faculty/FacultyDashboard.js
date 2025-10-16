import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../utils/api';

const FacultyHome = () => {
  return (
    <div className="container">
      <h1>Faculty Dashboard</h1>
      <div className="card">
        <h3>Welcome Faculty</h3>
        <p>Manage clubs, assign coordinators, and verify events.</p>
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
      const response = await api.post('/faculty/create-club', formData);
      setMessage(response.data.message);
      setFormData({ name: '', description: '', image: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create club');
    }
  };

  return (
    <div className="container">
      <h2>Create Club</h2>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Club Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Image URL (optional)</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
          </div>
          {message && <div className="success">{message}</div>}
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn btn-primary">Create Club</button>
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
      alert('Please select both club and student');
      return;
    }

    try {
      await api.post('/faculty/assign-coordinator', {
        clubId: selectedClub,
        studentId: selectedStudent
      });
      alert('Coordinator assigned successfully');
      fetchClubs();
      setSelectedClub('');
      setSelectedStudent('');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to assign coordinator');
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>Manage Clubs</h2>

      <div className="card">
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
        <button onClick={handleAssignCoordinator} className="btn btn-primary">
          Assign Coordinator
        </button>
      </div>

      <div className="card">
        <h3>My Clubs</h3>
        {clubs.length === 0 ? (
          <p>No clubs created yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Coordinator</th>
              </tr>
            </thead>
            <tbody>
              {clubs.map((club) => (
                <tr key={club._id}>
                  <td>{club.name}</td>
                  <td>{club.description}</td>
                  <td>{club.coordinator?.name || 'Not assigned'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const VerifyEvents = () => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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
      alert('Event approved successfully');
      fetchEvents();
    } catch (error) {
      alert('Failed to approve event');
    }
  };

  const handleReject = async (eventId) => {
    try {
      await api.put(`/faculty/verify-event/${eventId}`, { status: 'rejected' });
      alert('Event rejected');
      fetchEvents();
    } catch (error) {
      alert('Failed to reject event');
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>Verify Events</h2>

      <div className="card">
        <h3>Pending Events</h3>
        {pendingEvents.length === 0 ? (
          <p>No pending events.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Created By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingEvents.map((event) => (
                <tr key={event._id}>
                  <td>{event.name}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.venue}</td>
                  <td>{event.createdBy?.name}</td>
                  <td>
                    <button
                      onClick={() => handleApprove(event._id)}
                      className="btn btn-primary"
                      style={{ fontSize: '12px', padding: '5px 10px', marginRight: '5px' }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(event._id)}
                      className="btn btn-danger"
                      style={{ fontSize: '12px', padding: '5px 10px' }}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h3>Approved Events</h3>
        {approvedEvents.length === 0 ? (
          <p>No approved events.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
              {approvedEvents.map((event) => (
                <tr key={event._id}>
                  <td>{event.name}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.venue}</td>
                  <td>{event.createdBy?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
