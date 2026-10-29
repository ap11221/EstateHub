const express = require("express");
const router = express.Router();
const {
  getStats,
  getAllPropertiesAdmin,
  updatePropertyStatus,
  updatePropertyDetailsAdmin,
  getAllUsers,
  toggleBlockUser,
  getAllInquiries,
  resetDemoData,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("admin"));

router.get("/stats", getStats);
router.post("/reset-demo-data", resetDemoData);
router.get("/properties", getAllPropertiesAdmin);
router.put("/properties/:id/status", updatePropertyStatus);
router.put("/properties/:id/details", updatePropertyDetailsAdmin);
router.get("/users", getAllUsers);
router.put("/users/:id/block", toggleBlockUser);
router.get("/inquiries", getAllInquiries);

module.exports = router;
