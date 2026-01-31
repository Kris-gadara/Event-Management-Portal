import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import EventCard from '../../components/EventCard';
import EventDetail from './EventDetail';
import ReviewForm from '../../components/ReviewForm';
import FeedbackForm from '../../components/FeedbackForm';
import { useToast } from '../../components/Toast';
import api from '../../utils/api';
import { GraduationCap, Calendar, ClipboardList, Users, PartyPopper, Loader2, MailX, Star, MessageSquare, Clock, MapPin, CheckCircle2, Send, Sparkles } from 'lucide-react';

const StudentHome = () => {
  return (
    <div className="student-dashboard">
      <div className="dashboard-container">
        <div className="welcome-section">
          <div className="welcome-icon">
            <GraduationCap size={32} />
          </div>
          <h1>Student Dashboard</h1>
          <p>Browse exciting events, register for activities, and explore amazing clubs on campus. Make the most of your college experience!</p>
        </div>
        
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon purple">
              <PartyPopper size={24} />
            </div>
            <div className="stat-content">
              <h3>Upcoming Events</h3>
              <p>Discover and register for exciting campus events</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">
              <ClipboardList size={24} />
            </div>
            <div className="stat-content">
              <h3>My Registrations</h3>
              <p>Track all your registered events</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon cyan">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <h3>Explore Clubs</h3>
              <p>Join vibrant student communities</p>
            </div>
          </div>
        </div>
      </div>
      
      <style>{studentHomeStyles}</style>
    </div>
  );
};

const studentHomeStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
  
  .student-dashboard {
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
  
  .stat-icon.cyan {
    background: linear-gradient(135deg, #0891b2 0%, #14b8a6 100%);
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
      showSuccess(response.data.message || 'Successfully registered for event!');
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
    <div className="student-dashboard">
      <div className="loading-state">
        <div className="loading-icon">
          <Loader2 size={32} className="spin" />
        </div>
        <h2>Loading events...</h2>
      </div>
      <style>{viewEventsStyles}</style>
    </div>
  );

  return (
    <div className="student-dashboard">
      <div className="dashboard-container">
        <div className="page-header">
          <div className="header-icon">
            <PartyPopper size={28} />
          </div>
          <h1>Available Events</h1>
          <div className="header-badge">
            <Sparkles size={16} />
            <span>Discover exciting campus events and register to participate</span>
          </div>
        </div>
        
        {events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <MailX size={48} />
            </div>
            <h3>No Events Available</h3>
            <p>Check back soon for exciting upcoming events!</p>
          </div>
        ) : (
          <div className="events-grid">
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
      
      <style>{viewEventsStyles}</style>
    </div>
  );
};

const viewEventsStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
  
  .student-dashboard {
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
    margin-bottom: 16px;
    font-family: 'Outfit', sans-serif;
  }
  
  .header-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    background: white;
    border-radius: 50px;
    border: 2px solid #bae6fd;
    color: #0369a1;
    font-weight: 600;
    box-shadow: 0 4px 16px rgba(30, 64, 175, 0.1);
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
  
  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 28px;
  }
`;

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
    fetchMyEvents();
  };

  const handleFeedbackSubmitted = () => {
    setFeedbackingEventId(null);
    fetchMyEvents();
  };

  if (loading) return (
    <div className="student-dashboard">
      <div className="loading-state">
        <div className="loading-icon">
          <Loader2 size={32} className="spin" />
        </div>
        <h2>Loading your events...</h2>
      </div>
      <style>{myEventsStyles}</style>
    </div>
  );

  return (
    <div className="student-dashboard">
      <div className="dashboard-container">
        <div className="page-header">
          <div className="header-icon">
            <ClipboardList size={28} />
          </div>
          <h1>My Registered Events</h1>
        </div>
        
        {events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <MailX size={48} />
            </div>
            <h3>No Registered Events</h3>
            <p>You haven't registered for any events yet. Check out the available events and register now!</p>
          </div>
        ) : (
          <div className="my-events-list">
            {events.map((event) => {
              const eventPassed = isPastEvent(event.date);
              const userReviewed = hasUserReviewed(event, localStorage.getItem('userId'));

              return (
                <div key={event._id} className={`event-card-full ${eventPassed ? 'completed' : 'upcoming'}`}>
                  <div className="event-card-header">
                    <div className="event-info">
                      <h3>{event.name}</h3>
                      <p className="event-description">{event.description}</p>
                    </div>
                    <div className={`status-badge ${eventPassed ? 'completed' : 'upcoming'}`}>
                      {eventPassed ? (
                        <>
                          <CheckCircle2 size={16} />
                          <span>Completed</span>
                        </>
                      ) : (
                        <>
                          <Clock size={16} />
                          <span>Upcoming</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="event-details-grid">
                    <div className="detail-item">
                      <Calendar size={18} />
                      <div>
                        <span className="detail-label">Date</span>
                        <span className="detail-value">{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <Clock size={18} />
                      <div>
                        <span className="detail-label">Time</span>
                        <span className="detail-value">{event.time}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <MapPin size={18} />
                      <div>
                        <span className="detail-label">Venue</span>
                        <span className="detail-value">{event.venue}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <Users size={18} />
                      <div>
                        <span className="detail-label">Club</span>
                        <span className="detail-value">{event.club?.name || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {eventPassed && (
                    <div className="event-actions-section">
                      <div className="action-buttons">
                        {!userReviewed && reviewingEventId !== event._id && feedbackingEventId !== event._id && (
                          <button onClick={() => setReviewingEventId(event._id)} className="btn-review">
                            <Star size={18} />
                            <span>Write Review</span>
                          </button>
                        )}
                        
                        {!event.userHasFeedback && feedbackingEventId !== event._id && reviewingEventId !== event._id && (
                          <button onClick={() => setFeedbackingEventId(event._id)} className="btn-feedback">
                            <Send size={18} />
                            <span>Submit Feedback</span>
                          </button>
                        )}
                        
                        {userReviewed && reviewingEventId !== event._id && (
                          <span className="completed-badge">
                            <CheckCircle2 size={16} />
                            <span>Review Submitted</span>
                          </span>
                        )}
                        
                        {event.userHasFeedback && feedbackingEventId !== event._id && (
                          <span className="completed-badge">
                            <CheckCircle2 size={16} />
                            <span>Feedback Submitted</span>
                          </span>
                        )}
                      </div>
                      
                      {reviewingEventId === event._id && (
                        <ReviewForm
                          eventId={event._id}
                          onReviewSubmitted={handleReviewSubmitted}
                          onCancel={() => setReviewingEventId(null)}
                        />
                      )}
                      
                      {feedbackingEventId === event._id && (
                        <FeedbackForm
                          eventId={event._id}
                          onFeedbackSubmitted={handleFeedbackSubmitted}
                          onCancel={() => setFeedbackingEventId(null)}
                        />
                      )}
                      
                      {event.reviews && event.reviews.length > 0 && (
                        <div className="reviews-section">
                          <h4>
                            <MessageSquare size={18} />
                            <span>Reviews ({event.reviews.length})</span>
                          </h4>
                          <div className="reviews-list">
                            {event.reviews.map((review, index) => (
                              <div key={index} className="review-item">
                                <div className="review-header">
                                  <span className="reviewer-name">{review.studentName}</span>
                                  <div className="star-rating">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        size={14}
                                        fill={i < review.rating ? '#f59e0b' : 'none'}
                                        stroke={i < review.rating ? '#f59e0b' : '#cbd5e1'}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="review-comment">{review.comment}</p>
                                <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
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
      
      <style>{myEventsStyles}</style>
    </div>
  );
};

const myEventsStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
  
  .student-dashboard {
    min-height: calc(100vh - 70px);
    background: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 50%, #f0fdf4 100%);
    padding: 40px 24px;
    font-family: 'DM Sans', -apple-system, sans-serif;
  }
  
  .dashboard-container {
    max-width: 1000px;
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
  
  .my-events-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .event-card-full {
    background: white;
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    border: 2px solid transparent;
    transition: all 0.3s ease;
  }
  
  .event-card-full.completed {
    border-color: #22c55e;
  }
  
  .event-card-full.upcoming {
    border-color: #0ea5e9;
  }
  
  .event-card-full:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(30, 64, 175, 0.1);
  }
  
  .event-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  
  .event-info h3 {
    font-size: 22px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 8px;
    font-family: 'Outfit', sans-serif;
  }
  
  .event-description {
    color: #64748b;
    line-height: 1.6;
    font-size: 15px;
  }
  
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 600;
    flex-shrink: 0;
  }
  
  .status-badge.completed {
    background: #dcfce7;
    color: #166534;
  }
  
  .status-badge.upcoming {
    background: #e0f2fe;
    color: #0369a1;
  }
  
  .event-details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    padding: 20px;
    background: #f8fafc;
    border-radius: 16px;
  }
  
  .detail-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  
  .detail-item svg {
    color: #0ea5e9;
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  .detail-label {
    display: block;
    font-size: 12px;
    color: #64748b;
    margin-bottom: 2px;
  }
  
  .detail-value {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #0f172a;
  }
  
  .event-actions-section {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #e2e8f0;
  }
  
  .action-buttons {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
  
  .btn-review {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.25);
  }
  
  .btn-review:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(30, 64, 175, 0.35);
  }
  
  .btn-feedback {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: linear-gradient(135deg, #22c55e 0%, #10b981 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.25);
  }
  
  .btn-feedback:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(34, 197, 94, 0.35);
  }
  
  .completed-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 12px 20px;
    background: #dcfce7;
    color: #166534;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
  }
  
  .reviews-section {
    margin-top: 24px;
  }
  
  .reviews-section h4 {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 16px;
    font-family: 'Outfit', sans-serif;
  }
  
  .reviews-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .review-item {
    padding: 20px;
    background: #f8fafc;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
  }
  
  .review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .reviewer-name {
    font-weight: 600;
    color: #0f172a;
  }
  
  .star-rating {
    display: flex;
    gap: 2px;
  }
  
  .review-comment {
    color: #475569;
    line-height: 1.6;
    margin-bottom: 8px;
  }
  
  .review-date {
    font-size: 12px;
    color: #94a3b8;
  }
`;

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
    <div className="student-dashboard">
      <div className="loading-state">
        <div className="loading-icon">
          <Loader2 size={32} className="spin" />
        </div>
        <h2>Loading clubs...</h2>
      </div>
      <style>{viewClubsStyles}</style>
    </div>
  );

  return (
    <div className="student-dashboard">
      <div className="dashboard-container">
        <div className="page-header">
          <div className="header-icon">
            <Users size={28} />
          </div>
          <h1>Campus Clubs</h1>
        </div>
        
        {clubs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Users size={48} />
            </div>
            <h3>No Clubs Available</h3>
            <p>Check back soon for exciting student clubs!</p>
          </div>
        ) : (
          <div className="clubs-grid">
            {clubs.map((club) => (
              <div key={club._id} className="club-card">
                {club.image && (
                  <div className="club-image">
                    <img src={club.image} alt={club.name} />
                  </div>
                )}
                <div className="club-content">
                  <h3>{club.name}</h3>
                  <p className="club-description">{club.description}</p>
                  <div className="coordinators-section">
                    <div className="coordinators-label">
                      <Users size={16} />
                      <span>Coordinators</span>
                    </div>
                    {club.coordinators && club.coordinators.length > 0 ? (
                      <div className="coordinators-list">
                        {club.coordinators.map((coordinator, index) => (
                          <span key={coordinator._id || index} className="coordinator-name">
                            {coordinator.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="no-coordinators">No coordinators assigned</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <style>{viewClubsStyles}</style>
    </div>
  );
};

const viewClubsStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
  
  .student-dashboard {
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
  
  .clubs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 28px;
  }
  
  .club-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;
  }
  
  .club-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(30, 64, 175, 0.12);
  }
  
  .club-image {
    height: 160px;
    overflow: hidden;
  }
  
  .club-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .club-card:hover .club-image img {
    transform: scale(1.05);
  }
  
  .club-content {
    padding: 24px;
  }
  
  .club-content h3 {
    font-size: 20px;
    font-weight: 700;
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 12px;
    font-family: 'Outfit', sans-serif;
  }
  
  .club-description {
    color: #64748b;
    line-height: 1.6;
    font-size: 14px;
    margin-bottom: 20px;
  }
  
  .coordinators-section {
    padding: 16px;
    background: #f8fafc;
    border-radius: 12px;
  }
  
  .coordinators-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 10px;
  }
  
  .coordinators-label svg {
    color: #0ea5e9;
  }
  
  .coordinators-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .coordinator-name {
    font-size: 13px;
    color: #64748b;
    padding-left: 8px;
  }
  
  .coordinator-name::before {
    content: '• ';
    color: #0ea5e9;
  }
  
  .no-coordinators {
    font-size: 13px;
    color: #94a3b8;
    padding-left: 8px;
  }
`;

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
