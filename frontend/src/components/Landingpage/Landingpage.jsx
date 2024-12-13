import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loadSpotsData } from "../../store/spots"
import "./landingpage.css"
import { Link } from "react-router-dom"

function LandingPageSpots() {
  const dispatch = useDispatch()

  // Get the spots object from Redux state
  const spotsObject = useSelector(state => state.spots || {})

  // Derive the spots array in a local state to prevent creating a new reference on each render
  const [spots, setSpots] = useState([])

  useEffect(() => {
    // Convert spots object to an array whenever it changes
    setSpots(Object.values(spotsObject))
  }, [spotsObject])

  useEffect(() => {
    // Fetch spots when the component loads
    dispatch(loadSpotsData())
  }, [dispatch])

  return (
    <div className="spots-grid">
      {spots.map(spot => (
        <Link
          to={`/spots/${spot.id}`}
          key={spot.id}
          title={spot.name}
          className="spot-card"
        >
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
      ))}
    </div>
  )
}

export default LandingPageSpots
