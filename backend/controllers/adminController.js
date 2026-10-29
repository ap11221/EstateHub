const Property = require("../models/Property");
const User = require("../models/User");
const Inquiry = require("../models/Inquiry");

// @desc Dashboard stats
// @route GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [totalProperties, activeProperties, pendingProperties, totalUsers, totalOwners, totalInquiries, rentCount, saleCount] =
      await Promise.all([
        Property.countDocuments(),
        Property.countDocuments({ status: "active" }),
        Property.countDocuments({ status: "pending" }),
        User.countDocuments({ role: "user" }),
        User.countDocuments({ role: "owner" }),
        Inquiry.countDocuments(),
        Property.countDocuments({ listingType: "Rent" }),
        Property.countDocuments({ listingType: "Sale" }),
      ]);

    res.json({
      totalProperties,
      activeProperties,
      pendingProperties,
      totalUsers,
      totalOwners,
      totalInquiries,
      rentCount,
      saleCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get ALL properties (any status) for admin management
// @route GET /api/admin/properties
const getAllPropertiesAdmin = async (req, res) => {
  try {
    const { status, propertyType, listingType, keyword } = req.query;
    const query = {};
    if (status) query.status = status;
    if (propertyType) query.propertyType = propertyType;
    if (listingType) query.listingType = listingType;
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { "address.city": { $regex: keyword, $options: "i" } },
      ];
    }
    const properties = await Property.find(query).populate("owner", "name email phone").sort("-createdAt");
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update property status (approve/reject/rented/sold) - admin only
// @route PUT /api/admin/properties/:id/status
const updatePropertyStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    property.status = status;
    await property.save();
    res.json(property);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc Admin updates rent/price + rental & housing details directly
// @route PUT /api/admin/properties/:id/details
const updatePropertyDetailsAdmin = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    const { price, rentalDetails, housingDetails } = req.body;

    if (price !== undefined) property.price = price;
    if (rentalDetails) property.rentalDetails = { ...property.rentalDetails.toObject(), ...rentalDetails };
    if (housingDetails) property.housingDetails = { ...property.housingDetails.toObject(), ...housingDetails };

    await property.save();
    res.json(property);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc Get all users - admin only
// @route GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort("-createdAt");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Block/unblock a user - admin only
// @route PUT /api/admin/users/:id/block
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(400).json({ message: "Cannot block an admin" });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ message: `User ${user.isBlocked ? "blocked" : "unblocked"}`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all inquiries - admin only
// @route GET /api/admin/inquiries
const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate("property", "title address")
      .populate("fromUser", "name email")
      .sort("-createdAt");
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Reset all demo data (users, properties, inquiries) - admin only
// @route POST /api/admin/reset-demo-data
const resetDemoData = async (req, res) => {
  try {
    const { seedData } = require("../seed/seed");
    await seedData();
    res.json({ message: "Demo data reset successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getStats,
  getAllPropertiesAdmin,
  updatePropertyStatus,
  updatePropertyDetailsAdmin,
  getAllUsers,
  toggleBlockUser,
  getAllInquiries,
  resetDemoData,
};

