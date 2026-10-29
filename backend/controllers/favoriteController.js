const Favorite = require("../models/Favorite");

// @desc Get logged in user's favorite properties
// @route GET /api/favorites
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).populate({
      path: "property",
      populate: { path: "owner", select: "name email phone" },
    });
    res.json(favorites.filter((f) => f.property)); // filter out deleted properties
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Add a property to favorites
// @route POST /api/favorites/:propertyId
const addFavorite = async (req, res) => {
  try {
    const existing = await Favorite.findOne({ user: req.user._id, property: req.params.propertyId });
    if (existing) return res.status(400).json({ message: "Already in favorites" });

    const favorite = await Favorite.create({ user: req.user._id, property: req.params.propertyId });
    res.status(201).json(favorite);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc Remove a property from favorites
// @route DELETE /api/favorites/:propertyId
const removeFavorite = async (req, res) => {
  try {
    await Favorite.findOneAndDelete({ user: req.user._id, property: req.params.propertyId });
    res.json({ message: "Removed from favorites" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite };
