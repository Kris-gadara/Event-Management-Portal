import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../components/Toast';
import api from '../../utils/api';

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
          // Check if already registered
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

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>⏳</div>
          Loading event details...
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 'var(--space-lg)'
      }}>
        <div style={{ fontSize: '4rem' }}>😞</div>
        <h2>Event Not Found</h2>
        <button onClick={() => navigate('/student/events')} className="btn-primary">
          ← Back to Events
        </button>
      </div>
    );
  }

  // Handle image URLs
  const primaryImageUrl = event.primaryImage || event.image || '/placeholder.jpg';
  const additionalImages = event.additionalImages || [];

  // Handle descriptions
  const descriptionParts = event.additionalDescriptions || [];

  return (
    <div style={{ paddingBottom: 'var(--space-xxl)', paddingTop: 'var(--space-xl)', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/student/events')}
        style={{
          marginBottom: 'var(--space-xl)',
          marginTop: 'var(--space-md)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-xs)',
          padding: '10px 20px',
          borderRadius: '8px',
          border: '2px solid var(--primary-gradient-start)',
          background: 'white',
          color: 'var(--primary-gradient-start)',
          fontSize: '0.95rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--primary-gradient-start)';
          e.currentTarget.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.color = 'var(--primary-gradient-start)';
        }}
      >
        ← Back to Events
      </button>

      {/* Primary Image - Full Width */}
      <div style={{
        width: '100%',
        height: '400px',
        borderRadius: '20px',
        overflow: 'hidden',
        marginBottom: 'var(--space-xl)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
        position: 'relative'
      }}>
        <img
          src={primaryImageUrl}
          alt={event.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        {/* Status Badge on Image */}
        {event.status === 'approved' && (
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '10px 24px',
            borderRadius: '30px',
            background: 'linear-gradient(135deg, #38b2ac, #2c7a7b)',
            color: 'white',
            fontSize: '0.85rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 4px 12px rgba(56, 178, 172, 0.4)'
          }}>
            ✓ Approved Event
          </div>
        )}
      </div>

      {/* Event Title & Quick Info */}
      <div style={{ marginBottom: 'var(--space-xxl)' }}>
        <h1 style={{
          fontSize: '2.8rem',
          marginBottom: 'var(--space-lg)',
          background: 'linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: '800',
          lineHeight: '1.2'
        }}>
          {event.name}
        </h1>

        {/* Main Description */}
        <p style={{
          fontSize: '1.15rem',
          lineHeight: '1.8',
          color: '#4a5568',
          marginBottom: 'var(--space-xl)'
        }}>
          {event.description}
        </p>
      </div>

      {/* Register Button - Prominent Position */}
      <div style={{
        marginBottom: 'var(--space-xxl)',
        padding: 'var(--space-xl)',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08))',
        borderRadius: '16px',
        border: '2px solid rgba(102, 126, 234, 0.2)'
      }}>
        <button
          onClick={handleRegister}
          disabled={isRegistered || registering}
          style={{
            width: '100%',
            padding: '18px',
            fontSize: '1.15rem',
            fontWeight: '700',
            borderRadius: '12px',
            border: 'none',
            background: isRegistered
              ? 'linear-gradient(135deg, #38b2ac, #2c7a7b)'
              : 'linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))',
            color: 'white',
            cursor: isRegistered ? 'default' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
          onMouseEnter={(e) => {
            if (!isRegistered && !registering) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isRegistered && !registering) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.3)';
            }
          }}
        >
          {registering ? '⏳ Registering...' : isRegistered ? '✓ You\'re Registered!' : '🎫 Register for this Event'}
        </button>
        {isRegistered && (
          <p style={{
            textAlign: 'center',
            marginTop: 'var(--space-md)',
            color: '#38b2ac',
            fontWeight: '600',
            fontSize: '0.95rem'
          }}>
            You've successfully registered for this event!
          </p>
        )}
      </div>

      {/* Event Meta Information Card */}
      <div className="card" style={{
        marginBottom: 'var(--space-xxl)',
        padding: 'var(--space-xl)',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          marginBottom: 'var(--space-lg)',
          color: '#2d3748',
          fontWeight: '700'
        }}>
          Event Details
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--space-xl)'
        }}>
          <div>
            <div style={{
              fontSize: '2.5rem',
              marginBottom: 'var(--space-sm)'
            }}>📅</div>
            <div style={{
              fontWeight: '700',
              marginBottom: 'var(--space-xs)',
              color: '#2d3748',
              fontSize: '1.05rem'
            }}>Date & Time</div>
            <div style={{ color: '#4a5568', fontSize: '0.95rem', lineHeight: '1.6' }}>
              {formatDate(event.date)}
            </div>
            <div style={{ color: '#4a5568', fontWeight: '600', fontSize: '1rem', marginTop: '4px' }}>
              {event.time}
            </div>
          </div>

          <div>
            <div style={{
              fontSize: '2.5rem',
              marginBottom: 'var(--space-sm)'
            }}>📍</div>
            <div style={{
              fontWeight: '700',
              marginBottom: 'var(--space-xs)',
              color: '#2d3748',
              fontSize: '1.05rem'
            }}>Venue</div>
            <div style={{ color: '#4a5568', fontSize: '0.95rem', lineHeight: '1.6' }}>
              {event.venue}
            </div>
            {event.address && (
              <div style={{
                color: '#718096',
                fontSize: '0.875rem',
                marginTop: 'var(--space-xs)'
              }}>
                {event.address}
              </div>
            )}
          </div>

          {event.contactEmail && (
            <div>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: 'var(--space-sm)'
              }}>📧</div>
              <div style={{
                fontWeight: '700',
                marginBottom: 'var(--space-xs)',
                color: '#2d3748',
                fontSize: '1.05rem'
              }}>Contact</div>
              <a
                href={`mailto:${event.contactEmail}`}
                style={{
                  color: 'var(--primary-gradient-start)',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: '500'
                }}
              >
                {event.contactEmail}
              </a>
            </div>
          )}

          {event.club && (
            <div>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: 'var(--space-sm)'
              }}>🎪</div>
              <div style={{
                fontWeight: '700',
                marginBottom: 'var(--space-xs)',
                color: '#2d3748',
                fontSize: '1.05rem'
              }}>Organized By</div>
              <div style={{ color: '#4a5568', fontSize: '0.95rem' }}>
                {event.club.name}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Images and Descriptions Section */}
      {additionalImages.length > 0 && (
        <div style={{ marginTop: 'var(--space-xxl)' }}>
          <h2 style={{
            fontSize: '2.2rem',
            marginBottom: 'var(--space-xl)',
            background: 'linear-gradient(135deg, var(--secondary-gradient-start), var(--secondary-gradient-end))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700',
            textAlign: 'center'
          }}>
            📸 Event Highlights
          </h2>

          {/* Section 1: Description Left, Image Right */}
          {additionalImages[0] && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--space-xl)',
              marginBottom: 'var(--space-xxl)',
              alignItems: 'center',
              padding: 'var(--space-xl)',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.04), rgba(118, 75, 162, 0.04))',
              borderRadius: '20px',
              border: '1px solid rgba(102, 126, 234, 0.1)'
            }}>
              <div style={{ padding: 'var(--space-md)' }}>
                <h3 style={{
                  fontSize: '1.7rem',
                  marginBottom: 'var(--space-md)',
                  color: '#2d3748',
                  fontWeight: '700'
                }}>
                  {descriptionParts[0] ? '✨ What to Expect' : '📋 Event Details'}
                </h3>
                <p style={{
                  fontSize: '1.05rem',
                  lineHeight: '1.9',
                  color: '#4a5568',
                  whiteSpace: 'pre-wrap'
                }}>
                  {descriptionParts[0] || 'Join us for an amazing event experience with exciting activities and opportunities!'}
                </p>
              </div>
              <div style={{ padding: 'var(--space-md)' }}>
                <img
                  src={additionalImages[0]}
                  alt="Event Highlight 1"
                  style={{
                    width: '100%',
                    height: '340px',
                    objectFit: 'cover',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
            </div>
          )}

          {/* Section 2: Image Left, Description Right */}
          {additionalImages[1] && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--space-xl)',
              marginBottom: 'var(--space-xxl)',
              alignItems: 'center',
              padding: 'var(--space-xl)',
              background: 'linear-gradient(135deg, rgba(56, 178, 172, 0.04), rgba(44, 122, 123, 0.04))',
              borderRadius: '20px',
              border: '1px solid rgba(56, 178, 172, 0.15)'
            }}>
              <div style={{ order: 2, padding: 'var(--space-md)' }}>
                <h3 style={{
                  fontSize: '1.7rem',
                  marginBottom: 'var(--space-md)',
                  color: '#2d3748',
                  fontWeight: '700'
                }}>
                  {descriptionParts[1] ? '🎯 Activities & Benefits' : '💡 More Details'}
                </h3>
                <p style={{
                  fontSize: '1.05rem',
                  lineHeight: '1.9',
                  color: '#4a5568',
                  whiteSpace: 'pre-wrap'
                }}>
                  {descriptionParts[1] || 'Discover more about what makes this event special and worth attending!'}
                </p>
              </div>
              <div style={{ order: 1, padding: 'var(--space-md)' }}>
                <img
                  src={additionalImages[1]}
                  alt="Event Highlight 2"
                  style={{
                    width: '100%',
                    height: '340px',
                    objectFit: 'cover',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
            </div>
          )}

          {/* Section 3: Description Left, Image Right */}
          {additionalImages[2] && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--space-xl)',
              marginBottom: 'var(--space-xxl)',
              alignItems: 'center',
              padding: 'var(--space-xl)',
              background: 'linear-gradient(135deg, rgba(237, 137, 54, 0.04), rgba(221, 107, 32, 0.04))',
              borderRadius: '20px',
              border: '1px solid rgba(237, 137, 54, 0.15)'
            }}>
              <div style={{ padding: 'var(--space-md)' }}>
                <h3 style={{
                  fontSize: '1.7rem',
                  marginBottom: 'var(--space-md)',
                  color: '#2d3748',
                  fontWeight: '700'
                }}>
                  {descriptionParts[2] ? '🌟 Special Features' : '📌 Additional Info'}
                </h3>
                <p style={{
                  fontSize: '1.05rem',
                  lineHeight: '1.9',
                  color: '#4a5568',
                  whiteSpace: 'pre-wrap'
                }}>
                  {descriptionParts[2] || 'Learn more about the unique aspects and highlights of this event!'}
                </p>
              </div>
              <div style={{ padding: 'var(--space-md)' }}>
                <img
                  src={additionalImages[2]}
                  alt="Event Highlight 3"
                  style={{
                    width: '100%',
                    height: '340px',
                    objectFit: 'cover',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reviews Section */}
      {event.reviews && event.reviews.length > 0 && (
        <div style={{
          marginTop: 'var(--space-xxl)',
          padding: 'var(--space-xl)',
          background: 'linear-gradient(135deg, rgba(237, 137, 54, 0.05), rgba(246, 173, 85, 0.05))',
          borderRadius: '16px',
          border: '2px solid rgba(237, 137, 54, 0.15)'
        }}>
          <h3 style={{
            fontSize: '2rem',
            marginBottom: 'var(--space-xl)',
            color: '#2d3748',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '2.2rem' }}>⭐</span>
            Student Reviews ({event.reviews.length})
          </h3>

          <div style={{
            display: 'grid',
            gap: 'var(--space-lg)'
          }}>
            {event.reviews.map((review, index) => (
              <div
                key={index}
                style={{
                  padding: 'var(--space-xl)',
                  background: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Review Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 'var(--space-md)',
                  flexWrap: 'wrap',
                  gap: 'var(--space-sm)'
                }}>
                  <div>
                    <h4 style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: '#2d3748',
                      marginBottom: 'var(--space-xs)'
                    }}>
                      {review.studentName}
                    </h4>
                    <p style={{
                      fontSize: '0.85rem',
                      color: '#a0aec0',
                      margin: 0
                    }}>
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  {/* Star Rating */}
                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    fontSize: '1.3rem'
                  }}>
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        style={{
                          color: i < review.rating ? '#f6ad55' : '#e2e8f0',
                          textShadow: i < review.rating ? '0 2px 4px rgba(246, 173, 85, 0.3)' : 'none'
                        }}
                      >
                        {i < review.rating ? '⭐' : '☆'}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Review Comment */}
                <p style={{
                  fontSize: '1rem',
                  lineHeight: '1.7',
                  color: '#4a5568',
                  margin: 0,
                  padding: 'var(--space-md) 0 0 0',
                  borderTop: '1px solid #f7fafc'
                }}>
                  {review.comment}
                </p>
              </div>
            ))}
          </div>

          {/* Average Rating Summary */}
          {event.reviews.length > 1 && (
            <div style={{
              marginTop: 'var(--space-xl)',
              padding: 'var(--space-lg)',
              background: 'linear-gradient(135deg, rgba(246, 173, 85, 0.1), rgba(237, 137, 54, 0.1))',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#ed8936',
                marginBottom: 'var(--space-xs)'
              }}>
                {(event.reviews.reduce((sum, r) => sum + r.rating, 0) / event.reviews.length).toFixed(1)} ⭐
              </div>
              <p style={{
                fontSize: '0.95rem',
                color: '#718096',
                margin: 0
              }}>
                Average rating from {event.reviews.length} {event.reviews.length === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Bottom Register Button */}
      <div style={{
        marginTop: 'var(--space-xxl)',
        padding: 'var(--space-xl)',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08))',
        borderRadius: '16px',
        textAlign: 'center'
      }}>
        <h3 style={{
          fontSize: '1.8rem',
          marginBottom: 'var(--space-md)',
          color: '#2d3748',
          fontWeight: '700'
        }}>
          Ready to Join?
        </h3>
        <button
          onClick={handleRegister}
          disabled={isRegistered || registering}
          style={{
            padding: '16px 48px',
            fontSize: '1.1rem',
            fontWeight: '700',
            borderRadius: '12px',
            border: 'none',
            background: isRegistered
              ? 'linear-gradient(135deg, #38b2ac, #2c7a7b)'
              : 'linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))',
            color: 'white',
            cursor: isRegistered ? 'default' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
          }}
          onMouseEnter={(e) => {
            if (!isRegistered && !registering) {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isRegistered && !registering) {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.3)';
            }
          }}
        >
          {registering ? '⏳ Registering...' : isRegistered ? '✓ Already Registered' : '🎫 Register Now'}
        </button>
      </div>
    </div>
  );
};

export default EventDetail;
