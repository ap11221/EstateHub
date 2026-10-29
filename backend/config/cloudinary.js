const cloudinary = require("cloudinary").v2;

const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== "your_cloud_name";

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Uploads a single in-memory file buffer (from multer memoryStorage) to Cloudinary.
// Returns the secure HTTPS URL to store on the Property document.
const uploadBufferToCloudinary = (file, folder = "nestfind") => {
  const buffer = file.buffer || file;
  const mimetype = file.mimetype || "image/jpeg";

  if (!isCloudinaryConfigured) {
    // Graceful offline fallback: convert buffer to inline base64 Data URL
    return Promise.resolve(`data:${mimetype};base64,${buffer.toString("base64")}`);
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

// Uploads several files in parallel and returns an array of URLs.
const uploadManyToCloudinary = async (files = [], folder = "nestfind") => {
  return Promise.all(files.map((f) => uploadBufferToCloudinary(f, folder)));
};

module.exports = { cloudinary, uploadBufferToCloudinary, uploadManyToCloudinary };
