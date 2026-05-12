import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './ReviewModal.css';

const ReviewModal = ({ burger, onClose, onReviewSubmitted }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!comment.trim()) {
            toast.error('Please write a review!', { position: 'top-center' });
            return;
        }

        setSubmitting(true);

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const userName = userInfo?.user?.name || userInfo?.name || 'Anonymous';

            const reviewData = {
                burgerId: burger._id,
                burgerName: burger.name,
                rating: rating,
                comment: comment,
                userName: userName,
                createdAt: new Date().toISOString()
            };

            // Get existing reviews or initialize empty array
            const existingReviews = JSON.parse(localStorage.getItem('burgerReviews') || '{}');
            const burgerReviews = existingReviews[burger._id] || [];
            burgerReviews.push(reviewData);
            existingReviews[burger._id] = burgerReviews;
            localStorage.setItem('burgerReviews', JSON.stringify(existingReviews));

            toast.success('Review submitted! ⭐', { position: 'top-center' });
            setComment('');
            setRating(5);

            if (onReviewSubmitted) onReviewSubmitted();
            onClose();
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review', { position: 'top-center' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="review-modal-overlay" onClick={onClose}>
            <div className="review-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="review-modal-close" onClick={onClose}>&times;</button>

                <h2>Rate & Review</h2>
                <h3>{burger.name}</h3>

                <form onSubmit={handleSubmit}>
                    <div className="rating-section">
                        <label>Your Rating:</label>
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star ${(hoveredRating || rating) >= star ? 'filled' : ''}`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="comment-section">
                        <label>Your Review:</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us about your experience with this burger..."
                            rows="4"
                            required
                        />
                    </div>

                    <button type="submit" className="submit-review-btn" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Review ⭐'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;