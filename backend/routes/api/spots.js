const express = require('express');

// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
// const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { Spot, Review, SpotImage, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

//! GET ALL SPOTS

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

//! GET ALL SPOTS OWNED BY THE CURRENT USER

router.get('/current', requireAuth, async (req, res, next) => {

    // res.send("Spots-owned-by-current-user") //* Test Route

    // Get the current user

    const userId = req.user.id;

    try {

        // Get the spots belonging to the current user

        const spots = await Spot.findAll({

            where: {
                ownerId: userId
            },

            include: [
                {
                    model: Review,
                    attributes: ['stars']
                },
                {
                    model: SpotImage,
                    attributes: ['url']
                }
            ]
        });

        // Map through each spot, calculate avgRating and fetch previewImage

        const spotList = spots.map(spot => {

            const spotData = spot.toJSON();

            const avgRating = spotData.Reviews && spotData.Reviews.length > 0

                ? spotData.Reviews.reduce((acc, review) => acc + review.stars, 0) / spotData.Reviews.length

                : 0;

            const previewImage = spot.SpotImages[0] ? spot.SpotImages[0].url : null;

            delete spotData.SpotImages;
            delete spotData.Reviews

            // combine each spot with avgRating and previewImage to create spotDetails

            return {
                ...spotData,
                avgRating,
                previewImage
            };
        });

        // return spotDetails as a json response

        res.json({ Spots: spotList })

    } catch (err) {
        next(err);
    };
});

//! GET DETAILS OF A SPOT FROM AN ID

router.get('/:spotId', async (req, res, next) => {

    try {

        const id = req.params.spotId; // destructure the request parameters to extract the spotId

        const spot = await Spot.findByPk(id, { // Here we search for a specific spot using its id (which is its primary key, hence the .findByPk method)

            include: [ // We also want to include the Review and SpotImage models in our query because we need the 'stars' attribute of the Reviews corresponding to this spot as well as the 'url' of the first SpotImage corresponding to this spot in order to calculate the avgRating and determine the previewImage for the spot.
                {
                    model: Review,
                    attributes: ['stars']
                },
                {
                    model: SpotImage,
                    attributes: ['id', 'url', 'preview']
                },
                {
                    model: User,
                    as: "Owner",
                    attributes: ['id', 'firstName', 'lastName']
                }
            ]
        });

        if (!spot) { // If the spot does not exist...
            return res.status(404).json({ message: "Spot couldn't be found" }); // ...return a json response with the message "Spot couldn't be found" and an error code of 404, per the API documentation
        }

        // console.log(spot); //! For testing

        const spotData = spot.toJSON(); // convert our spot into a POJO

        const avgRating = spotData.Reviews && spotData.Reviews.length > 0 // Check to see if Reviews exists and make sure that it isn't empty

            ? spotData.Reviews.reduce((acc, review) => acc + review.stars, 0) / spotData.Reviews.length // If there are reviews, we use the reduce method to add up all of the stars from all of the reviews corresponding to the current spot, then divide that number by the total number of reviews in order to get the average rating.

            : 0; // If there are not reviews, then we set the average rating to 0.


        const numReviews = spotData.Reviews.length;

        delete spotData.Reviews;

        const spotDetails = { // Use the spread operator to include all of the properties from our spotData (the details of the current spot) into our new object, 'spotDetails'
            ...spotData,
            numReviews,
            avgRating, // then we add the avgRating and previewImage properties to our new 'spotDetails' object as well
            // previewImage
        };

        res.json(spotDetails) // Finally, we return the spotDetails as a JSON response

    } catch (err) { // We also wrapped our code in a try-catch block so that we can handle any errors that occur and pass them to the next() error-handler.
        next(err)
    }
});

//! Create a Spot

router.post("/", requireAuth, async (req, res, next) => {

    try {

        const ownerId = req.user.id;

        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        // res.json(req.body); //! For testing
        
        const newSpot = await Spot.create({
            ownerId,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        });

        res.status(201).json(newSpot);

    } catch(err) {
        next(err);
    };
});

module.exports = router;
