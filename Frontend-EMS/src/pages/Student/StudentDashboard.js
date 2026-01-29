import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import EventCard from '../../components/EventCard';
import EventDetail from './EventDetail';
import ReviewForm from '../../components/ReviewForm';
import FeedbackForm from '../../components/FeedbackForm';
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
  const [reviewingEventId, setReviewingEventId] = useState(null);
  const [feedbackingEventId, setFeedbackingEventId] = useState(null);

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

  const isPastEvent = (eventDate) => {
    return new Date(eventDate) < new Date();
  };

  const hasUserReviewed = (event, userId) => {
    return event.reviews && event.reviews.some(review =>
      review.student === userId || review.student._id === userId
    );
  };

  const handleReviewSubmitted = () => {
    setReviewingEventId(null);
    fetchMyEvents(); // Refresh events to show new review
  };

  const handleFeedbackSubmitted = () => {
    setFeedbackingEventId(null);
    fetchMyEvents(); // Refresh events
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
          <div style={{
            display: 'grid',
            gap: 'var(--space-xl)'
          }}>
            {events.map((event) => {
              const eventPassed = isPastEvent(event.date);
              const userReviewed = hasUserReviewed(event, localStorage.getItem('userId'));

              return (
                <div key={event._id} className="card" style={{
                  padding: 'var(--space-xl)',
                  border: eventPassed ? '2px solid #48bb78' : '2px solid var(--primary-gradient-start)'
                }}>
                  {/* Event Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 'var(--space-lg)',
                    flexWrap: 'wrap',
                    gap: 'var(--space-md)'
                  }}>
                    <div style={{ flex: '1', minWidth: '250px' }}>
                      <h3 style={{
                        fontSize: '1.5rem',
                        marginBottom: 'var(--space-sm)',
                        color: '#2d3748'
                      }}>
                        {event.name}
                      </h3>
                      <p style={{
                        color: '#718096',
                        lineHeight: '1.6',
                        marginBottom: 'var(--space-md)'
                      }}>
                        {event.description}
                      </p>
                    </div>
                    <div>
                      {eventPassed ? (
                        <span style={{
                          padding: '8px 16px',
                          borderRadius: '20px',
                          backgroundColor: '#c6f6d5',
                          color: '#22543d',
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          display: 'inline-block'
                        }}>
                          ✓ Completed
                        </span>
                      ) : (
                        <span style={{
                          padding: '8px 16px',
                          borderRadius: '20px',
                          backgroundColor: '#bee3f8',
                          color: '#2c5282',
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          display: 'inline-block'
                        }}>
                          ⏳ Upcoming
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Event Details Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'var(--space-md)',
                    marginBottom: 'var(--space-lg)',
                    padding: 'var(--space-md)',
                    backgroundColor: '#f7fafc',
                    borderRadius: '12px'
                  }}>
                    <div>
                      <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '4px' }}>📅 Date</p>
                      <p style={{ fontWeight: '600', color: '#2d3748' }}>
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '4px' }}>🕐 Time</p>
                      <p style={{ fontWeight: '600', color: '#2d3748' }}>{event.time}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '4px' }}>📍 Venue</p>
                      <p style={{ fontWeight: '600', color: '#2d3748' }}>{event.venue}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '4px' }}>🎭 Club</p>
                      <p style={{ fontWeight: '600', color: '#2d3748' }}>{event.club?.name || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Reviews & Feedback Section */}
                  {eventPassed && (
                    <div style={{ marginTop: 'var(--space-lg)' }}>
                      {/* Action Buttons Container */}
                      <div style={{
                        display: 'flex',
                        gap: 'var(--space-md)',
                        flexWrap: 'wrap',
                        marginBottom: reviewingEventId === event._id || feedbackingEventId === event._id ? 'var(--space-md)' : '0'
                      }}>
                        {/* Review Button */}
                        {!userReviewed && reviewingEventId !== event._id && feedbackingEventId !== event._id && (
                          <button
                            onClick={() => setReviewingEventId(event._id)}
                            className="btn-primary"
                            style={{
                              padding: '12px 24px',
                              borderRadius: '10px',
                              fontSize: '1rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                          >
                            <span>⭐</span> Write a Review
                          </button>
                        )}

                        {/* Feedback Button */}
                        {!event.userHasFeedback && feedbackingEventId !== event._id && reviewingEventId !== event._id && (
                          <button
                            onClick={() => setFeedbackingEventId(event._id)}
                            style={{
                              padding: '12px 24px',
                              borderRadius: '10px',
                              fontSize: '1rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              background: 'linear-gradient(135deg, #48bb78, #38a169)',
                              color: 'white',
                              border: 'none',
                              cursor: 'pointer',
                              fontWeight: '600',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 4px 6px rgba(72, 187, 120, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 6px 12px rgba(72, 187, 120, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 4px 6px rgba(72, 187, 120, 0.3)';
                            }}
                          >
                            <span>📝</span> Submit Feedback
                          </button>
                        )}

                        {/* Show badges if already submitted */}
                        {userReviewed && reviewingEventId !== event._id && (
                          <span style={{
                            padding: '12px 20px',
                            borderRadius: '10px',
                            fontSize: '0.95rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#c6f6d5',
                            color: '#22543d',
                            fontWeight: '600'
                          }}>
                            <span>✓</span> Review Submitted
                          </span>
                        )}

                        {event.userHasFeedback && feedbackingEventId !== event._id && (
                          <span style={{
                            padding: '12px 20px',
                            borderRadius: '10px',
                            fontSize: '0.95rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#c6f6d5',
                            color: '#22543d',
                            fontWeight: '600'
                          }}>
                            <span>✓</span> Feedback Submitted
                          </span>
                        )}
                      </div>

                      {/* Review Form */}
                      {reviewingEventId === event._id && (
                        <ReviewForm
                          eventId={event._id}
                          onReviewSubmitted={handleReviewSubmitted}
                          onCancel={() => setReviewingEventId(null)}
                        />
                      )}

                      {/* Feedback Form */}
                      {feedbackingEventId === event._id && (
                        <FeedbackForm
                          eventId={event._id}
                          onFeedbackSubmitted={handleFeedbackSubmitted}
                          onCancel={() => setFeedbackingEventId(null)}
                        />
                      )}

                      {/* Display Existing Reviews */}
                      {event.reviews && event.reviews.length > 0 && (
                        <div style={{ marginTop: 'var(--space-xl)' }}>
                          <h4 style={{
                            marginBottom: 'var(--space-lg)',
                            color: '#2d3748',
                            fontSize: '1.2rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span>💬</span> Reviews ({event.reviews.length})
                          </h4>

                          <div style={{
                            display: 'grid',
                            gap: 'var(--space-md)'
                          }}>
                            {event.reviews.map((review, index) => (
                              <div key={index} style={{
                                padding: 'var(--space-lg)',
                                backgroundColor: '#f7fafc',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0'
                              }}>
                                <div style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  marginBottom: 'var(--space-sm)'
                                }}>
                                  <p style={{
                                    fontWeight: '600',
                                    color: '#2d3748',
                                    fontSize: '1rem'
                                  }}>
                                    {review.studentName}
                                  </p>
                                  <div style={{
                                    display: 'flex',
                                    gap: '4px',
                                    fontSize: '1.1rem'
                                  }}>
                                    {[...Array(5)].map((_, i) => (
                                      <span key={i}>
                                        {i < review.rating ? '⭐' : '☆'}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <p style={{
                                  color: '#4a5568',
                                  lineHeight: '1.6',
                                  marginTop: 'var(--space-sm)'
                                }}>
                                  {review.comment}
                                </p>
                                <p style={{
                                  fontSize: '0.85rem',
                                  color: '#a0aec0',
                                  marginTop: 'var(--space-sm)'
                                }}>
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
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
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', marginBottom: 'var(--space-xs)' }}>
                  👥 Coordinators:
                </p>
                {club.coordinators && club.coordinators.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                    {club.coordinators.map((coordinator, index) => (
                      <p key={coordinator._id || index} style={{ margin: 0, fontSize: '0.85rem', paddingLeft: 'var(--space-sm)' }}>
                        • {coordinator.name}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)', paddingLeft: 'var(--space-sm)' }}>
                    No coordinators assigned
                  </p>
                )}
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
