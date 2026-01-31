import React, { useState } from 'react';
import { useToast } from './Toast';
import api from '../utils/api';
import { Star, Loader2, Send, X } from 'lucide-react';

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

      showSuccess(response.data.message || 'Review submitted successfully!');
      onReviewSubmitted();
      setRating(0);
      setComment('');
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const getRatingText = () => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Select a rating';
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap');
    
    .review-form {
      background: white;
      padding: 28px;
      border-radius: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(30, 64, 175, 0.08);
      margin-top: 20px;
    }
    
    .review-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }
    
    .review-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .review-header h3 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.3rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }
    
    .rating-section {
      margin-bottom: 24px;
    }
    
    .rating-label {
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      color: #1e293b;
      font-size: 0.95rem;
      margin-bottom: 12px;
      display: block;
    }
    
    .stars-container {
      display: flex;
      gap: 8px;
    }
    
    .star-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      transition: all 0.2s ease;
    }
    
    .star-btn:hover {
      transform: scale(1.15);
    }
    
    .star-btn svg {
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
    }
    
    .rating-text {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem;
      color: #64748b;
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .rating-text .stars {
      color: #f59e0b;
    }
    
    .comment-section {
      margin-bottom: 24px;
    }
    
    .comment-textarea {
      width: 100%;
      min-height: 120px;
      padding: 16px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      resize: vertical;
      transition: all 0.3s ease;
      outline: none;
      box-sizing: border-box;
    }
    
    .comment-textarea:focus {
      border-color: #0ea5e9;
      box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
    }
    
    .button-group {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }
    
    .btn-cancel {
      padding: 12px 24px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.95rem;
      font-weight: 600;
      border-radius: 12px;
      border: 2px solid #e2e8f0;
      background: white;
      color: #64748b;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .btn-cancel:hover {
      border-color: #cbd5e1;
      background: #f8fafc;
    }
    
    .btn-submit {
      padding: 12px 24px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.95rem;
      font-weight: 600;
      border-radius: 12px;
      border: none;
      background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(245, 158, 11, 0.35);
    }
    
    .btn-submit:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .spin {
      animation: spin 1s linear infinite;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="review-form">
        <div className="review-header">
          <div className="review-icon">
            <Star size={24} color="white" fill="white" />
          </div>
          <h3>Write Your Review</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="rating-section">
            <label className="rating-label">Rating</label>
            <div className="stars-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="star-btn"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  <Star
                    size={32}
                    fill={(hoveredRating >= star || rating >= star) ? '#f59e0b' : 'none'}
                    color={(hoveredRating >= star || rating >= star) ? '#f59e0b' : '#cbd5e1'}
                    strokeWidth={2}
                  />
                </button>
              ))}
            </div>
            <p className="rating-text">
              {rating > 0 && <span className="stars">{'★'.repeat(rating)}</span>}
              {getRatingText()}
            </p>
          </div>

          <div className="comment-section">
            <label className="rating-label">Your Review</label>
            <textarea
              className="comment-textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience about this event..."
              required
            />
          </div>

          <div className="button-group">
            <button
              type="button"
              className="btn-cancel"
              onClick={onCancel}
              disabled={loading}
            >
              <X size={18} />
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ReviewForm;
