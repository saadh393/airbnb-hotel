const express = require('express');

const { Review, ReviewImage, Spot, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

//! Get All Reviews of Current User

router.get('/current', requireAuth, async (req, res, next) => {

    try {

        let id = req.user.id;

        let reviews = await Review.findAll({

            where: {
                userId: id
            }
        })

        res.json({Reviews: reviews})

    } catch(err) {
        next(err);
    };
})

//! Add an image to a review by a review ID

router.post('/:reviewId/images',requireAuth,async(req,res,next)=>{
    try{
        const reviewId = req.params.reviewId;
        const userId = req.user.id;
        const review = await Review.findByPk(reviewId);
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

router.put('/:reviewId',requireAuth,async(req,res,next)=>{
    try{
        const reviewId = req.params.reviewId;
        const userId = req.user.id;

        const review = await Review.findByPk(reviewId);
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
        const {review:newReview,stars} = req.body;
        if(newReview){
            review.review = newReview;
        }
        if(stars){
            review.stars = stars
        }
        await review.save();
        res.status(201).json(review)
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

        await review.destroy();

        res.status(200).json({ message: "Successfully deleted" });

    } catch(err) {
        next(err)
    }
})

module.exports = router;
