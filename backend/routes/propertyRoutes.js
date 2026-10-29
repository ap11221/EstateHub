const express = require("express");
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
} = require("../controllers/propertyController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { propertyCreateLimiter } = require("../middleware/rateLimit");

router.get("/", getProperties);
router.get("/mine/list", protect, authorize("owner", "admin"), getMyProperties);
router.get("/:id", getPropertyById);
router.post("/", protect, authorize("owner", "admin"), propertyCreateLimiter, upload.array("images", 8), createProperty);
router.put("/:id", protect, upload.array("images", 8), updateProperty);
router.delete("/:id", protect, deleteProperty);

module.exports = router;
