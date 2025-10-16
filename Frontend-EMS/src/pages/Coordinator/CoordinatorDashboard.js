import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../utils/api';

const CoordinatorHome = () => {
  return (
    <div className="container">
      <h1>Coordinator Dashboard</h1>
      <div className="card">
        <h3>Welcome Coordinator</h3>
        <p>Create and manage events for your club.</p>
      </div>
    </div>
  );
};

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    address: '',
    contactEmail: '',
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
      const response = await api.post('/coordinator/create-event', formData);
      setMessage(response.data.message);
      setFormData({
        name: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        address: '',
        contactEmail: '',
        image: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <div className="container">
      <h2>Create Event</h2>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Name</label>
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
          <button type="submit" className="btn btn-primary">Create Event</button>
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

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>My Events</h2>
      <div className="card">
        {events.length === 0 ? (
          <p>No events created yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Venue</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td>{event.name}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.time}</td>
                  <td>{event.venue}</td>
                  <td>
                    <span style={{
                      padding: '5px 10px',
                      borderRadius: '5px',
                      backgroundColor: event.status === 'approved' ? '#28a745' :
                        event.status === 'rejected' ? '#dc3545' : '#ffc107',
                      color: 'white',
                      fontSize: '12px'
                    }}>
                      {event.status}
                    </span>
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

const CoordinatorDashboard = () => {
  const navItems = [
    { label: 'Home', path: '/coordinator' },
    { label: 'Create Event', path: '/coordinator/create-event' },
    { label: 'My Events', path: '/coordinator/events' }
  ];

  return (
    <>
      <Navbar role="coordinator" navItems={navItems} />
      <Routes>
        <Route path="/" element={<CoordinatorHome />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/events" element={<MyEvents />} />
      </Routes>
    </>
  );
};

export default CoordinatorDashboard;
