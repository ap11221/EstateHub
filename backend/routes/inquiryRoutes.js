const express = require("express");
const router = express.Router();
const { createInquiry, getReceivedInquiries, updateInquiryStatus } = require("../controllers/inquiryController");
const { protect, authorize } = require("../middleware/auth");
const { inquiryLimiter } = require("../middleware/rateLimit");

router.post("/:propertyId", protect, inquiryLimiter, createInquiry);
router.get("/received", protect, authorize("owner", "admin"), getReceivedInquiries);
router.put("/:id", protect, authorize("owner", "admin"), updateInquiryStatus);

module.exports = router;
