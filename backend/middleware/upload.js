const multer = require("multer");

// Use memory storage — files are held as buffers and streamed straight to
// Cloudinary (see config/cloudinary.js). Nothing is written to local disk,
// which matters because most hosting platforms (Render, Railway, Heroku, etc.)
// wipe local disk storage on every restart/redeploy.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ok = allowed.test(file.mimetype);
  if (ok) cb(null, true);
  else cb(new Error("Only image files (jpg, jpeg, png, webp) are allowed"));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = upload;
