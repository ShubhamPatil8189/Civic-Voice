const express = require("express");
const router = express.Router();
const visualController = require("../controllers/visualController");

router.post("/send", visualController.sendGuide);

module.exports = router;
