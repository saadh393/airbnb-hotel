import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadSpotsData } from "../../store/spots";
import "./landingpage.css";
import SpotCard from "./SpotCard";

function LandingPageSpots() {
  const dispatch = useDispatch();
  const spotsObject = useSelector((state) => state.spots || {});
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    document.title = "Hotel Booking";
  }, []);

  useEffect(() => {
    // Convert spots object to an array whenever it changes
    setSpots(Object.values(spotsObject));
  }, [spotsObject]);

  useEffect(() => {
    // Fetch spots when the component loads
    dispatch(loadSpotsData());
  }, [dispatch]);

  let spotList = spots.map((spot) => <SpotCard spot={spot} key={spot.id} />);

  if (spots.length === 0) {
    spotList = <div>No spots available</div>;
  }

  return <div className="spots-grid">{spotList}</div>;
}

export default LandingPageSpots;
