const express = require('express');

// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
// const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { Spot, Review, SpotImage } = require('../../db/models');
const router = express.Router();

router.get("/", async (req, res, next) => {

    // res.send("get-all-spots-test"); //! Test response

    try {

        const spots = await Spot.findAll({ // Here we use Sequelize to query the database for all Spot records. The 'Spot.findAll({})' method will return an ARRAY of Spot instance (which we will use in the next function)

            include: [ // Here we will tell Sequelize to fetch and include the data from the Review and SpotImage models along with the Spot data in our query. We do this becaues we will need to use the data in the Review and SpotImage tables to calculate the average rating and determine the previewImg of each spot.
                {
                    model: Review, // retrieve Review model (for rating)
                    attributes: ['stars'] // grab the 'stars' attribute for calculating avgrating later
                },
                {
                    model: SpotImage, // retrieve SpotImage model
                    attributes: ['url'] // we use the 'url' attribute to retrieve the actual preview image for each spot
                }
            ]
        });

        // console.log(spots); //! For testing

        const spotList = spots.map(spot => { // Here we use the .map() method to create a new array by applying the following code to each element in the 'spots' array (recall that 'spots' is an array because the Spot.findAll(}) method produces an array of 'spot' instances which we called 'spots').

            const spotData = spot.toJSON(); // Here we convert our sequelize model instance (the spot in question) to a POJO, making it easier to work with.

            const avgRating = spotData.Reviews && spotData.Reviews.length > 0 // Here we check to make sure that 'Reviews' exists and is not empty (check to make sure the spot has reviews)

                ? spotData.Reviews.reduce((acc, review) => acc + review.stars, 0) / spotData.Reviews.length // IF the spot does have reviews, we calculate the average ratind using the .reduce() method

                //* Recall that the .reduce() method reduces an array to a single value by applying a function to each element. In this case, our accumulator starts at "0" and accumulates the sum of the stars corresponding to the reviews for the current spot. Then we divide the total number of stars by the number of reviews (calculate the average)

                : 0; // IF the spot does NOT have reviews, we set the avgRating to 0.

            const previewImage = spot.SpotImages[0] ? spot.SpotImages[0].url : null; // Here, we check if 'SpotImages' exists and has elements. If so, we get the URL of the first image. Otherwise (if there are no SpotImages corresponding to the current spot) we set previewImage to null.

            delete spotData.SpotImages;// During testing We saw that spotImages and Reviews were present in the response (which doesn't match the JSON response in our API docs), do we added this code to delete both attributes before returning the spotData as our json response.
            delete spotData.Reviews;

            return {
                ...spotData, // Finally, we use the spread operator to copy ALL properties from the spotData (get all of the attributes of the current spot) into a new object, then add 'avgRating' and 'previewImage' to that new object.
                avgRating,
                previewImage
            };
        });

        res.json({ Spots: spotList }); // Finally, we return the spotList (list of all of our spots as objects including the avrRating and previewImg attributes) as a json response. Notice that we also wrapped our code in a try-catch block to catch any errors and then pass them to the next() error-handler.
    } catch (err) {
        next(err);
    }
});

module.exports = router;
