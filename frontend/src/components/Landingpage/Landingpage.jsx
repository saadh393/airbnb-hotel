import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loadSpotsData } from "../../store/spots"
import styles from "./landingpage.module.css"

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
    <div className={styles.container}>
      {spots.map(spot => (
        <div key={spot.id} title={spot.name} className={styles.card}>
          <img
            src={spot.previewImage}
            alt={spot.name}
            className={styles.image}
          />
          <div className={styles.details}>
            <div className={styles.location}>
              <span>
                {spot.city}, {spot.state}
              </span>
            </div>
            <div className={styles.price}>
              <span>${spot.price}.00</span> <span>night</span>
            </div>
            <div className={styles.rating}>
              {spot.avgRating ? `${spot.avgRating} ★` : "New"}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default LandingPageSpots
