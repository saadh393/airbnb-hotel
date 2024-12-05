import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { fetchSpotDetails } from "../../store/spotDetails"
import styles from "./SpotDetails.module.css" // Import CSS Module

function SpotDetails() {
  const { spotId } = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId))
  }, [dispatch, spotId])

  const spotDetails = useSelector(state => state.spotDetails)

  if (!spotDetails || !spotDetails.SpotImages) {
    return <div>Loading...</div>
  }

  const mainImage = spotDetails.SpotImages.find(img => img.preview)
  const otherImages = spotDetails.SpotImages.filter(img => !img.preview)

  return (
    <div className={styles.container}>
      {/* Spot Header */}
      <h1 className={styles.title}>{spotDetails.name}</h1>
      <p className={styles.location}>
        Location: {spotDetails.city}, {spotDetails.state}, {spotDetails.country}
      </p>

      {/* Images Section */}
      <div className={styles.images}>
        {mainImage && (
          <div className={styles.mainImage}>
            <img src={mainImage.url} alt="Main Spot" />
          </div>
        )}
        <div className={styles.additionalImages}>
          {otherImages.map(img => (
            <img
              key={img.id}
              src={img.url}
              alt={`Spot Image ${img.id}`}
              className={styles.smallImage}
            />
          ))}
        </div>
      </div>

      {/* Host Info */}
      <div className={styles.hostSection}>
        <h2>
          Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}
        </h2>
        <p>{spotDetails.description}</p>
      </div>

      {/* Callout Section */}
      <div className={styles.calloutBox}>
        <div className={styles.price}>
          <span>${spotDetails.price}</span> / night
        </div>
        <div className={styles.rating}>
          <span>
            {spotDetails.avgStarRating
              ? `${spotDetails.avgStarRating} ★`
              : "New"}
          </span>{" "}
          · <span>{spotDetails.numReviews} reviews</span>
        </div>
        <button
          className={styles.reserveButton}
          onClick={() => alert("Feature Coming Soon...")}
        >
          Reserve
        </button>
      </div>
    </div>
  )
}

export default SpotDetails
