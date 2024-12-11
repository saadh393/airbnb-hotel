import { csrfFetch } from "./csrf";

// Action Types
const GET_SPOTS_BY_USER = "spot/GET_SPOTS_BY_USER";
const UPDATE_SPOT = "spot/UPDATE_SPOT";
const DELETE_SPOT = "spot/DELETE_SPOT";

// Action Creators
const addSpotsCreatedByUser = (spotsList) => ({
  type: GET_SPOTS_BY_USER,
  data: spotsList,
});

const updateSpotAction = (updatedSpot) => ({
  type: UPDATE_SPOT,
  spot: updatedSpot,
});

const deleteSpotAction = (spotId) => ({
  type: DELETE_SPOT,
  spotId,
});

// Thunk Actions
export const getSpotsListAction = () => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/manage`);

    if (!response.ok) {
      const error = await response.json();
      return { errors: error.message || error };
    }

    const spotsList = await response.json();
    dispatch(addSpotsCreatedByUser(spotsList));
    return spotsList;
  } catch (err) {
    const errorMessage = await err.json();
    return { errors: errorMessage.message || "Unexpected error occurred" };
  }
};

export const updateSpotThunk = (spotId, spotData) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/manage/${spotId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(spotData),
    });

    if (!response.ok) {
      const error = await response.json();
      return { errors: error.message || error };
    }

    const updatedSpot = await response.json();
    dispatch(updateSpotAction(updatedSpot));
    return updatedSpot;
  } catch (err) {
    const errorMessage = await err.json();
    return { errors: errorMessage.message || "Unexpected error occurred" };
  }
};

export const deleteSpotThunk = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/manage/${spotId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      return { errors: error.message || error };
    }

    dispatch(deleteSpotAction(spotId));
    return { message: "Spot successfully deleted" };
  } catch (err) {
    const errorMessage = await err.json();
    return { errors: errorMessage.message || "Unexpected error occurred" };
  }
};

// Reducer
const manageStoreReducer = (state = [], action) => {
  switch (action.type) {
    case GET_SPOTS_BY_USER:
      return action.data;

    case UPDATE_SPOT:
      return state.map((spot) =>
        spot.id === action.spot.id ? action.spot : spot
      );

    case DELETE_SPOT:
      return state.filter((spot) => spot.id !== action.spotId);

    default:
      return state;
  }
};

export default manageStoreReducer;
