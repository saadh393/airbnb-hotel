const express = require('express');

const { Review, ReviewImage, SpotImage, Spot, User, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');
const router = express.Router();

//! Get All Reviews of Current User

router.get('/current', requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Get all reviews of the current user with associated User, Spot, ReviewImage, and SpotImage
        const reviews = await Review.findAll({

            where: { userId: userId },

            include: [
                { model: User, attributes: ['id', 'firstName', 'lastName'] },
                {
                    model: Spot,
                    attributes: [
                        'id', 'ownerId', 'address', 'city', 'state', 'country',
                        'lat', 'lng', 'name', 'price'
                    ],
                    include: [
                        { model: SpotImage, attributes: ['url'], limit: 1 }
                    ]
                },
                { model: ReviewImage, attributes: ['id', 'url'] }
            ]
        });

        const reviewList = reviews.map(review => {

            const reviewData = review.toJSON();

            const previewImage = reviewData.Spot && reviewData.Spot.SpotImages.length > 0
            ? reviewData.Spot.SpotImages[0].url
            : null;

            if (reviewData.Spot) reviewData.Spot.previewImage = previewImage;
            if (reviewData.Spot) delete reviewData.Spot.SpotImages;

            return reviewData;
        });

        res.status(200).json({ Reviews: reviewList });
    } catch (err) {
        next(err);
    }
});

//! Add an image to a review by a review ID

router.post('/:reviewId/images',requireAuth,async(req,res,next)=>{
    try{
        const reviewId = req.params.reviewId;

        const userId = req.user.id;

        // const review = await Review.findByPk(reviewId);

        const review = await Review.findOne({
            where: {
                id: reviewId
            }
        })

        if(!review){
            return res.status(404).json({
                message:"Review couldn't be found"
            })
        }
        if(review.userId !== userId){
            return res.status(403).json({
                message:"Unauthorized"
            })
        }
        const imageCount  = await ReviewImage.count({where:{
            reviewId:reviewId
        }})

        if(imageCount>=10){
            return res.status(403).json({
                message:"Maximum number of images for this resource was reached"
            })
        }

        const {url} = req.body;

        const newReviewImage = await ReviewImage.create({
            reviewId,
            url
        })

        res.status(201).json(newReviewImage);
    }
    catch(err){
        next(err)
    }
})

//! Edit a Review

const validateReviewR = [
    check('review').notEmpty().withMessage('Review text is required'),
    check('stars').isInt({ min: 1, max: 5 }).withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors // Middleware for validation error handling
];

router.put('/:reviewId', requireAuth, validateReviewR, async(req, res, next) => {
    try{
        const reviewId = req.params.reviewId;
        const userId = req.user.id;

        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({
                message:"Review couldn't be found"
            })
        }

        if (review.userId !== userId) {
            return res.status(403).json({
                message:"Unauthorized"
            })
        }

        const { review: newReview, stars } = req.body;

        if (newReview) {
            review.review = newReview;
        }

        if (stars) {
            review.stars = stars
        }

        await review.save();

        res.status(200).json(review)
    }
    catch(err){
        next(err)
    }
})

//! Delete A Review

router.delete("/:reviewId", requireAuth, async (req, res, next) => {

    try {

        const userId = req.user.id;
        const reviewId = req.params.reviewId;

        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review couldn't be found" });
        };

        if (review.userId !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        };

        await ReviewImage.destroy({ where: { reviewId: reviewId } });

        await review.destroy();

        res.status(200).json({ message: "Successfully deleted" });

    } catch(err) {
        next(err)
    }
})

module.exports = router;
