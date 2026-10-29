// Seeds an admin user, an owner, a regular user, and sample properties.
// Run with: npm run seed  (make sure your .env / MONGO_URI is set first)
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const connectDB = require("../config/db");
const User = require("../models/User");
const Property = require("../models/Property");

const seedData = async () => {
  console.log("Clearing existing data...");
  await User.deleteMany();
  await Property.deleteMany();

  console.log("Creating users...");
  const admin = await User.create({
    name: "Admin",
    email: "admin@realestate.com",
    password: "admin123",
    role: "admin",
  });

  const owner = await User.create({
    name: "Rahul Sharma",
    email: "owner@realestate.com",
    password: "owner123",
    role: "owner",
    phone: "9876543210",
  });

  const user = await User.create({
    name: "Priya Verma",
    email: "user@realestate.com",
    password: "user123",
    role: "user",
    phone: "9123456780",
  });

  console.log("Creating sample properties with high quality photos...");
  const sampleProperties = [
    {
      title: "Spacious 3BHK Flat in Sector 62",
      description: "A well-ventilated 3BHK flat close to the metro station with modern amenities, 24/7 security, club house access, and spacious balconies.",
      propertyType: "Flat",
      listingType: "Rent",
      price: 28000,
      rentalDetails: { deposit: 84000, leaseTermMonths: 11, maintenanceCharges: 1500, furnishing: "Semi-Furnished" },
      housingDetails: { bhk: 3, bathrooms: 2, areaSqft: 1450, floor: "4th", totalFloors: 12, amenities: ["Lift", "Parking", "Power Backup", "Gym"] },
      address: { street: "Sector 62", city: "Noida", state: "Uttar Pradesh", pincode: "201301" },
      images: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80",
      ],
      owner: owner._id,
      status: "active",
    },
    {
      title: "Luxury Independent Bungalow with Garden",
      description: "4BHK bungalow with a private landscaped garden, modular kitchen, servant quarters, and covered parking for 3 cars in a prime residential locality.",
      propertyType: "Bungalow",
      listingType: "Sale",
      price: 18500000,
      rentalDetails: {},
      housingDetails: { bhk: 4, bathrooms: 4, areaSqft: 3200, floor: "Ground+1", totalFloors: 2, amenities: ["Garden", "Parking", "Servant Room", "Security"] },
      address: { street: "Civil Lines", city: "Agra", state: "Uttar Pradesh", pincode: "282002" },
      images: [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
      ],
      owner: owner._id,
      status: "active",
    },
    {
      title: "Cozy 2BHK House near City Center",
      description: "Affordable 2BHK independent house, perfect for small families, close to reputed schools, transit hubs, and daily markets.",
      propertyType: "House",
      listingType: "Rent",
      price: 15000,
      rentalDetails: { deposit: 30000, leaseTermMonths: 11, maintenanceCharges: 500, furnishing: "Unfurnished" },
      housingDetails: { bhk: 2, bathrooms: 2, areaSqft: 900, floor: "1st", totalFloors: 2, amenities: ["Parking", "Water Supply"] },
      address: { street: "MG Road", city: "Agra", state: "Uttar Pradesh", pincode: "282001" },
      images: [
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&auto=format&fit=crop&q=80",
      ],
      owner: owner._id,
      status: "active",
    },
    {
      title: "Modern 1BHK Studio Apartment",
      description: "Compact and modern 1BHK studio ideal for working professionals, walking distance to IT park and shopping centers.",
      propertyType: "Apartment",
      listingType: "Rent",
      price: 12000,
      rentalDetails: { deposit: 24000, leaseTermMonths: 11, maintenanceCharges: 800, furnishing: "Fully-Furnished" },
      housingDetails: { bhk: 1, bathrooms: 1, areaSqft: 550, floor: "6th", totalFloors: 10, amenities: ["Lift", "Wifi", "Security"] },
      address: { street: "Cyber City", city: "Gurugram", state: "Haryana", pincode: "122002" },
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80",
      ],
      owner: owner._id,
      status: "pending",
    },
    {
      title: "Elegant 5BHK Villa with Swimming Pool",
      description: "Premium villa with a private temperature-controlled pool, home theatre, rooftop deck, and landscaped lawn in an exclusive gated community.",
      propertyType: "Villa",
      listingType: "Sale",
      price: 45000000,
      rentalDetails: {},
      housingDetails: { bhk: 5, bathrooms: 5, areaSqft: 5200, floor: "Ground+2", totalFloors: 3, amenities: ["Swimming Pool", "Home Theatre", "Garden", "Clubhouse"] },
      address: { street: "Golf Course Road", city: "Gurugram", state: "Haryana", pincode: "122001" },
      images: [
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80",
      ],
      owner: owner._id,
      status: "active",
    },
  ];

  await Property.insertMany(sampleProperties);

  console.log("\nSeed complete!\n");
  console.log("Login credentials:");
  console.log("  Admin  -> admin@realestate.com / admin123");
  console.log("  Owner  -> owner@realestate.com / owner123");
  console.log("  User   -> user@realestate.com / user123\n");
};

const run = async () => {
  await connectDB();
  await seedData();
  process.exit(0);
};

if (require.main === module) {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { seedData };
