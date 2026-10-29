const rateLimit = require("express-rate-limit");

// Limits registration/login attempts per IP — slows down mass fake-account
// creation and brute-force login attempts without affecting normal users.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in a few minutes." },
});

// Limits how many new property listings a single IP can submit in a short
// window — catches scripted/bulk spam listing attempts.
const propertyCreateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15, // 15 listing submissions per IP per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many listings submitted recently. Please try again later." },
});

// Limits how many contact-owner inquiries a single IP can send — prevents
// the inquiry form being used to spam property owners.
const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many messages sent recently. Please try again later." },
});

module.exports = { authLimiter, propertyCreateLimiter, inquiryLimiter };
