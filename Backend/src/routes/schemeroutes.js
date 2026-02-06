

const express = require("express");
const router = express.Router();
const { getSchemes } = require("../controllers/schemeController");

// GET schemes?keyword=xxx&language=en
router.get("/", getSchemes);

module.exports = router;
