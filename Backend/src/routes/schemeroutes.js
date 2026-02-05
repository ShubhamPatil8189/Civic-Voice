const express = require("express");
const router = express.Router();
const Scheme = require("../models/Scheme"); // make sure the path is correct

// GET all schemes
router.get("/", async (req, res) => {
  try {
    const schemes = await Scheme.find();
    res.json(schemes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
