import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loadSpotsData } from "../../store/spots"

function LandingPageSpots() {
  // Local state variable for obtaining the spots
  const dispatch = useDispatch()
  const spots = useSelector(state => Object.values(state.spots))

  useEffect(() => {
    dispatch(loadSpotsData())
  }, [dispatch])

  return (
    <div>
      {spots.map(spot => {
        return (
          <div key={spot.id}>
            <img src={spot.previewImage} alt={spot.name} />
            <ul>
              <li>{spot.city}</li>
              <li>{spot.state}</li>
              <li>${spot.price}.00/night</li>
              <li>{spot.avgRating}</li>
            </ul>
          </div>
        )
      })}
    </div>
  )
}

export default LandingPageSpots
