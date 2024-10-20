const express = require('express');

const { spotImage, Spot, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

router.post('/:spotId/images',requireAuth,async(req,res,next)=>{
    
    try{
        const userId = req.user.id;
        const spotId = req.params.spotId;
        const spot = await Spot.findByPk(spotId);
        if(!spot){
            return res.status(404).json({
                message:"Spot couldn't be found"
            })
        }
        
    }
    catch(err){
        next(err)
    }

})

module.exports = router;
