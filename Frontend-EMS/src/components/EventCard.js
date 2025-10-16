import React from 'react';

const EventCard = ({ event, isRegistered, onRegister, onViewDetails }) => {
  const getImageUrl = () => {
    return event.primaryImage || event.image || 'https://via.placeholder.com/400x250?text=Event';
  };

  return (
    <div
      className="card"
      style={{
        overflow: 'hidden',
        padding: 0,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      }}
    >
      {/* Event Image */}
      <div
        onClick={() => onViewDetails(event._id)}
        style={{
          width: '100%',
          height: '200px',
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer'
        }}
      >
        <img
          src={getImageUrl()}
          alt={event.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />
      </div>

      {/* Card Content */}
      <div style={{
        padding: 'var(--space-lg)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)'
      }}>
        {/* Event Name */}
        <h3
          onClick={() => onViewDetails(event._id)}
          style={{
            fontSize: '1.4rem',
            marginBottom: 0,
            color: '#2d3748',
            fontWeight: '700',
            lineHeight: '1.4',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--primary-gradient-start)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#2d3748';
          }}
        >
          {event.name}
        </h3>

        {/* Event Description - 3 lines with ellipsis */}
        <p style={{
          fontSize: '0.95rem',
          lineHeight: '1.6',
          color: '#4a5568',
          margin: 0,
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {event.description}
        </p>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-sm)',
          marginTop: 'auto'
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(event._id);
            }}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '0.95rem',
              fontWeight: '600',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #667eea, #764ba2)', // More solid contrast
              color: '#ffffff', // Ensures text is visible
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' // adds visibility on bright background
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
            }}
          >
            View Details
          </button>


          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isRegistered) {
                onRegister(event._id);
              }
            }}
            disabled={isRegistered}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '0.95rem',
              fontWeight: '600',
              borderRadius: '8px',
              border: isRegistered ? '2px solid #38b2ac' : '2px solid var(--primary-gradient-start)',
              background: isRegistered ? '#f0fdf4' : 'white',
              color: isRegistered ? '#38b2ac' : 'var(--primary-gradient-start)',
              cursor: isRegistered ? 'default' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: isRegistered ? 1 : 1
            }}
            onMouseEnter={(e) => {
              if (!isRegistered) {
                e.currentTarget.style.background = 'var(--primary-gradient-start)';
                e.currentTarget.style.color = 'white';
              }
            }}
            onMouseLeave={(e) => {
              if (!isRegistered) {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = 'var(--primary-gradient-start)';
              }
            }}
          >
            {isRegistered ? '✓ Already Registered' : 'Register Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
