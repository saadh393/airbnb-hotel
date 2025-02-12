import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styles from "./ManageSpots.module.css";
import { deleteSpotThunk, getSpotsListAction } from "../../store/manageSpot";

const ManageSpots = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const manageSpot = useSelector((state) => state.manageSpot);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const spots = manageSpot;

  useEffect(() => {
    const fetchUserSpots = async () => {
      try {
        setIsLoading(true);
        const result = await dispatch(getSpotsListAction());

        if (result.errors) {
          setError(result.errors);
        }
        setIsLoading(false);
      } catch (err) {
        setError("An unexpected error occurred");
        setIsLoading(false);
      }
    };

    fetchUserSpots();
  }, [dispatch]);

  const handleUpdateSpot = (spotId) => {
    navigate(`/spots/${spotId}/edit`);
  };

  const handleDeleteSpot = async (spotId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this spot?"
    );

    if (confirmDelete) {
      try {
        const result = await dispatch(deleteSpotThunk(spotId));

        if (result.errors) {
          setError(result.errors);
        }
      } catch (err) {
        setError("An error occurred while deleting the spot");
      }
    }
  };

  if (isLoading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.errorContainer}>{error}</div>;
  }

  return (
    <div className={styles.manageSpotContainer}>
      <h1 className={styles.pageHeading}>Manage Spots</h1>

      {spots?.length === 0 ? (
        <div className={styles.noSpotsContainer}>
          <p>You haven't posted any spots yet.</p>
          <Link to="/spots/new" className={styles.createSpotLink}>
            Create a New Spot
          </Link>
        </div>
      ) : (
        <div className={styles.spotGrid}>
          {spots?.map((spot) => {
            const previewImage = spot.SpotImages.length
              ? spot.SpotImages.find((image) => image.preview)?.url
              : "https://placehold.co/600x400";

            return (
              <div
                key={spot.id}
                className={styles.spotCard}
                onClick={() => navigate(`/spots/${spot.id}`)}
              >
                <img
                  src={previewImage}
                  alt={spot.name}
                  className={styles.spotCardImage}
                />
                <div className={styles.spotCardDetails}>
                  <div className={styles.spotCardLocation}>
                    <span>
                      {spot.city}, {spot.state}
                    </span>
                  </div>
                  <div className={styles.spotCardRating}>
                    {spot.avgRating
                      ? `${spot?.avgRating?.toFixed(1)} ${"★".repeat(
                          Math.round(spot?.avgRating)
                        )}`
                      : "New"}
                  </div>
                  <div className={styles.spotCardPrice}>
                    <span>${spot?.price}</span>
                    <span>night</span>
                  </div>
                  <div className={styles.spotCardActions}>
                    <button
                      className={styles.updateButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateSpot(spot.id);
                      }}
                    >
                      Update
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSpot(spot.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageSpots;
