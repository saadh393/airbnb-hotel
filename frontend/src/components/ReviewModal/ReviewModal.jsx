import { useState } from "react";
import { useDispatch } from "react-redux";
import { createReview } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import Stars from "../Icons/Stars";
import "./ReviewModal.css";
import { updateReiview } from "../../store/manageReview";

const reviewDefault = {
  review: "",
  stars: 0,
};

function ReviewModal({ spotId, review = reviewDefault }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [comment, setComment] = useState(review.review ? review.review : "");
  const [rating, setRating] = useState(review.stars ? review.stars : 0);
  const [hover, setHover] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (comment.trim().length < 10) {
      newErrors.comment = "Review must be at least 10 characters long";
    }

    if (rating < 1) {
      newErrors.rating = "Please select a rating";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const reviewData = {
        review: comment.trim(),
        stars: rating,
      };

      const response = await dispatch(
        review?.id
          ? updateReiview(review.id, reviewData, spotId)
          : createReview(spotId, reviewData)
      );
      console.log("response from createReview:", response);

      if (response.errors) {
        setErrors({ submit: response.errors });
        setIsSubmitting(false);
      } else {
        closeModal();
      }
    } catch (error) {
      console.error("Review submission error:", error);
      setErrors({ submit: "Failed to submit review. Please try again." });
      setIsSubmitting(false);
    }
  };

  const renderStarRating = () => {
    return [...Array(5)].map((_, index) => {
      const ratingValue = index + 1;
      return (
        <div
          key={ratingValue}
          onMouseEnter={() => setHover(ratingValue)}
          onMouseLeave={() => setHover(0)}
          onClick={() => setRating(ratingValue)}
          className="star-container"
        >
          <Stars filled={ratingValue <= (hover || rating)} />
        </div>
      );
    });
  };

  return (
    <div className="review-modal-container">
      <h2 className="review-modal-title">How was your stay?</h2>

      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label htmlFor="review" className="form-label">
            Leave your review here
          </label>
          <textarea
            id="review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience (minimum 10 characters)"
            className={`form-textarea ${errors.comment ? "input-error" : ""}`}
            rows={4}
          />
          {errors.comment && <p className="error-message">{errors.comment}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Stars</label>
          <div className="star-rating-container">{renderStarRating()}</div>
          {errors.rating && <p className="error-message">{errors.rating}</p>}
        </div>

        {errors.submit && <div className="submit-error">{errors.submit}</div>}

        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting || comment.length < 10 || rating < 1}
            className="submit-button"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
          <button
            type="button"
            onClick={closeModal}
            disabled={isSubmitting}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReviewModal;
