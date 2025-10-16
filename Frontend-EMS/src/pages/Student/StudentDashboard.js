import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import EventCard from '../../components/EventCard';
import EventDetail from './EventDetail';
import { useToast } from '../../components/Toast';
import api from '../../utils/api';

const StudentHome = () => {
  return (
    <div className="dashboard">
      <h2>Student Dashboard</h2>
      <div className="section">
        <h3>Welcome, Student! 🎓</h3>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-light)' }}>
          Browse exciting events, register for activities, and explore amazing clubs on campus.
          Make the most of your college experience!
        </p>
        <div className="card-grid" style={{ marginTop: 'var(--space-xl)' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)' }}>🎉</h3>
            <h4>Upcoming Events</h4>
            <p>Discover and register for exciting campus events</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)' }}>📋</h3>
            <h4>My Registrations</h4>
            <p>Track all your registered events</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)' }}>🎭</h3>
            <h4>Explore Clubs</h4>
            <p>Join vibrant student communities</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    fetchMyEvents();
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

  const fetchMyEvents = async () => {
    try {
      const response = await api.get('/student/my-events');
      setRegisteredEvents(response.data.map(e => e._id));
    } catch (error) {
      console.error('Error fetching registered events:', error);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      const response = await api.post(`/student/register-event/${eventId}`);
      showSuccess(response.data.message || 'Successfully registered for event! 🎉');
      fetchMyEvents();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to register for event');
    }
  };

  const handleViewDetails = (eventId) => {
    navigate(`/student/events/${eventId}`);
  };

  const isRegistered = (eventId) => registeredEvents.includes(eventId);

  if (loading) return (
    <div className="dashboard">
      <div className="section" style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>⏳</div>
          <h2>Loading events...</h2>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="section">
        <h2 style={{
          fontSize: '2.5rem',
          background: 'linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 'var(--space-lg)',
          textAlign: 'center'
        }}>
          🎉 Available Events
        </h2>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 'var(--space-xxl)'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '14px 28px',
            borderRadius: '30px',
            marginBottom: "50px",
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.12))',
            border: '2px solid var(--primary-gradient-start)',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.15)'
          }}>
            <p style={{
              fontSize: '1.05rem',
              fontWeight: '600',
              color: 'var(--primary-gradient-start)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>✨</span>
              <span>Discover exciting campus events and register to participate</span>
            </p>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="card" style={{
            textAlign: 'center',
            padding: 'var(--space-xxl)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>📭</div>
            <h3 style={{ marginBottom: 'var(--space-sm)' }}>No Events Available</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Check back soon for exciting upcoming events!
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 'var(--space-xl)'
          }}>
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isRegistered={isRegistered(event._id)}
                onRegister={handleRegister}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
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

  if (loading) return (
    <div className="dashboard">
      <div className="section">
        <h2>Loading your events...</h2>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <h2>My Registered Events 📋</h2>
      <div className="section">
        {events.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
            <h3 style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>📭</h3>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>
              You haven't registered for any events yet.
            </p>
            <p style={{ marginTop: 'var(--space-sm)', color: 'var(--text-light)' }}>
              Check out the available events and register now!
            </p>
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
                  <th>Club</th>
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
                    <td>{event.club?.name || 'N/A'}</td>
                    <td>
                      <span className="badge badge-success">
                        ✓ Registered
                      </span>
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

  if (loading) return (
    <div className="dashboard">
      <div className="section">
        <h2>Loading clubs...</h2>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <h2>Campus Clubs 🎭</h2>
      <div className="card-grid">
        {clubs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-light)' }}>No clubs available.</p>
          </div>
        ) : (
          clubs.map((club) => (
            <div key={club._id} className="card">
              {club.image && (
                <img
                  src={club.image}
                  alt={club.name}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--space-md)'
                  }}
                />
              )}
              <h3 style={{
                marginBottom: 'var(--space-sm)',
                background: 'var(--secondary-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {club.name}
              </h3>
              <p style={{
                marginBottom: 'var(--space-md)',
                color: 'var(--text-light)',
                lineHeight: '1.6'
              }}>
                {club.description}
              </p>
              <div style={{
                padding: 'var(--space-md)',
                background: 'var(--bg-light)',
                borderRadius: 'var(--radius-sm)',
                marginTop: 'auto'
              }}>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  <strong>👤 Coordinator:</strong> {club.coordinator?.name || 'Not assigned'}
                </p>
              </div>
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
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/clubs" element={<ViewClubs />} />
      </Routes>
    </>
  );
};

export default StudentDashboard;
