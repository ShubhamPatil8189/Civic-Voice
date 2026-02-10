const express = require("express");
const router = express.Router();

// Example route
router.get("/", (req, res) => {
  res.json({ message: "Route works!" });
});

// Export router correctly
module.exports = router;
