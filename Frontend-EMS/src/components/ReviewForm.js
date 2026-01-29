import React, { useState } from 'react';
import { useToast } from './Toast';
import api from '../utils/api';

const ReviewForm = ({ eventId, onReviewSubmitted, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      showError('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      showError('Please enter a comment');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/student/review/${eventId}`, {
        rating,
        comment
      });

      showSuccess(response.data.message || 'Review submitted successfully! ⭐');
      onReviewSubmitted();
      setRating(0);
      setComment('');
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: 'var(--space-xl)',
      borderRadius: '16px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
      border: '1px solid #e2e8f0',
      marginTop: 'var(--space-lg)'
    }}>
      <h3 style={{
        marginBottom: 'var(--space-lg)',
        fontSize: '1.3rem',
        color: '#2d3748',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span>⭐</span> Write Your Review
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <label style={{
            display: 'block',
            marginBottom: 'var(--space-md)',
            fontWeight: '600',
            color: '#4a5568',
            fontSize: '1rem'
          }}>
            Rating
          </label>
          <div style={{
            display: 'flex',
            gap: '8px',
            fontSize: '2.5rem'
          }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '2.5rem',
                  transition: 'all 0.2s ease',
                  transform: (hoveredRating >= star || rating >= star) ? 'scale(1.1)' : 'scale(1)',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}
              >
                {(hoveredRating >= star || rating >= star) ? '⭐' : '☆'}
              </button>
            ))}
          </div>
          <p style={{
            marginTop: 'var(--space-sm)',
            fontSize: '0.9rem',
            color: '#718096'
          }}>
            {rating === 0 ? 'Select a rating' :
              rating === 1 ? '⭐ Poor' :
                rating === 2 ? '⭐⭐ Fair' :
                  rating === 3 ? '⭐⭐⭐ Good' :
                    rating === 4 ? '⭐⭐⭐⭐ Very Good' :
                      '⭐⭐⭐⭐⭐ Excellent'}
          </p>
        </div>

        {/* Comment */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <label style={{
            display: 'block',
            marginBottom: 'var(--space-md)',
            fontWeight: '600',
            color: '#4a5568',
            fontSize: '1rem'
          }}>
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience about this event..."
            required
            style={{
              width: '100%',
              minHeight: '120px',
              padding: 'var(--space-md)',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical',
              transition: 'border-color 0.2s ease',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-gradient-start)'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-md)',
          justifyContent: 'flex-end'
        }}>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={loading}
            style={{
              padding: '12px 24px',
              borderRadius: '10px'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              background: loading ? '#a0aec0' : 'var(--primary-gradient)',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⏳ Submitting...' : '✓ Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
