import { csrfFetch } from "./csrf";
const CREATE_SPOT = "spots/CREATE_SPOT";

const createSpotAction = (spot) => ({
  type: CREATE_SPOT,
  spot,
});

export const createSpot = (spotData) => async (dispatch) => {
  console.log("Sending Spot Data:", spotData);
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spotData),
  });

  if (response.ok) {
    const spot = await response.json();
    console.log("API Response (Spot Created):", spot);
    dispatch(createSpotAction(spot));
    return spot;
  } else {
    const errors = await response.json();
    console.log("API Response (Errors):", errors);
    return { errors };
  }
};
export const fetchSpotDetails = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    const spotData = await response.json();
    dispatch({ type: "LOAD_SPOT_DETAILS", payload: spotData });
    return spotData;
  } catch (error) {
    console.error("Error fetching spot details:", error);
  }
};

export const updateSpot = (spotId, spotData) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/manage/${spotId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(spotData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { errors: errorData };
    }

    const updatedSpot = await response.json();
    dispatch({ type: "UPDATE_SPOT", payload: updatedSpot });
    return updatedSpot;
  } catch (error) {
    console.error("Error updating spot:", error);
    return { errors: { message: "An unexpected error occurred" } };
  }
};

const createSpotsReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_SPOT:
      return { ...state, [action.spot.id]: action.spot };
    case "LOAD_SPOT_DETAILS":
      return {
        ...state,
        currentSpot: action.payload,
      };
    case "UPDATE_SPOT":
      return {
        ...state,
        currentSpot: action.payload,
      };
    default:
      return state;
  }
};

export default createSpotsReducer;
