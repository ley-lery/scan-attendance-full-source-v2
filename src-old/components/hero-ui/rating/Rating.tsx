import React, { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

interface RatingProps {
  maxRating: number; // Total number of stars (e.g., 5)
  value: number; // Current rating value
  onChange: (rating: number) => void; // Function to update the rating
}

const Rating: React.FC<RatingProps> = ({ maxRating, value, onChange }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  // Handle when the user hovers over a star
  const handleMouseEnter = (index: number) => setHovered(index);

  // Reset hover state when the user leaves the stars
  const handleMouseLeave = () => setHovered(null);

  // Render stars based on the current rating or hovered state
  const renderStars = () => {
    return Array.from({ length: maxRating }, (_, index) => {
      const starValue = index + 1;
      const isFilled =
        hovered !== null ? starValue <= hovered : starValue <= value;

      return (
        <span
          key={index}
          onClick={() => onChange(starValue)}
          onMouseEnter={() => handleMouseEnter(starValue)}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: "pointer", color: isFilled ? "#ffc107" : "#d1d5db" }}
        >
          {isFilled ? <FaStar size={24} /> : <FaRegStar size={24} />}
        </span>
      );
    });
  };

  return <div className="flex gap-1">{renderStars()}</div>;
};

export default Rating;
