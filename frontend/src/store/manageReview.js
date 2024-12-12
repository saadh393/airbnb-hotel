import { csrfFetch } from "./csrf";
import { fetchSpotDetails } from "./spotDetails";

// Action Type
const ADD_REVIEW = "manageReview/ADD_REVIEW";
const ALL_REVIEWS = "manageReview/ALL_REVIEWS";
const DELETE_REVIEW = "manageReview/DELETE_REVIEW";

// Action Creator
const addReview = (review) => ({
  type: ADD_REVIEW,
  review,
});

const getAllReviews = (reviews) => ({
  type: ALL_REVIEWS,
  reviews,
});

const deleteReview = (reviewId) => ({
  type: DELETE_REVIEW,
  reviewId,
});

// Thunk Action (createReview)
export const getCurrentReviews = () => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/reviews/current`, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const allReveiws = await response.json();
      dispatch(getAllReviews(allReveiws.Reviews));
      return allReveiws.Reviews;
    } else {
      const error = await response.json();
      return { errors: error.errors || error };
    }
  } catch (err) {
    console.error(err);
    return { errors: err.message || "Unexpected error occurred" };
  }
};

export const deleteCurrentReview =
  (reviewId, spotId = undefined) =>
  async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        dispatch(deleteReview(reviewId));
        if (spotId) dispatch(fetchSpotDetails(spotId));
        return reviewId;
      } else {
        const error = await response.json();
        return { errors: error.errors || error };
      }
    } catch (err) {
      const errorMessage = await err.json();
      return { errors: errorMessage.message || "Unexpected error occurred" };
    }
  };

export const updateReiview =
  (reviewId, reviewData, spotId = undefined) =>
  async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        const updatedReview = await response.json();
        dispatch(getCurrentReviews());
        if (spotId) dispatch(fetchSpotDetails(spotId));
        return updatedReview;
      } else {
        const error = await response.json();
        return { errors: error.errors || error };
      }
    } catch (err) {
      const errorMessage = await err.json();
      return { errors: errorMessage.message || "Unexpected error occurred" };
    }
  };

// Reducer
const manageReviewReducer = (state = [], action) => {
  switch (action.type) {
    case ALL_REVIEWS: {
      return action.reviews;
    }

    case DELETE_REVIEW: {
      const newState = [...state];
      const remainingReviews = newState.filter(
        (review) => review.id !== action.reviewId
      );
      return remainingReviews;
    }

    default:
      return state;
  }
};

export default manageReviewReducer;
