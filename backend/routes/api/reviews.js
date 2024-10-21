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

module.exports = router;
