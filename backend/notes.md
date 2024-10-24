# Bed And Breakfast

## Questions

- Do we need to change (or alias) avgRating to avgStarRating for 'Get Details of a Spot from an id', since for some reason API docs specify a response body with an attribute called 'avgStarRating' instead of 'avgRating'?

- With respect to error messages, is it ok when they do not say exactly what is stated in the API docs as long as they convey the correct message? (for example, "Please provide a valid email" vs "Invalid email")

- ~~Delete a Spot route works correctly on local environment, but fails on live environment because it validates foreign key constraint on spotImages table. We are thinking about adding an onDelete: cascade statement within the .destroy method of the route handler.~~

- ~~Why does Render.com no longer automatically re-deploy when we push to github? We changed the branch from main to dev, but it does not automatically re-deploy when we push to dev.~~

- ~~Are we able to change Raihan's repo url so that he is able to re-deploy from my repo (which we are sharing as our joint project repo)?~~

- ~~A dev branch already exists in my github repo, but Raihan isn't able to pull that branch or access it. Should he create his own dev branch on his end? Or is there a way that he can access the same dev branch that I"m working on~~?

- ~~Rahan pulled my repo and doesn't have a .env file (I'm assuming because it's in my .gitignore). How should we handle this?~~

- ~~With respect to 'get Spot by userId' how can we alias 'User' to be 'Owner' as it is in the example res~~

- ~~Can we change the 'default branch' on Render.com such that we can deploy test from the 'dev' branch instead of Main? This will allow us to test in both local and live environments before pushing to main~~

## Notes

### ~~Change DEFAULT CHARACTER LENGTH of URL ATTRIBUTE on SpotImages MIGRATION FILE~~:


    Eventually we need to modify character length property of the 'URL' attribute in the SpotImage migration file.

    Right now, in our live environment, SpotImage seeding will fail if the URL is longer than 250 characters for the given spotImage. This is very limiting, and we need to change it before the end of the project.

    Right now we have a constraint on the model file, but not on the migration file. Maybe adding the (2048) to replace the default (250) character limit on the migration file will fix this.

    In order to make that change, we first need to modify the migration file. After that, we need to manually drop the database on Render so that it will re-build the database using the updated migration file.

    The command to open the PostgreSQL Database in our terminal is: PGPASSWORD=bpBTOrAC90SK9bmz7icVIeVnBspsvFPl psql -h dpg-cs2mmr0gph6c738688fg-a.oregon-postgres.render.com -U app_academy_projects_hlgc_user app_academy_projects_hlgc

    The command to drop the Database is: DROP SCHEMA bed_and_breakfast_schema CASCADE;

    After we've dropped the database following modification of the migration file, manually re-deploy the bed-and-breakfast web service using the 'Clear build cache and deploy' command from the Render.com GUI.

## Goals

### Successful Response Body Evaluations:

#### Authorization

- Done (Forbidden vs Unauthorized??)

#### Get the Current User

- remove the 'createdAt' and 'updatedAt' attributes of the user from the response

#### Log in a User

- remove the 'createdAt' and 'updatedAt' attributes of the user from the response

#### Sign Up a User

- remove the 'createdAt' and 'updatedAt' attributes of the user from the response

- remove 'title' key from error response

- (error message for failing unique constraint for username) instead of 'Validation error,' the 'message' attribute of the errors object should say, 'User already exists'

#### Get All Spots

- Done

#### Get all Spots owned by the Current User

- Done

### Get Details of a Spot from an ID

- change 'avgRating' to 'avgStarRating'

#### Create a Spot

- Done

#### Add an Image to a Spot based on the Spot's id

- Remove 'spotId', 'createdAt', and 'updatedAt' attributes from response body

#### Edit a Spot

- Done

#### Delete a Spot

- Done

#### Get All Reviews of the Current User

- Done

### Get All Reviews by a Spot's id

- Done

### Create a Review for a Spot based on the Spot's id

- Done

#### Add an Image to a Review based on the Review's id

- Remove "reviewId", updatedAt, and createdAt from success response body

#### Edit a Review

- Done

#### Delte a Review

- Done

#### Delete a SpotImage

- Done

#### Delete a ReviewImage

- Done

#### Pagination

- Done

#### Query Parameters

- Done

---

### ~~Route: Add Query Filters to Get All Spots~~

#### Setup

```js
router.get("/", async (req, res, next) => {
    try {
        const {
            page = 1,
            size = 20,
            minLat,
            maxLat,
            minLng,
            maxLng,
            minPrice,
            maxPrice
        } = req.query; // extract query parameters from req.query

        // apply pagination with default values and validate them
        const pagination = {};

        if (parseInt(page, 10) >= 1 && parseInt(size, 10) >= 1 && parseInt(size, 10) <= 20) {
            pagination.limit = parseInt(size, 10);
            pagination.offset = (parseInt(page, 10) - 1) * parseInt(size, 10);
        } else {
            return res.status(400).json({
                message: "Bad Request",
                errors: {
                    page: "Page must be greater than or equal to 1",
                    size: "Size must be between 1 and 20"
                }
            });
        }

        // Apply filters (lat, long, price) if provided and valid
        const where = {};

        if (minLat) where.lat = { [Op.gte]: parseFloat(minLat) };
        if (maxLat) where.lat = { [Op.lte]: parseFloat(maxLat) };
        if (minLng) where.lng = { [Op.gte]: parseFloat(minLng) };
        if (maxLng) where.lng = { [Op.lte]: parseFloat(maxLng) };
        if (minPrice && parseFloat(minPrice) >= 0) where.price = { [Op.gte]: parseFloat(minPrice) };
        if (maxPrice && parseFloat(maxPrice) >= 0) where.price = { [Op.lte]: parseFloat(maxPrice) };

        // user spot.findAll() with the 'where' clause and 'pagination' applied.
        const spots = await Spot.findAll({
            include: [
                { model: Review, attributes: ['stars'] },
                { model: SpotImage, attributes: ['url'] }
            ],
            where,
            ...pagination
        });

        const spotList = spots.map(spot => {

            const spotData = spot.toJSON();

            const avgRating = spotData.Reviews && spotData.Reviews.length > 0
            ? spotData.Reviews.reduce((acc, review) => acc + review.stars, 0) / spotData.Reviews.length
            : 0;

            const previewImage = spot.SpotImages[0] ? spot.SpotImages[0].url : null;

            delete spotData.SpotImages;
            delete spotData.Reviews;

            return {
            ...spotData,
            avgRating,
            previewImage
            };
        });

        // also, include pagination data in the response
        res.status(200).json({ Spots: spotList, page: parseInt(page, 10), size: parseInt(size, 10) });

    } catch (err) {
        next(err);
    }
});
```

### ~~Route: Delete a Review Image~~

#### Notes

- Requires authentication

- Requires authorization

- Goes in 'reviewImages router', route is api/review-images/:imageId

#### Plan

- Fetch userId from req.user.id

- Fetch imageId from route parameters

- Fetch the reviewImage using imageId

- If there is no reviewImage with the specified id, return this 404 response:

```json
{
  "message": "Review Image couldn't be found"
}
```

- Use the .destroy method on the reviewImage

- return this json response:

```json
{
  "message": "Successfully deleted"
}
```

#### Setup

```js
router.delete("/:imageId", requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const imageId = req.params.imageId;

        // Get the reviewImage by imageId
        const reviewImage = await ReviewImage.findByPk(imageId);

        if (!reviewImage) {
            return res.status(404).json({ message: "Review Image couldn't be found" });
        }

        // Get the review associated with the reviewImage
        const review = await Review.findByPk(reviewImage.reviewId);

        // Check if the current user is the owner of the review
        if (review.userId !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Use the .destroy method to delete the reviewImage
        await reviewImage.destroy();

        res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
        next(err);
    }
});
```

### ~~Route: Delete a Spot Image~~

#### Notes

- Requires authentication

- Requires authorization

- Goes in 'spotImages router', route is api/spot-images/:imageId

#### Plan

- Fetch userId from req.user.id

- Fetch imageId from route parameters

- Fetch the spotImage using imageId

- If there is no spotImage with the specified id, return this 404 response:

```json
{
  "message": "Successfully deleted"
}
```

- Use the .destroy method on the spotImage

- return this json response:

```json
{
  "message": "Successfully deleted"
}
```

#### Setup

```js
router.delete("/:imageId", requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const imageId = req.params.imageId;

        // Get the spotImage by imageId
        const spotImage = await SpotImage.findByPk(imageId);

        if (!spotImage) {
            return res.status(404).json({ message: "Spot Image couldn't be found" });
        }

        // Get the spot associated with the spotImage
        const spot = await Spot.findByPk(spotImage.spotId);

        // Check if the current user is the owner of the spot
        if (spot.ownerId !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Use the .destroy method to delete the spotImage
        await spotImage.destroy();

        res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
        next(err);
    }
});
```

---

### ~~Route: Delete a Review~~

#### Notes

- This route requires authentication

- This route requires authorization

- Use DELETE method

- route path = api/reviews/:reviewId

#### Plan

- Get userId from req.user.id (from auth workflow)

- Get the reviewId from the request parameters

- Get the review using the reviewId

- If (!review), then send the following 404 error:

```json
{
  "message": "Review couldn't be found"
}
```

- Compare the review's userId to the current user's userId. If they match, the user is authorized. If not, unauthorized.

- Use the .destroy method to delete the review.

- return the following json response:

```json
{
  "message": "Successfully deleted"
}
```

#### Setup

```js
router.delete("/:reviewId", requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const reviewId = req.params.reviewId;

        // Get the review by reviewId
        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review couldn't be found" });
        }

        // Check if the current user is the owner of the review
        if (review.userId !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Use the .destroy method to delete the review
        await review.destroy();

        res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
```

### ~~Route: Edit a Review~~

#### Notes

- Requires authentication

- Requires authorization

- Request method PUT

- Route path: /:reviewId (belongs in Reviews router)

#### Plan

- Get current user's userId using req.user.id

- Get the review's reviewId from route parameters

- Get the review using the reviewId

- If (!review), return the following 404 error:

```json
{
  "message": "Review couldn't be found"
}
```

Otherwise, get the 'review' and 'stars' from the request body.
```js
{review, stars} = req.body
```

- If (review), then set review.review = review.
- IF (stars), then set review.stars = stars.

- then use the .save method to save the changes to review

- finally, send the edited review as a json response in the following format:

```json
{
  "id": 1,
  "userId": 1,
  "spotId": 1,
  "review": "This was an awesome spot!",
  "stars": 5,
  "createdAt": "2021-11-19 20:39:36",
  "updatedAt": "2021-11-20 10:06:40"
}
```

#### Setup

```js
router.put("/:reviewId", requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const reviewId = req.params.reviewId;

        // Get the review by reviewId
        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review couldn't be found" });
        }

        // Check if the current user is the owner of the review
        if (review.userId !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { review: newReview, stars } = req.body;

        // Update the review fields
        if (newReview) review.review = newReview;
        if (stars) review.stars = stars;

        // Save the changes
        await review.save();

        res.status(200).json(review);
    } catch (err) {
        next(err);
    }
});
```

### ~~Route: Add an Image to a Review based on the Review's id~~

#### Notes

- This route requires authentication

- This route requires authorization

- This route belongs in the Reviews router

- The path is: "/:reviewId/images"

#### Plan

- Get the current user's id from req.user.id

- Get the review's reviewId from the route parameters

- Get the review using the review's id

- If the review does not exist, return a 404 error respnose:

```json
{
  "message": "Review couldn't be found"
}
```

- Get the review's userId from the review

- Check if the review already has 10 images (if there are 10 imags with a 'reviewId' matching the review's reviewId). If so, throw the following 403 error:

```js
{
  "message": "Maximum number of images for this resource was reached"
}
```

- Compare the user's id to the Review's userId. If they match, authorized. If not, return a 403 error response

- get the url from the request body:

```json
{
  "url": "image url"
}
```

- create a new ReviewImage using the url

- return the new ReviewImage as a json response

#### Setup

```js
router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const reviewId = req.params.reviewId;

        // Get the review by reviewId
        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review couldn't be found" });
        }

        // Check if the current user is the owner of the review
        if (review.userId !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const imageCount = await ReviewImage.count({ where: { reviewId: reviewId } });

        if (imageCount >= 10) {
            return res.status(403).json({ message: "Maximum number of images for this resource was reached" });
        }


        // Get the url from the request body
        const { url } = req.body;

        // Create a new ReviewImage record
        const newReviewImage = await ReviewImage.create({
            reviewId,
            url
        });

        res.status(201).json(newReviewImage);
    } catch (err) {
        next(err);
    }
});
```

### ~~Route: Get All Reviews by a Spot's id~~

#### Notes

- This route does not require authentication or authorization

- This is a 'spots' route

- Path: spots/:spotId/reviews

#### Plan

- Get spotId from route parameters

- Get the spot from the spotId

- If (!spot) return the following error message:

```js
{
  "message": "Spot couldn't be found"
}
```

- Get all reviews where spotId = spotId

- return the reviews as a JSON object in the following format:

```js
{
  "Reviews": [
    {
      "id": 1,
      "userId": 1,
      "spotId": 1,
      "review": "This was an awesome spot!",
      "stars": 5,
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36" ,
      "User": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith"
      },
      "ReviewImages": [
        {
          "id": 1,
          "url": "image url"
        }
      ],
    }
  ]
}
```

#### Setup

```js
router.get('/:spotId/reviews', async (req, res, next) => {

    try {

        const spotId = req.params.spotId;

        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            res.status(404).json({ message: "Spot couldn't be found" })
        }

        const reviews = await Review.findAll({
            where: {
                spotId: spotId
            }
        });

        res.status(200).json(reviews);

    } catch (err) {
        next(err)
    }
});
```

---

### ~~Route: Delete a Spot~~

#### Notes

- This route requires authentication

- This route requires Authorization (Spot must belong to the current user)

- Route path is /:spotId

- Method is DELETE

- (Consider) Use the findOne method to find the record and the destroy method to delete the record.

#### Plan

1. Get the current user's userId from req.user.id
2. Get the spot's spotId from the route parameters
3. Get the spot from the spotId
4. If there is no spot with the provided spotId, return the following error response:
```js
{
  "message": "Spot couldn't be found"
}
```
5. Get the spot's ownerId from the spot
6. Compare the current user's userId to the spot's ownerId
7. If they match, user is authorized
8. If the user is authorized, delete the spot. For example:
```js
const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        await spot.destroy();
        res.status(200).json({ message: 'Successfully deleted' });
```

#### Setup

```js
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const spotId = req.params.spotId;

        // Get the spot by spotId
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        // Check if the current user is the owner of the spot
        if (spot.ownerId !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Delete the spot
        await spot.destroy();
        res.status(200).json({ message: 'Successfully deleted' });
    } catch (err) {
        next(err);
    }
});
```

### ~~Route: Edit a Spot~~

#### Notes

- This route requires authentication

- This route requires authorization (Spot must belong to the current user)

- Route path is /:spotId

- Method is PUT

#### Plan

1. Get the current user's userId from req.user.id
2. Get the spotId from the route parameters
3. Get the spot from the spotId
4. If there is no spot with the provided spotId, return the following error response:
```js
{
  "message": "Spot couldn't be found"
}
```
5. Get the spot's ownerId from the spot
6. Compare the current user's userId to the spot's ownerId
7. If they match, user is authorized to edit the spot. If they do not, user is not authorized
8. If the user is authorized, get the spot's edited attributes from the request body. The request body may look like this (if all attributes are eited):
```js
{
  "address": "123 Disney Lane",
  "city": "San Francisco",
  "state": "California",
  "country": "United States of America",
  "lat": 37.7645358,
  "lng": -122.4730327,
  "name": "App Academy",
  "description": "Place where web developers are created",
  "price": 123
}
```
9. For each attribute, if there is a new value, replace the old value of that attribute with the new value
10. If the new values pass validations and the spot is successfully edited, return the edited spot as a json response. For example:
```js
{
  "id": 1,
  "ownerId": 1,
  "address": "123 Disney Lane",
  "city": "San Francisco",
  "state": "California",
  "country": "United States of America",
  "lat": 37.7645358,
  "lng": -122.4730327,
  "name": "App Academy",
  "description": "Place where web developers are created",
  "price": 123,
  "createdAt": "2021-11-19 20:39:36",
  "updatedAt": "2021-11-20 10:06:40"
}
```

#### Setup

```js
router.put("/:spotId", requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const spotId = req.params.spotId;

        // Get the spot by spotId
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        // Check if the current user is the owner of the spot
        if (spot.ownerId !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Get the new values from the request body
        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        // Update the spot attributes
        if (address) spot.address = address;
        if (city) spot.city = city;
        if (state) spot.state = state;
        if (country) spot.country = country;
        if (lat) spot.lat = lat;
        if (lng) spot.lng = lng;
        if (name) spot.name = name;
        if (description) spot.description = description;
        if (price) spot.price = price;

        // Save the updated spot
        await spot.save();

        res.json(spot);
    } catch (err) {
        next(err);
    }
});

```

### ~~Route: Add An Image to a Spot Based on the Spot's ID~~

#### Notes

- This route requires authentication

- This route requires authorization (Spot must belong to the current user)

- Route path is /:spotId/images

- ~~I think that this will need to be a spotImages route, as opposed to a Spot route, since we are adding a new record into the spotImages table.~~

- ^^^ WRONG, NO SPOT IMAGES ROUTER. THE route path is /spots/:spotId/images, so this route obviously goes in the spots router.

#### Plan

- ~~Set up 'spotImages' router~~
1. Get the current user's userId from req.user.id
2. Get the spotId from route parameters
3. Get the spot from the spotId
4. If there is no spot with the provided spotId, return the following error response:
```js
{
  "message": "Spot couldn't be found"
}
```
5. Get the spot's ownerId from the spot
6. Compare current user's userId to the spot's ownerId
7. If they match, user is authorized to add an image to the spot. If they do not, the user is not authorized.
8. If the user is authorized, create a new record in spotImages table with the provided request body (url + previewImage) and the corresponding spotId.
```js
{
  "url": "image url",
  "preview": true
}
```
9. Then return the newly-created spotImage as a json response. For example:
```js
{
  "id": 1,
  "url": "image url",
  "preview": true
}
```

#### Setup

```js
router.post("/:spotId/images", requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const spotId = req.params.spotId;

        // Get the spot by spotId
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        // Check if the current user is the owner of the spot
        if (spot.ownerId !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Get the new values from the request body
        const { url, preview } = req.body;

        // Create a new SpotImage record
        const newSpotImage = await SpotImage.create({
            spotId: spotId,
            url,
            preview
        });

        res.status(201).json(newSpotImage);
    } catch (err) {
        next(err);
    }
});
```

### ~~Route: Create A Spot~~

#### Notes

- Recall that '/api/spots' is the default route for the spots router. So if we want to post to '/api/spots' we need only post to '/' in practice.

- This route requires authentication

- Error Handling: Consider adding error-handling to the migration and model files by using constraints and validations, instead of trying to create a new error-handler or create the errors manually in route handler.

#### Plan

1. authenticate user
2. retrieve data from request body, save to variable
3.

#### Setup

```js
router.post("/", requireAuth, async (req, res, next) => {

    try {



    } catch(err) {
        next(err);
    };
});
```
---

### Create Additional SpotImages Seeder

#### Git Setup
    Git branch (check branch)
    git checkout dev
    git checkout -b add-extra-spotImages-seeds

    git add .
    git commit -m "message"
    git push origin add-extra-spotImages-seeds

    git checkout dev
    git merge add-extra-spotImages-seeds

    PR from Github (for push to main)

## Sequelize Files and Commands

Generate Model File:

    npx sequelize-cli model:generate --name <ModelName> --attributes <field1>:<datatype1>,<field2>:<datatype2>,<field3>:<datatype3>

Add a blank migration file

    npx sequelize migration:generate --name <name-of-migration-file>

Add a blank seeder file

    npx sequelize-cli seed:generate --name <name-of-seed-file>

Initialize Sequelize:

    npx sequelize-cli init

Run Migrations:

    npx dotenv sequelize db:migrate'

Un-migrate all migrations

    npx dotenv sequelize-cli db:migrate:undo:all

Run all seeder files

    npx dotenv sequelize-cli db:seed:all

Undo All Seeder Files

    npx dotenv sequelize db:seed:undo:all
