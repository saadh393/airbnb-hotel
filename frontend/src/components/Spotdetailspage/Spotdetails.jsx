// import { useEffect } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { useParams } from "react-router-dom"
// import { fetchSpotDetails } from "../../store/spotDetails"
// import styles from "./SpotDetails.module.css"

// function SpotDetails() {
//   const { spotId } = useParams()
//   const dispatch = useDispatch()

//   useEffect(() => {
//     dispatch(fetchSpotDetails(spotId))
//   }, [dispatch, spotId])

//   const spotDetails = useSelector(state => state.spotDetails)

//   if (!spotDetails || !spotDetails.SpotImages) {
//     return <div>Loading...</div>
//   }

//   const mainImage = spotDetails.SpotImages.find(img => img.preview)
//   const otherImages = spotDetails.SpotImages.filter(img => !img.preview)

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>{spotDetails.name}</h1>
//       <p className={styles.location}>
//         Location: {spotDetails.city}, {spotDetails.state}, {spotDetails.country}
//       </p>

//       <div className={styles.images}>
//         {mainImage && (
//           <div className={styles.mainImage}>
//             <img src={mainImage.url} alt="Main Spot" />
//           </div>
//         )}
//         <div className={styles.additionalImages}>
//           {otherImages.map(img => (
//             <img
//               key={img.id}
//               src={img.url}
//               alt={`Spot Image ${img.id}`}
//               className={styles.smallImage}
//             />
//           ))}
//         </div>
//       </div>

//       <div className={styles.hostSection}>
//         <h2>
//           Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}
//         </h2>
//         <p>{spotDetails.description}</p>
//       </div>

//       <div className={styles.calloutBox}>
//         <div className={styles.price}>
//           <span>${spotDetails.price}</span> / night
//         </div>
//         <div className={styles.rating}>
//           <span>
//             {spotDetails.avgStarRating
//               ? `${spotDetails.avgStarRating} ★`
//               : "New"}
//           </span>{" "}
//           · <span>{spotDetails.numReviews} reviews</span>
//         </div>
//         <button
//           className={styles.reserveButton}
//           onClick={() => alert("Feature Coming Soon...")}
//         >
//           Reserve
//         </button>
//       </div>
//     </div>
//   )
// }

// export default SpotDetails

// components/SpotDetails/SpotDetails.jsx
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { fetchSpotDetails } from "../../store/spotDetails"
import OpenModalButton from "../OpenModalButton/OpenModalButton"
import ReviewModal from "../ReviewModal/ReviewModal"

function SpotDetails() {
  const { spotId } = useParams()
  const dispatch = useDispatch()

  const spotDetails = useSelector(state => state.spotDetails)
  const sessionUser = useSelector(state => state.session.user)

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId))
  }, [dispatch, spotId])

  if (!spotDetails || !spotDetails.SpotImages) return <div>Loading...</div>

  const isOwner = sessionUser?.id === spotDetails.ownerId
  const hasPostedReview = spotDetails.Reviews?.some(
    review => review.userId === sessionUser?.id
  )

  return (
    <div className="spot-details">
      <h1>{spotDetails.name}</h1>
      <p>
        Location: {spotDetails.city}, {spotDetails.state}, {spotDetails.country}
      </p>

      <div className="spot-images">
        {spotDetails.SpotImages.map(img => (
          <img key={img.id} src={img.url} alt={`Spot Image ${img.id}`} />
        ))}
      </div>

      <div>
        <h2>
          Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}
        </h2>
        <p>{spotDetails.description}</p>
      </div>

      <div className="reviews">
        <h2>Reviews</h2>
        {!isOwner && !hasPostedReview && sessionUser && (
          <OpenModalButton
            modalComponent={<ReviewModal spotId={spotId} />}
            buttonText="Post Your Review"
          />
        )}
        {spotDetails.Reviews && spotDetails.Reviews.length > 0 ? (
          spotDetails.Reviews.map(review => (
            <div key={review.id}>
              <p>{review.review}</p>
              <p>{review.stars} ★</p>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to post a review!</p>
        )}
      </div>
    </div>
  )
}

export default SpotDetails
