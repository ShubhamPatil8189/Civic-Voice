const express = require("express");
const router = express.Router();
const Eligibility = require("../models/Eligibility"); // make sure the path is correct

// GET all eligibilities
router.get("/", async (req, res) => {
  try {
    const eligibilities = await Eligibility.find();
    res.json(eligibilities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
