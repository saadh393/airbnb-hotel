import { useDispatch, useSelector } from "react-redux"
import Stars from "../Icons/Stars"
import OpenModalButton from "../OpenModalButton/OpenModalButton"
import ReviewModal from "../ReviewModal/ReviewModal"
import { useState } from "react"
import { deleteCurrentReview } from "../../store/manageReview"

function ReviewList({ reviews, spotDetails }) {
  const [reviewToDelete, setReviewToDelete] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const dispatch = useDispatch()

  const currentUser = useSelector(state => state.session.user)

  const renderStars = stars => {
    return [...Array(5)].map((_, index) => (
      <Stars key={index} filled={index < stars} />
    ))
  }

  const formatDate = dateString => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      date: "numeric",
      month: "long",
      year: "numeric"
    })
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="no-reviews">
        <h3>Reviews</h3>
        <p>No reviews yet. Be the first to post a review!</p>
      </div>
    )
  }

  // Review Delete Sepcific Functions
  const handleDeleteClick = review => {
    setReviewToDelete(review)
    setShowModal(true)
  }

  const handleConfirmDelete = () => {
    if (reviewToDelete) {
      dispatch(deleteCurrentReview(reviewToDelete.id, spotDetails.id))
      setShowModal(false)
      setReviewToDelete(null)
    }
  }

  // Handler to cancel deletion
  const handleCancelDelete = () => {
    setShowModal(false)
    setReviewToDelete(null)
  }

  return (
    <div className="reviews-container">
      <h3 className="reviews-title">
        <Stars filled={true} /> {spotDetails.avgStarRating.toFixed(1)}
        {" ● "}
        {spotDetails.numReviews}{" "}
        {spotDetails.numReviews === 1 ? "Review" : "Reviews"}
      </h3>

      <div className="reviews-list">
        {reviews.length &&
          reviews
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((review, index) => (
              <div key={index} className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-initials">
                      {review.User?.firstName[0]}
                      {review.User?.lastName[0]}
                    </div>
                    <div className="reviewer-details">
                      <h4>{`${review.User.firstName} ${review.User.lastName}`}</h4>
                      <p className="review-date">
                        {formatDate(
                          review.createdAt || new Date().toISOString()
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="review-stars">
                    {review.stars} . {renderStars(review.stars)}
                  </div>
                </div>
                <div className="review-content">
                  <p>{review.review}</p>
                </div>
                <div>
                  {currentUser && currentUser.id === review.userId && (
                    <OpenModalButton
                      modalComponent={
                        <ReviewModal spotId={spotDetails.id} review={review} />
                      }
                      buttonText="Update"
                    />
                  )}

                  {currentUser && currentUser.id === review.userId && (
                    <button
                      className="delete-review-btn"
                      onClick={() => handleDeleteClick(review)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
      </div>
      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Confirm Delete</h2>
            <p className="modal-message">
              Are you sure you want to delete this review?
            </p>
            <div className="modal-buttons">
              <button
                className="modal-btn modal-btn-delete"
                onClick={handleConfirmDelete}
              >
                Yes (Delete Review)
              </button>
              <button
                className="modal-btn modal-btn-cancel"
                onClick={handleCancelDelete}
              >
                No (Keep Review)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewList
