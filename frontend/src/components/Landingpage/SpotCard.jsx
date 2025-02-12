import { Link } from "react-router-dom";

export default function SpotCard({ spot }) {
  return (
    <Link to={`/spots/${spot.id}`} title={spot.name} className="spot-card">
      <div className="spot-card-image-container">
        <img
          src={spot.previewImage}
          alt={spot.name}
          className="spot-card-image"
        />
      </div>
      <div className="spot-card-details">
        <div className="spot-card-header">
          <span className="spot-card-location">
            {spot.city}, {spot.state}
          </span>
          <div className="spot-card-rating">
            <span className="star">★</span>
            {spot.avgRating ? spot.avgRating.toFixed(1) : "New"}
          </div>
        </div>
        <div className="spot-card-description">{spot.name}</div>
        <div className="spot-card-price-line">
          <span className="spot-card-price">${spot.price}</span>
          <span className="spot-card-night">night</span>
        </div>
      </div>
    </Link>
  );
}
