const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    propertyType: {
      type: String,
      enum: ["Flat", "Bungalow", "House", "Villa", "Plot", "Apartment"],
      required: true,
    },
    listingType: { type: String, enum: ["Sale", "Rent"], required: true },

    price: { type: Number, required: true },

    rentalDetails: {
      deposit: { type: Number, default: 0 },
      leaseTermMonths: { type: Number, default: 0 },
      maintenanceCharges: { type: Number, default: 0 },
      availableFrom: { type: Date },
      furnishing: {
        type: String,
        enum: ["Unfurnished", "Semi-Furnished", "Fully-Furnished"],
        default: "Unfurnished",
      },
    },

    housingDetails: {
      bhk: { type: Number, default: 1 },
      bathrooms: { type: Number, default: 1 },
      areaSqft: { type: Number, required: true },
      floor: { type: String, default: "" },
      totalFloors: { type: Number, default: 0 },
      amenities: [{ type: String }],
    },

    address: {
      street: { type: String, default: "" },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, default: "" },
    },

    images: [{ type: String }],

    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    status: { type: String, enum: ["pending", "active", "rejected", "rented", "sold"], default: "pending" },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

propertySchema.index({ title: "text", description: "text", "address.city": "text" });

module.exports = mongoose.model("Property", propertySchema);
