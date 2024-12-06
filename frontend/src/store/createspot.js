import { csrfFetch } from "./csrf"
const CREATE_SPOT = "spots/CREATE_SPOT"

const createSpotAction = spot => ({
  type: CREATE_SPOT,
  spot
})

export const createSpot = spotData => async dispatch => {
  console.log("Sending Spot Data:", spotData)
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spotData)
  })

  if (response.ok) {
    const spot = await response.json()
    console.log("API Response (Spot Created):", spot)
    dispatch(createSpotAction(spot))
    return spot
  } else {
    const errors = await response.json()
    console.log("API Response (Errors):", errors)
    return { errors }
  }
}

const createSpotsReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_SPOT:
      return { ...state, [action.spot.id]: action.spot }
    default:
      return state
  }
}

export default createSpotsReducer
