import React from 'react';
import { Eye, UserPlus, CheckCircle2 } from 'lucide-react';

const EventCard = ({ event, isRegistered, onRegister, onViewDetails }) => {
  const getImageUrl = () => {
    return event.primaryImage || event.image || 'https://via.placeholder.com/400x250?text=Event';
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap');
    
    .event-card {
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(30, 64, 175, 0.08);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .event-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 40px rgba(30, 64, 175, 0.15);
    }
    
    .event-image-wrapper {
      position: relative;
      width: 100%;
      height: 200px;
      overflow: hidden;
      cursor: pointer;
    }
    
    .event-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    
    .event-card:hover .event-image {
      transform: scale(1.08);
    }
    
    .event-image-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(30, 64, 175, 0.6), transparent 50%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .event-card:hover .event-image-overlay {
      opacity: 1;
    }
    
    .event-content {
      padding: 24px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .event-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.35rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
      line-height: 1.4;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .event-title:hover {
      background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .event-description {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.95rem;
      line-height: 1.7;
      color: #64748b;
      margin: 0;
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .event-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: auto;
    }
    
    .btn-view {
      width: 100%;
      padding: 14px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.95rem;
      font-weight: 600;
      border-radius: 12px;
      border: none;
      background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .btn-view:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(30, 64, 175, 0.35);
    }
    
    .btn-register {
      width: 100%;
      padding: 14px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.95rem;
      font-weight: 600;
      border-radius: 12px;
      border: 2px solid #1e40af;
      background: white;
      color: #1e40af;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .btn-register:hover {
      background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
      color: white;
      border-color: transparent;
    }
    
    .btn-registered {
      width: 100%;
      padding: 14px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.95rem;
      font-weight: 600;
      border-radius: 12px;
      border: 2px solid #22c55e;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      color: #166534;
      cursor: default;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="event-card">
        <div
          className="event-image-wrapper"
          onClick={() => onViewDetails(event._id)}
        >
          <img
            src={getImageUrl()}
            alt={event.name}
            className="event-image"
          />
          <div className="event-image-overlay" />
        </div>

        <div className="event-content">
          <h3
            className="event-title"
            onClick={() => onViewDetails(event._id)}
          >
            {event.name}
          </h3>

          <p className="event-description">
            {event.description}
          </p>

          <div className="event-actions">
            <button
              className="btn-view"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(event._id);
              }}
            >
              <Eye size={18} />
              View Details
            </button>

            {isRegistered ? (
              <button className="btn-registered" disabled>
                <CheckCircle2 size={18} />
                Already Registered
              </button>
            ) : (
              <button
                className="btn-register"
                onClick={(e) => {
                  e.stopPropagation();
                  onRegister(event._id);
                }}
              >
                <UserPlus size={18} />
                Register Now
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventCard;
