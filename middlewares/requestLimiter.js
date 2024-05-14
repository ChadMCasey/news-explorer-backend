const { rateLimit } = require("express-rate-limit");

const requestLimiter = rateLimit({
  windowsMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

module.exports = requestLimiter;
