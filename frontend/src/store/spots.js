const LOAD_SPOTS = "spots/LOAD_SPOTS"

const load = spots => ({
  type: LOAD_SPOTS,
  spots
})

export const loadSpotsData = () => async dispatch => {
  const response = await fetch("/api/spots")
  if (response.ok) {
    const result = await response.json()
    dispatch(load(result.Spots))
  }
}

const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const allSpots = {}
      action.spots.forEach(spot => {
        allSpots[spot.id] = spot
      })
      return {
        ...state,
        ...allSpots
      }
    }

    default:
      return state
  }
}

export default spotsReducer
