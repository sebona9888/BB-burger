import React, { useState } from 'react';
import './Reviews.css';

const Reviews = ({ burgerId, burgerName }) => {
    const [reviews, setReviews] = useState(() => {
        const allReviews = JSON.parse(localStorage.getItem('burgerReviews') || '{}');
        return allReviews[burgerId] || [];
    });

    const getAverageRating = () => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    return (
        <div className="reviews-section">
            <div className="reviews-header">
                <div className="rating-summary">
                    <span className="average-rating">{getAverageRating()}</span>
                    <div className="stars-display">
                        {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} className={`star-small ${getAverageRating() >= star ? 'filled' : ''}`}>★</span>
                        ))}
                    </div>
                    <span className="review-count">({reviews.length} reviews)</span>
                </div>
            </div>

            {reviews.length > 0 && (
                <div className="reviews-list">
                    <h4>Customer Reviews</h4>
                    {reviews.slice().reverse().map((review, idx) => (
                        <div key={idx} className="review-item">
                            <div className="review-header">
                                <strong>{review.userName}</strong>
                                <div className="review-stars">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span key={star} className={`star-mini ${review.rating >= star ? 'filled' : ''}`}>★</span>
                                    ))}
                                </div>
                                <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="review-comment">{review.comment}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reviews;