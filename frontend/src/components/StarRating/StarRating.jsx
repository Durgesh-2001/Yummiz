import React from 'react'
import './StarRating.css'

const StarRating = ({ rating }) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        const percentFilled = Math.round((rating % 1) * 100);
        stars.push(
          <span key={i} className={`star partially-filled-${percentFilled}`}>★</span>
        );
      } else {
        stars.push(<span key={i} className="star empty">★</span>);
      }
    }
    return stars;
  };

  return (
    <div className="star-rating">
      <div className="star-rating-container">
        {renderStars()}
      </div>
      <span className="star-rating-number">{rating.toFixed(1)}</span>
    </div>
  );
};

export default StarRating;
