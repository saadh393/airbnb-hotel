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
    <div className="spot-card-container">
      {spots.map(spot => (
        <Link
          to={`/spots/${spot.id}`}
          key={spot.id}
          title={spot.name}
          className="spot-card"
        >
          <img
            src={spot.previewImage}
            alt={spot.name}
            className="spot-card-image"
          />
          <div className="spot-card-details">
            <div className="spot-card-rating">
              {spot.avgRating
                ? `${spot.avgRating} ${"★".repeat(Math.round(spot.avgRating))}`
                : "New"}
            </div>
            <div className="spot-card-location">
              <span>
                {spot.city}, {spot.state}
              </span>
            </div>
            <div className="spot-card-price">
              <span>${spot.price}.00</span>
              <span>night</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default LandingPageSpots
