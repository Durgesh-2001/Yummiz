import React from 'react'
import './StarRating.css'

const StarRating = ({ rating, setRating }) => {
  const handleMouseMove = (e) => {
    if (!setRating) return; // If no setRating, component is read-only
    
    const container = e.currentTarget;
    const { left, width } = container.getBoundingClientRect();
    const percent = (e.clientX - left) / width;
    const value = Math.max(0.5, Math.min(5, Math.round(percent * 10) / 2));
    setRating(value);
  };

  const handleClick = (e) => {
    if (!setRating) return;
    handleMouseMove(e);
  };

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
      <div 
        className="star-rating-container"
        onClick={setRating ? handleClick : undefined}
        onMouseMove={setRating ? handleMouseMove : undefined}
        style={{ cursor: setRating ? 'pointer' : 'default' }}
      >
        {renderStars()}
      </div>
      <span className="star-rating-number">{rating.toFixed(1)}</span>
    </div>
  );
};

export default StarRating;
