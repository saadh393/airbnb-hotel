import { csrfFetch } from "./csrf"

// Action Type
const ADD_REVIEW = "reviews/ADD_REVIEW"

// Action Creator
const addReview = review => ({
  type: ADD_REVIEW,
  review
})

// Thunk Action (createReview)
export const createReview = (spotId, reviewData) => async dispatch => {
  try {
    console.log("Submitting review:", reviewData) // Debug log
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData)
    })

    if (response.ok) {
      const newReview = await response.json()
      dispatch(addReview(newReview))
      return newReview
    } else {
      const error = await response.json()
      console.error("Server Error:", error) // Debug log
      return { errors: error.errors || error }
    }
  } catch (err) {
    console.error("Request Failed:", err) // Debug log
    return { errors: err.message || "Unexpected error occurred" }
  }
}

// Reducer
const reviewsReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_REVIEW: {
      const newState = { ...state }
      newState[action.review.id] = action.review
      return newState
    }
    default:
      return state
  }
}

export default reviewsReducer
