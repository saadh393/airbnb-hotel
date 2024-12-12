import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentReviews } from "../../store/manageReview";
import { deleteCurrentReview } from "../../store/manageReview"; // Assuming this exists

import "./ManageReview.css"; // We'll create a CSS file for styling
import ReviewModal from "../ReviewModal/ReviewModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";

export default function ManageReview() {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.manageReview);
  const currentUser = useSelector((state) => state.session.user); // Assuming you have user info in session state

  // State for managing delete confirmation modal
  const [showModal, setShowModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    dispatch(getCurrentReviews());
  }, [dispatch]);

  // Handler to open delete confirmation modal
  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
    setShowModal(true);
  };

  // Handler for confirming review deletion
  const handleConfirmDelete = () => {
    if (reviewToDelete) {
      dispatch(deleteCurrentReview(reviewToDelete.id));
      setShowModal(false);
      setReviewToDelete(null);
    }
  };

  // Handler to cancel deletion
  const handleCancelDelete = () => {
    setShowModal(false);
    setReviewToDelete(null);
  };

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="manage-reviews-container">
      <h1>My Reviews</h1>
      {reviews.length === 0 ? (
        <p>You have no reviews yet.</p>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header-2">
                <img
                  src={review.Spot.previewImage}
                  alt={review.Spot.name}
                  className="review-spot-image"
                />
                <div className="review-spot-info">
                  <h3>{review.Spot.name}</h3>
                  <p>
                    {review.Spot.city}, {review.Spot.state}
                  </p>
                </div>
              </div>
              <div className="review-body">
                <div className="review-stars">
                  {"★".repeat(review.stars)}
                  {"☆".repeat(5 - review.stars)}
                </div>
                <p className="review-text">{review.review}</p>
                <div className="review-footer">
                  <span className="review-date">
                    {formatDate(review.createdAt)}
                  </span>
                  <div>
                    {currentUser && currentUser.id === review.userId && (
                      <OpenModalButton
                        modalComponent={
                          <ReviewModal spotId={review.spotId} review={review} />
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
              </div>
            </div>
          ))}
        </div>
      )}

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
  );
}
