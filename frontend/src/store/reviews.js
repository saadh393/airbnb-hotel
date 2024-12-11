import { csrfFetch } from "./csrf";
import { fetchSpotDetails } from "./spotDetails";

// Action Type
const ADD_REVIEW = "reviews/ADD_REVIEW";
const BULK_ADD_REVIEWS = "reviews/BULK_ADD_REVIEWS";

// Action Creator
const addReview = (review) => ({
  type: ADD_REVIEW,
  review,
});

export const bulkAddReviews = (reviews) => {
  return {
    type: BULK_ADD_REVIEWS,
    reviews,
  };
};

// Thunk Action (createReview)
export const createReview = (spotId, reviewData) => async (dispatch) => {
  try {
    console.log("Submitting review:", reviewData); // Debug log
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });

    // console.log("Server response:", response.ok); // Debug log

    if (response.ok) {
      const newReview = await response.json();
      dispatch(addReview(newReview));
      dispatch(fetchSpotDetails(spotId));
      return newReview;
    } else {
      const error = await response.json();
      console.error("Server Error:", error); // Debug log
      return { errors: error.errors || error };
    }
  } catch (err) {
    const errorMessage = await err.json();
    return { errors: errorMessage.message || "Unexpected error occurred" };
  }
};

// Reducer
const reviewsReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_REVIEW: {
      return [...state, action.review];
    }

    case BULK_ADD_REVIEWS: {
      // Use Set to create Unique Array of Reviews
      const newState = [];
      const reviewSet = new Set(newState.map((review) => review.id));
      action.reviews.forEach((review) => {
        if (!reviewSet.has(review.id)) {
          newState.push(review);
          reviewSet.add(review.id);
        }
      });

      return newState;
    }
    default:
      return state;
  }
};

export default reviewsReducer;
