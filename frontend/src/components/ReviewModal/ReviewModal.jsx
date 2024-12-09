import { useState } from "react"
import { useDispatch } from "react-redux"
import { createReview } from "../../store/reviews"
import { useModal } from "../../context/Modal"
import styles from "./ReviewModal.css"

function ReviewModal({ spotId }) {
  const dispatch = useDispatch()
  const { closeModal } = useModal()

  const [comment, setComment] = useState("")
  const [stars, setStars] = useState(0)
  const [errors, setErrors] = useState({})

  const handleSubmit = async e => {
    e.preventDefault()

    // Validate input
    if (comment.length < 10 || stars < 1 || stars > 5) {
      setErrors({
        message: "Review must be at least 10 characters and stars between 1-5."
      })
      return
    }

    const reviewData = {
      review: comment,
      stars: Number(stars)
    }

    console.log("Submitting review:", reviewData) // Debug log

    const response = await dispatch(createReview(spotId, reviewData))

    if (response.errors) {
      setErrors(response.message)
      console.error("Validation Errors:", response.errors) // Debug log
    } else {
      // onClose()
    }
  }

  return (
    <div className={styles.modal}>
      <h2>How was your stay?</h2>
      {errors.review && <p className={styles.error}>{errors.review}</p>}
      {errors.stars && <p className={styles.error}>{errors.stars}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          placeholder="Leave your review here..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          required
        />
        <label>
          Stars
          <input
            type="number"
            min="1"
            max="5"
            value={stars}
            onChange={e => setStars(e.target.value)}
            required
          />
        </label>
        <div className={styles.actions}>
          <button type="submit" disabled={comment.length < 10 || stars < 1}>
            Submit Your Review
          </button>
          <button type="button" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReviewModal
