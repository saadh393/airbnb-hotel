import React from "react"
import Stars from "../Icons/Stars"

function ReviewList({ reviews, spotDetails }) {
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

  return (
    <div className="reviews-container">
      <h3 className="reviews-title">
        {spotDetails.numReviews}{" "}
        {spotDetails.numReviews === 1 ? "Review" : "Reviews"}
        <span className="average-rating">
          {renderStars(Math.round(spotDetails.avgStarRating))}
          <span className="avg-text">
            {spotDetails.avgStarRating.toFixed(1)} Average Rating
          </span>
        </span>
      </h3>

      <div className="reviews-list">
        {reviews.length &&
          reviews.map((review, index) => (
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
                      {formatDate(review.createdAt || new Date().toISOString())}
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
            </div>
          ))}
      </div>
    </div>
  )
}

export default ReviewList
