import express from "express";
import Scheme from "../models/Scheme.js";
import Step from "../models/Step.js";

const router = express.Router();

// Get scheme details with steps
router.get("/:id", async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ message: "Scheme not found" });

    const steps = await Step.find({ schemeId: scheme._id }).sort({ stepNumber: 1 });

    res.json({
      ...scheme._doc,
      steps
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

export default router;
