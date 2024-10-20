const express = require('express');

const { SpotImage, Spot, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

router.post('/:spotId/images',requireAuth,async(req,res,next)=>{
    
    try{
        const userId = req.user.id;
        const spotId = req.params.spotId;
        const spot = await Spot.findByPk(spotId);
        console.log(spot);
        if(!spot){
            return res.status(404).json({
                message:"Spot couldn't be found"
            })


        }
        if(spot.ownerId !== userId){
            return res.status(403).json({
                message:"Unauthorized"
            })
        }
        const {url,preview} = req.body;
        const newSpotImage = SpotImage.create({
            spotId:spotId,
            url,
            preview

        })
        res.status(201).json(newSpotImage)
    }
    catch(err){
        next(err)
    }

})

module.exports = router;
