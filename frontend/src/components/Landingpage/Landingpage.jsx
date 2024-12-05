import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loadSpotsData } from "../../store/spots"
import styles from "./landingpage.module.css"

function LandingPageSpots() {
  const dispatch = useDispatch()
  const spots = useSelector(state => Object.values(state.spots || {}))

  useEffect(() => {
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
