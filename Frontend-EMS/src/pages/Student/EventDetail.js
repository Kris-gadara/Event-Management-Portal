import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../components/Toast';
import api from '../../utils/api';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Mail, 
  Theater, 
  Loader2, 
  Frown, 
  CheckCircle2, 
  Ticket,
  Sparkles,
  Target,
  Star,
  Image,
  Award
} from 'lucide-react';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/student/events`);
        const eventData = response.data.find(e => e._id === id);

        if (eventData) {
          setEvent(eventData);
          const registeredResponse = await api.get('/student/my-events');
          const isAlreadyRegistered = registeredResponse.data.some(e => e._id === id);
          setIsRegistered(isAlreadyRegistered);
        }
      } catch (error) {
        showError('Failed to load event details');
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, showError]);

  const handleRegister = async () => {
    if (isRegistered) return;

    setRegistering(true);
    try {
      const response = await api.post(`/student/register-event/${event._id}`);
      showSuccess(response.data.message || 'Successfully registered for the event!');
      setIsRegistered(true);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to register for event');
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap');
    
    .event-detail {
      min-height: 100vh;
      background: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 50%, #f0fdf4 100%);
      padding: 32px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border: 2px solid #1e40af;
      background: white;
      color: #1e40af;
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 32px;
    }
    
    .back-btn:hover {
      background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
      color: white;
      border-color: transparent;
    }
    
    .hero-image {
      width: 100%;
      height: 400px;
      border-radius: 24px;
      overflow: hidden;
      position: relative;
      box-shadow: 0 20px 60px rgba(30, 64, 175, 0.15);
      margin-bottom: 32px;
    }
    
    .hero-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .status-badge {
      position: absolute;
      top: 20px;
      right: 20px;
      padding: 12px 28px;
      border-radius: 30px;
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: white;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);
    }
    
    .event-title {
      font-family: 'Outfit', sans-serif;
      font-size: 2.8rem;
      font-weight: 800;
      background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1.2;
      margin: 0 0 20px 0;
    }
    
    .event-description {
      font-family: 'DM Sans', sans-serif;
      font-size: 1.15rem;
      line-height: 1.8;
      color: #64748b;
      margin-bottom: 32px;
    }
    
    .register-section {
      padding: 32px;
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.05) 0%, rgba(14, 165, 233, 0.05) 100%);
      border-radius: 20px;
      border: 2px solid rgba(30, 64, 175, 0.15);
      margin-bottom: 32px;
    }
    
    .register-btn {
      width: 100%;
      padding: 18px;
      font-family: 'DM Sans', sans-serif;
      font-size: 1.15rem;
      font-weight: 700;
      border-radius: 14px;
      border: none;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    
    .register-btn.available {
      background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
      box-shadow: 0 8px 25px rgba(30, 64, 175, 0.35);
    }
    
    .register-btn.available:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(30, 64, 175, 0.45);
    }
    
    .register-btn.registered {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      cursor: default;
    }
    
    .register-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .register-success {
      text-align: center;
      margin-top: 12px;
      color: #22c55e;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 0.95rem;
    }
    
    .details-card {
      background: white;
      border-radius: 24px;
      padding: 32px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(30, 64, 175, 0.08);
      margin-bottom: 32px;
    }
    
    .details-card h2 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 24px 0;
    }
    
    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 28px;
    }
    
    .detail-item {
      display: flex;
      gap: 16px;
    }
    
    .detail-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .detail-icon.blue {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
    }
    
    .detail-icon.sky {
      background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
    }
    
    .detail-icon.indigo {
      background: linear-gradient(135deg, #4f46e5 0%, #818cf8 100%);
    }
    
    .detail-icon.purple {
      background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%);
    }
    
    .detail-content h4 {
      font-family: 'DM Sans', sans-serif;
      font-weight: 700;
      color: #1e293b;
      font-size: 1.05rem;
      margin: 0 0 6px 0;
    }
    
    .detail-content p {
      font-family: 'DM Sans', sans-serif;
      color: #64748b;
      font-size: 0.95rem;
      margin: 0;
      line-height: 1.5;
    }
    
    .detail-content a {
      color: #1e40af;
      text-decoration: none;
      font-weight: 500;
    }
    
    .detail-content a:hover {
      text-decoration: underline;
    }
    
    .highlights-section {
      margin-top: 48px;
    }
    
    .highlights-title {
      font-family: 'Outfit', sans-serif;
      font-size: 2rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: #1e293b;
    }
    
    .highlight-block {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 32px;
      padding: 32px;
      border-radius: 24px;
      margin-bottom: 32px;
      align-items: center;
    }
    
    .highlight-block.blue {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.04) 0%, rgba(14, 165, 233, 0.04) 100%);
      border: 1px solid rgba(30, 64, 175, 0.1);
    }
    
    .highlight-block.green {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.04) 0%, rgba(22, 163, 74, 0.04) 100%);
      border: 1px solid rgba(34, 197, 94, 0.15);
    }
    
    .highlight-block.orange {
      background: linear-gradient(135deg, rgba(249, 115, 22, 0.04) 0%, rgba(234, 88, 12, 0.04) 100%);
      border: 1px solid rgba(249, 115, 22, 0.15);
    }
    
    .highlight-text h3 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 16px 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .highlight-text p {
      font-family: 'DM Sans', sans-serif;
      font-size: 1.05rem;
      line-height: 1.9;
      color: #64748b;
      white-space: pre-wrap;
      margin: 0;
    }
    
    .highlight-image {
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
    }
    
    .highlight-image img {
      width: 100%;
      height: 300px;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    
    .highlight-image:hover img {
      transform: scale(1.03);
    }
    
    .reviews-section {
      margin-top: 48px;
      padding: 32px;
      background: linear-gradient(135deg, rgba(249, 115, 22, 0.04) 0%, rgba(234, 88, 12, 0.04) 100%);
      border-radius: 24px;
      border: 2px solid rgba(249, 115, 22, 0.12);
    }
    
    .reviews-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.8rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 28px 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .reviews-grid {
      display: grid;
      gap: 20px;
    }
    
    .review-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      transition: all 0.3s ease;
    }
    
    .review-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    }
    
    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
      flex-wrap: wrap;
      gap: 12px;
    }
    
    .reviewer-name {
      font-family: 'DM Sans', sans-serif;
      font-weight: 700;
      font-size: 1.1rem;
      color: #1e293b;
      margin: 0 0 4px 0;
    }
    
    .review-date {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.85rem;
      color: #94a3b8;
    }
    
    .review-stars {
      display: flex;
      gap: 4px;
    }
    
    .review-comment {
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      line-height: 1.7;
      color: #64748b;
      padding-top: 16px;
      border-top: 1px solid #f1f5f9;
      margin: 0;
    }
    
    .average-rating {
      margin-top: 28px;
      padding: 24px;
      background: linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 88, 12, 0.1) 100%);
      border-radius: 16px;
      text-align: center;
    }
    
    .average-number {
      font-family: 'Outfit', sans-serif;
      font-size: 2.5rem;
      font-weight: 800;
      color: #f97316;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    
    .average-text {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.95rem;
      color: #64748b;
    }
    
    .bottom-cta {
      margin-top: 48px;
      padding: 40px;
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.06) 0%, rgba(14, 165, 233, 0.06) 100%);
      border-radius: 24px;
      text-align: center;
    }
    
    .bottom-cta h3 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.8rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 20px 0;
    }
    
    .bottom-register-btn {
      padding: 18px 56px;
      font-family: 'DM Sans', sans-serif;
      font-size: 1.1rem;
      font-weight: 700;
      border-radius: 14px;
      border: none;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }
    
    .bottom-register-btn.available {
      background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
      box-shadow: 0 8px 25px rgba(30, 64, 175, 0.35);
    }
    
    .bottom-register-btn.available:hover {
      transform: scale(1.05);
      box-shadow: 0 12px 35px rgba(30, 64, 175, 0.45);
    }
    
    .bottom-register-btn.registered {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      cursor: default;
    }
    
    .loading-state {
      min-height: 60vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }
    
    .loading-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .spin {
      animation: spin 1s linear infinite;
    }
    
    .loading-state p {
      font-family: 'DM Sans', sans-serif;
      color: #64748b;
      font-size: 1.2rem;
    }
    
    .not-found {
      min-height: 60vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 24px;
    }
    
    .not-found-icon {
      width: 100px;
      height: 100px;
      background: linear-gradient(135deg, #e0e7ff 0%, #bae6fd 100%);
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .not-found h2 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.8rem;
      color: #1e293b;
      margin: 0;
    }
  `;

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="event-detail">
          <div className="loading-state">
            <div className="loading-icon">
              <Loader2 size={40} color="white" className="spin" />
            </div>
            <p>Loading event details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <style>{styles}</style>
        <div className="event-detail">
          <div className="not-found">
            <div className="not-found-icon">
              <Frown size={48} color="#1e40af" />
            </div>
            <h2>Event Not Found</h2>
            <button className="back-btn" onClick={() => navigate('/student/events')}>
              <ArrowLeft size={18} />
              Back to Events
            </button>
          </div>
        </div>
      </>
    );
  }

  const primaryImageUrl = event.primaryImage || event.image || '/placeholder.jpg';
  const additionalImages = event.additionalImages || [];
  const descriptionParts = event.additionalDescriptions || [];

  return (
    <>
      <style>{styles}</style>
      <div className="event-detail">
        <button className="back-btn" onClick={() => navigate('/student/events')}>
          <ArrowLeft size={18} />
          Back to Events
        </button>

        <div className="hero-image">
          <img src={primaryImageUrl} alt={event.name} />
          {event.status === 'approved' && (
            <div className="status-badge">
              <CheckCircle2 size={16} />
              Approved Event
            </div>
          )}
        </div>

        <h1 className="event-title">{event.name}</h1>
        <p className="event-description">{event.description}</p>

        <div className="register-section">
          <button
            className={`register-btn ${isRegistered ? 'registered' : 'available'}`}
            onClick={handleRegister}
            disabled={isRegistered || registering}
          >
            {registering ? (
              <>
                <Loader2 size={22} className="spin" />
                Registering...
              </>
            ) : isRegistered ? (
              <>
                <CheckCircle2 size={22} />
                You're Registered!
              </>
            ) : (
              <>
                <Ticket size={22} />
                Register for this Event
              </>
            )}
          </button>
          {isRegistered && (
            <p className="register-success">
              You've successfully registered for this event!
            </p>
          )}
        </div>

        <div className="details-card">
          <h2>Event Details</h2>
          <div className="details-grid">
            <div className="detail-item">
              <div className="detail-icon blue">
                <Calendar size={24} color="white" />
              </div>
              <div className="detail-content">
                <h4>Date & Time</h4>
                <p>{formatDate(event.date)}</p>
                <p style={{ fontWeight: 600, marginTop: 4 }}>{event.time}</p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon sky">
                <MapPin size={24} color="white" />
              </div>
              <div className="detail-content">
                <h4>Venue</h4>
                <p>{event.venue}</p>
                {event.address && <p style={{ fontSize: '0.875rem', marginTop: 4 }}>{event.address}</p>}
              </div>
            </div>

            {event.contactEmail && (
              <div className="detail-item">
                <div className="detail-icon indigo">
                  <Mail size={24} color="white" />
                </div>
                <div className="detail-content">
                  <h4>Contact</h4>
                  <a href={`mailto:${event.contactEmail}`}>{event.contactEmail}</a>
                </div>
              </div>
            )}

            {event.club && (
              <div className="detail-item">
                <div className="detail-icon purple">
                  <Theater size={24} color="white" />
                </div>
                <div className="detail-content">
                  <h4>Organized By</h4>
                  <p>{event.club.name}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {additionalImages.length > 0 && (
          <div className="highlights-section">
            <h2 className="highlights-title">
              <Image size={28} color="#1e40af" />
              Event Highlights
            </h2>

            {additionalImages[0] && (
              <div className="highlight-block blue">
                <div className="highlight-text">
                  <h3>
                    <Sparkles size={24} color="#1e40af" />
                    {descriptionParts[0] ? 'What to Expect' : 'Event Details'}
                  </h3>
                  <p>{descriptionParts[0] || 'Join us for an amazing event experience with exciting activities and opportunities!'}</p>
                </div>
                <div className="highlight-image">
                  <img src={additionalImages[0]} alt="Event Highlight 1" />
                </div>
              </div>
            )}

            {additionalImages[1] && (
              <div className="highlight-block green" style={{ direction: 'rtl' }}>
                <div className="highlight-image" style={{ direction: 'ltr' }}>
                  <img src={additionalImages[1]} alt="Event Highlight 2" />
                </div>
                <div className="highlight-text" style={{ direction: 'ltr' }}>
                  <h3>
                    <Target size={24} color="#22c55e" />
                    {descriptionParts[1] ? 'Activities & Benefits' : 'More Details'}
                  </h3>
                  <p>{descriptionParts[1] || 'Discover more about what makes this event special and worth attending!'}</p>
                </div>
              </div>
            )}

            {additionalImages[2] && (
              <div className="highlight-block orange">
                <div className="highlight-text">
                  <h3>
                    <Award size={24} color="#f97316" />
                    {descriptionParts[2] ? 'Special Features' : 'Additional Info'}
                  </h3>
                  <p>{descriptionParts[2] || 'Learn more about the unique aspects and highlights of this event!'}</p>
                </div>
                <div className="highlight-image">
                  <img src={additionalImages[2]} alt="Event Highlight 3" />
                </div>
              </div>
            )}
          </div>
        )}

        {event.reviews && event.reviews.length > 0 && (
          <div className="reviews-section">
            <h2 className="reviews-title">
              <Star size={28} color="#f97316" fill="#f97316" />
              Student Reviews ({event.reviews.length})
            </h2>

            <div className="reviews-grid">
              {event.reviews.map((review, index) => (
                <div key={index} className="review-card">
                  <div className="review-header">
                    <div>
                      <h4 className="reviewer-name">{review.studentName}</h4>
                      <p className="review-date">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="review-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          fill={i < review.rating ? '#f97316' : 'none'}
                          color={i < review.rating ? '#f97316' : '#e2e8f0'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>

            {event.reviews.length > 1 && (
              <div className="average-rating">
                <div className="average-number">
                  {(event.reviews.reduce((sum, r) => sum + r.rating, 0) / event.reviews.length).toFixed(1)}
                  <Star size={32} fill="#f97316" color="#f97316" />
                </div>
                <p className="average-text">
                  Average rating from {event.reviews.length} {event.reviews.length === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="bottom-cta">
          <h3>Ready to Join?</h3>
          <button
            className={`bottom-register-btn ${isRegistered ? 'registered' : 'available'}`}
            onClick={handleRegister}
            disabled={isRegistered || registering}
          >
            {registering ? (
              <>
                <Loader2 size={20} className="spin" />
                Registering...
              </>
            ) : isRegistered ? (
              <>
                <CheckCircle2 size={20} />
                Already Registered
              </>
            ) : (
              <>
                <Ticket size={20} />
                Register Now
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default EventDetail;
