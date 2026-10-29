const mongoose = require("mongoose");
const path = require("path");

let mongoServer = null;

const autoSeedIfNeeded = async () => {
  try {
    const User = require("../models/User");
    const count = await User.countDocuments();
    if (count === 0) {
      console.log("Database empty. Auto-seeding initial demo accounts & listings...");
      const { seedData } = require("../seed/seed");
      await seedData();
      console.log("Auto-seeding completed successfully!");
    }
  } catch (seedErr) {
    console.error("Auto-seed error:", seedErr.message);
  }
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/realestate";

  // Try standard connection first (e.g. MongoDB Atlas or running local mongod)
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    await autoSeedIfNeeded();
    return;
  } catch (err) {
    console.warn(`Could not connect to external MongoDB at ${uri} (${err.message}).`);
    console.log("Starting embedded local MongoDB instance (MongoMemoryServer)...");
  }

  // Fallback: embedded MongoMemoryServer
  try {
    const { MongoMemoryServer } = require("mongodb-memory-server");
    mongoServer = await MongoMemoryServer.create();
    const memUri = mongoServer.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`Embedded MongoDB connected successfully at ${memUri}`);
    await autoSeedIfNeeded();
  } catch (fatalErr) {
    console.error(`Fatal: Failed to connect to any MongoDB instance: ${fatalErr.message}`);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  if (mongoServer) await mongoServer.stop();
  process.exit(0);
});

module.exports = connectDB;
