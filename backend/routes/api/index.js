// backend/routes/api/index.js

//! This is where we will ultimately set up all of our routers (routes/api/index)

const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const manageRouter = require("./manage.js");
const spotsRouter = require("./spots.js");
const spotImagesRouter = require("./spotImages.js");
const reviewsRouter = require("./reviews.js");
const reviewImagesRouter = require("./reviewImages.js");

const { restoreUser, requireAuth } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null

router.use(restoreUser);

//! Other middlewares need to come AFTER the restoreUser middleware

// router.get('/test', requireAuth, (req, res) => {
//   res.json({ message: 'success' }); // route for testing whether we are logged in or not
// });

router.use("/session", sessionRouter);

router.use("/users", usersRouter);

router.use("/spots", spotsRouter); //! Spots router

router.use("/manage", manageRouter);

router.use("/spot-images", spotImagesRouter);

router.use("/reviews", reviewsRouter);

router.use("/review-images", reviewImagesRouter);

// router.post('/test', (req, res) => { // route for testing POST requests
//   res.json({ requestBody: req.body });
// });

module.exports = router;
