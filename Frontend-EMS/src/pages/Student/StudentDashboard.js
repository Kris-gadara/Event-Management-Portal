import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../utils/api';

const StudentHome = () => {
  return (
    <div className="container">
      <h1>Student Dashboard</h1>
      <div className="card">
        <h3>Welcome Student</h3>
        <p>Browse events, register for events, and view clubs.</p>
      </div>
    </div>
  );
};

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/student/events');
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await api.post(`/student/register-event/${eventId}`);
      setMessage('Successfully registered for event!');
      fetchEvents();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to register for event');
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>Available Events</h2>
      {message && <div className="success">{message}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {events.length === 0 ? (
          <div className="card">
            <p>No events available at the moment.</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event._id} className="card">
              <h3>{event.name}</h3>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {event.time}</p>
              <p><strong>Venue:</strong> {event.venue}</p>
              <p><strong>Description:</strong> {event.description}</p>
              <p><strong>Club:</strong> {event.club?.name || 'N/A'}</p>
              <button
                onClick={() => handleRegister(event._id)}
                className="btn btn-primary"
                style={{ marginTop: '10px' }}
              >
                Register for Event
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const response = await api.get('/student/my-events');
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
      <h2>My Registered Events</h2>
      <div className="card">
        {events.length === 0 ? (
          <p>You haven't registered for any events yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Venue</th>
                <th>Club</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td>{event.name}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.time}</td>
                  <td>{event.venue}</td>
                  <td>{event.club?.name || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const ViewClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await api.get('/student/clubs');
      setClubs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clubs:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>Clubs</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {clubs.length === 0 ? (
          <div className="card">
            <p>No clubs available.</p>
          </div>
        ) : (
          clubs.map((club) => (
            <div key={club._id} className="card">
              <h3>{club.name}</h3>
              <p>{club.description}</p>
              <p><strong>Coordinator:</strong> {club.coordinator?.name || 'Not assigned'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const navItems = [
    { label: 'Home', path: '/student' },
    { label: 'Events', path: '/student/events' },
    { label: 'My Events', path: '/student/my-events' },
    { label: 'Clubs', path: '/student/clubs' }
  ];

  return (
    <>
      <Navbar role="student" navItems={navItems} />
      <Routes>
        <Route path="/" element={<StudentHome />} />
        <Route path="/events" element={<ViewEvents />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/clubs" element={<ViewClubs />} />
      </Routes>
    </>
  );
};

export default StudentDashboard;
