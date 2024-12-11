const express = require("express");
const {
  Spot,
  Review,
  SpotImage,
  User,
  Booking,
  ReviewImage,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const router = express.Router();

// Get the spots created by the current user
router.get("/", requireAuth, async (req, res) => {
  // Get the current user's id
  const userId = req.user.id;

  const spotLists = await Spot.findAll({
    where: {
      ownerId: userId,
    },
    include: [
      {
        model: Review,
        include: [ReviewImage, User],
      },
      SpotImage,
    ],
  });

  if (!spotLists) {
    return res.status(404).json({ message: "No spots found" });
  }

  return res.status(200).json(spotLists);
});

// Update the spot information
router.patch("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { ...data } = req.body;

  const spot = await Spot.findByPk(id);

  if (!spot) {
    return res.status(404).json({ message: "Spot not found" });
  }

  if (spot.ownerId !== userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  await spot.update(data);

  return res.status(200).json(spot);
});

// Delete the spot
router.delete("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const spot = await Spot.findByPk(id);

  if (!spot) {
    return res.status(404).json({ message: "Spot not found" });
  }

  if (spot.ownerId !== userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  await spot.destroy();

  return res.status(204).end();
});

module.exports = router;
