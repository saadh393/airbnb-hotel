const express = require("express")
const {
  Spot,
  Review,
  SpotImage,
  User,
  Booking,
  ReviewImage
} = require("../../db/models")
const { requireAuth } = require("../../utils/auth")
const router = express.Router()

// Get the spots created by the current user
router.get("/", requireAuth, async (req, res) => {
  // Get the current user's id
  const userId = req.user.id

  let spotLists = await Spot.findAll({
    where: {
      ownerId: userId
    },
    include: [
      {
        model: Review,
        attributes: ["stars"]
      },
      SpotImage
    ]
  })

  if (!spotLists) {
    return res.status(404).json({ message: "No spots found" })
  }

  // Map through each spot, calculate avgRating and fetch previewImage

  spotLists = spotLists.map(spot => {
    const spotData = spot.toJSON()

    const avgRating =
      spotData?.Reviews && spotData.Reviews.length > 0
        ? spotData.Reviews.reduce((acc, review) => acc + review.stars, 0) /
          spotData.Reviews.length
        : 0

    return {
      ...spotData,
      avgRating
    }
  })

  return res.status(200).json(spotLists)
})

// Update the spot information
router.patch("/:id", requireAuth, async (req, res) => {
  const { id } = req.params
  const userId = req.user.id
  const { previewImage, images = [], ...data } = req.body

  const spot = await Spot.findByPk(id)

  if (!spot) {
    return res.status(404).json({ message: "Spot not found" })
  }

  if (spot.ownerId !== userId) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  if (previewImage) {
    // Delete the previous preview image
    await SpotImage.destroy({
      where: {
        spotId: id,
        preview: true
      }
    })
    await SpotImage.create({
      spotId: id,
      url: previewImage,
      preview: true
    })
  }

  for (let imageUrl of images) {
    // Delete the previous images
    await SpotImage.destroy({
      where: {
        spotId: id,
        preview: false
      }
    })

    if (imageUrl) {
      await SpotImage.create({
        spotId: id,
        url: imageUrl,
        preview: false
      })
    }
  }

  await spot.update(data)

  return res.status(200).json(spot)
})

// Delete the spot
router.delete("/:id", requireAuth, async (req, res) => {
  const { id } = req.params
  const userId = req.user.id

  const spot = await Spot.findByPk(id)

  if (!spot) {
    return res.status(404).json({ message: "Spot not found" })
  }

  if (spot.ownerId !== userId) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  await spot.destroy()

  return res.status(204).end()
})

module.exports = router
