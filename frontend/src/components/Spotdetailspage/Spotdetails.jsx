// components/SpotDetails/SpotDetails.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpotDetails } from "../../store/spotDetails";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ReviewModal from "../ReviewModal/ReviewModal";
import ReviewList from "./ReviewList";
import FeatureCommingSoon from "./FeatureCommingSoon";

function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();

  const spotDetails = useSelector((state) => state.spotDetails);
  const sessionUser = useSelector((state) => state.session.user);
  const reviews = useSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
  }, [dispatch, spotId]);

  if (!spotDetails || !spotDetails.SpotImages) return <div>Loading...</div>;

  const isOwner = sessionUser?.id === spotDetails.ownerId;

  const hasPostedReview = spotDetails.Reviews?.some(
    (review) => review.userId === sessionUser?.id
  );

  return (
    <div className="spot-details">
      <h1>{spotDetails.name}</h1>
      <p style={{ color: "gray" }}>
        {spotDetails.city}, {spotDetails.state}, {spotDetails.country}
      </p>

      <div className="spot-images">
        {spotDetails.SpotImages.map((img) => (
          <img key={img.id} src={img.url} alt={`Spot Image ${img.id}`} />
        ))}
      </div>

      <section className="sport-details-row">
        <section>
          <div>
            <h2>
              Hosted by {spotDetails.Owner.firstName}{" "}
              {spotDetails.Owner.lastName}
            </h2>
            <p>{spotDetails.description}</p>
          </div>

          <div className="reviews">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2>Reviews</h2>
              {!isOwner && !hasPostedReview && sessionUser && (
                <OpenModalButton
                  modalComponent={<ReviewModal spotId={spotId} />}
                  buttonText="Post Your Review"
                />
              )}
            </div>

            <ReviewList reviews={reviews} spotDetails={spotDetails} />
          </div>
        </section>

        <div className="callout">
          <div className="callout-row">
            <div>
              <span className="callout-price">${spotDetails.price}</span>
              <span>/ night</span>
            </div>
            <span>
              {spotDetails.avgStarRating
                ? `★ ${parseFloat(spotDetails.avgStarRating).toFixed(1)}  ● ${
                    spotDetails.numReviews
                  } ${spotDetails.numReviews === 1 ? "Review" : "Reviews"} `
                : "New"}
            </span>
          </div>
          <OpenModalButton
            modalComponent={<FeatureCommingSoon />}
            buttonText="Reserve"
          />
        </div>
      </section>
    </div>
  );
}

export default SpotDetails;
