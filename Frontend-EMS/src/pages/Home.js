import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, clubsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/public/events'),
        axios.get('http://localhost:5000/api/public/clubs')
      ]);
      setEvents(eventsRes.data);
      setClubs(clubsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div>
      {/* Header/Navbar */}
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="navbar-brand">
            Event Management System
          </Link>
          <ul className="navbar-nav">
            <li>
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="btn btn-secondary">
                Register as Student
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '60px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Welcome to Event Management System</h1>
          <p style={{ fontSize: '20px', marginBottom: '30px' }}>
            Discover exciting events and vibrant clubs at our campus
          </p>
          <Link to="/login" className="btn btn-primary" style={{ fontSize: '18px', padding: '15px 30px' }}>
            Get Started
          </Link>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="container" style={{ marginTop: '40px' }}>
        <h2 style={{ marginBottom: '30px', fontSize: '32px' }}>Upcoming Events</h2>
        {events.length === 0 ? (
          <div className="card">
            <p style={{ textAlign: 'center', fontSize: '18px' }}>No upcoming events at the moment. Check back soon!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '25px',
            marginBottom: '50px'
          }}>
            {events.slice(0, 6).map((event) => (
              <div key={event._id} className="card" style={{
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}>
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.name}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px 8px 0 0',
                      marginBottom: '15px'
                    }}
                  />
                )}
                <h3 style={{ color: '#667eea', marginBottom: '10px' }}>{event.name}</h3>
                <p style={{ marginBottom: '10px', color: '#666' }}>
                  {event.description.substring(0, 100)}...
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <p><strong>📅 Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                  <p><strong>🕐 Time:</strong> {event.time}</p>
                </div>
                <p><strong>📍 Venue:</strong> {event.venue}</p>
                {event.club && (
                  <p style={{
                    marginTop: '10px',
                    padding: '8px 12px',
                    background: '#f0f0f0',
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}>
                    <strong>Club:</strong> {event.club.name}
                  </p>
                )}
                <Link to="/login" className="btn btn-primary" style={{ marginTop: '15px', width: '100%' }}>
                  Login to Register
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clubs Section */}
      <div className="container" style={{ marginBottom: '50px' }}>
        <h2 style={{ marginBottom: '30px', fontSize: '32px' }}>Our Clubs</h2>
        {clubs.length === 0 ? (
          <div className="card">
            <p style={{ textAlign: 'center', fontSize: '18px' }}>No clubs available yet.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '25px'
          }}>
            {clubs.map((club) => (
              <div key={club._id} className="card" style={{
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                border: 'none'
              }}>
                {club.image && (
                  <img
                    src={club.image}
                    alt={club.name}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '15px'
                    }}
                  />
                )}
                <h3 style={{ color: '#764ba2', marginBottom: '10px' }}>{club.name}</h3>
                <p style={{ marginBottom: '15px', color: '#333' }}>{club.description}</p>
                {club.coordinator && (
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    <strong>Coordinator:</strong> {club.coordinator.name}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        background: '#343a40',
        color: 'white',
        padding: '30px 0',
        textAlign: 'center',
        marginTop: '50px'
      }}>
        <div className="container">
          <p style={{ margin: 0 }}>© 2025 Event Management System. All rights reserved.</p>
          <p style={{ marginTop: '10px', fontSize: '14px' }}>
            <Link to="/login" style={{ color: '#667eea', textDecoration: 'none', marginRight: '20px' }}>
              Login
            </Link>
            <Link to="/register" style={{ color: '#667eea', textDecoration: 'none' }}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
