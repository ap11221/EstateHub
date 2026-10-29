const Inquiry = require("../models/Inquiry");
const Property = require("../models/Property");

// @desc Send an inquiry / contact owner about a property
// @route POST /api/inquiries/:propertyId
const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const property = await Property.findById(req.params.propertyId);
    if (!property) return res.status(404).json({ message: "Property not found" });

    const inquiry = await Inquiry.create({
      property: property._id,
      owner: property.owner,
      fromUser: req.user._id,
      name,
      email,
      phone,
      message,
    });

    res.status(201).json(inquiry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc Get inquiries received for owner's properties
// @route GET /api/inquiries/received
const getReceivedInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ owner: req.user._id })
      .populate("property", "title address")
      .sort("-createdAt");
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update inquiry status (owner/admin)
// @route PUT /api/inquiries/:id
const updateInquiryStatus = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    const isOwner = inquiry.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    inquiry.status = req.body.status || inquiry.status;
    await inquiry.save();
    res.json(inquiry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { createInquiry, getReceivedInquiries, updateInquiryStatus };
