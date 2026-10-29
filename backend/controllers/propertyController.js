const Property = require("../models/Property");
const { uploadManyToCloudinary } = require("../config/cloudinary");

// @desc Get all properties with filters (public - only shows active listings)
// @route GET /api/properties
const getProperties = async (req, res) => {
  try {
    const {
      city,
      propertyType,
      listingType,
      minPrice,
      maxPrice,
      bhk,
      keyword,
      page = 1,
      limit = 9,
      sort = "-createdAt",
    } = req.query;

    const query = { status: "active" };

    if (city) query["address.city"] = { $regex: city, $options: "i" };
    if (propertyType) query.propertyType = propertyType;
    if (listingType) query.listingType = listingType;
    if (bhk) query["housingDetails.bhk"] = Number(bhk);
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { "address.city": { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [properties, total] = await Promise.all([
      Property.find(query).sort(sort).skip(skip).limit(limitNum).populate("owner", "name email phone"),
      Property.countDocuments(query),
    ]);

    res.json({
      properties,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get single property by id (increments views)
// @route GET /api/properties/:id
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("owner", "name email phone");
    if (!property) return res.status(404).json({ message: "Property not found" });
    property.views += 1;
    await property.save();
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: "Property not found" });
  }
};

// @desc Create a property listing (owner/admin)
// @route POST /api/properties
const MAX_LISTINGS_PER_DAY = 10;

const createProperty = async (req, res) => {
  try {
    // Admins are trusted; only throttle owner accounts.
    if (req.user.role === "owner") {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentCount = await Property.countDocuments({ owner: req.user._id, createdAt: { $gte: since } });
      if (recentCount >= MAX_LISTINGS_PER_DAY) {
        return res.status(429).json({
          message: `You've reached the limit of ${MAX_LISTINGS_PER_DAY} new listings per 24 hours. Please try again later or contact support.`,
        });
      }
    }

    const body = { ...req.body };
    body.owner = req.user._id;

    if (req.files && req.files.length > 0) {
      body.images = await uploadManyToCloudinary(req.files);
    }

    // Admin-created listings go live immediately; owner listings need approval
    body.status = req.user.role === "admin" ? "active" : "pending";

    if (typeof body.housingDetails === "string") body.housingDetails = JSON.parse(body.housingDetails);
    if (typeof body.rentalDetails === "string") body.rentalDetails = JSON.parse(body.rentalDetails);
    if (typeof body.address === "string") body.address = JSON.parse(body.address);

    const property = await Property.create(body);
    res.status(201).json(property);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc Update a property (owner of listing or admin)
// @route PUT /api/properties/:id
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    const isOwner = property.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to edit this property" });
    }

    const body = { ...req.body };
    if (typeof body.housingDetails === "string") body.housingDetails = JSON.parse(body.housingDetails);
    if (typeof body.rentalDetails === "string") body.rentalDetails = JSON.parse(body.rentalDetails);
    if (typeof body.address === "string") body.address = JSON.parse(body.address);

    if (req.files && req.files.length > 0) {
      const newUrls = await uploadManyToCloudinary(req.files);
      body.images = [...(property.images || []), ...newUrls];
    }

    // Non-admins editing an already-active listing send it back for re-approval
    if (req.user.role !== "admin") {
      body.status = "pending";
    }

    Object.assign(property, body);
    await property.save();
    res.json(property);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc Delete a property (owner of listing or admin)
// @route DELETE /api/properties/:id
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    const isOwner = property.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this property" });
    }

    await property.deleteOne();
    res.json({ message: "Property removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get properties belonging to logged in owner
// @route GET /api/properties/mine/list
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort("-createdAt");
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
};
