import mongoose from "mongoose";
import dotenv from "dotenv";
import Step from "../models/Step.js";
import Scheme from "../models/Scheme.js"; // assuming you already have Scheme model
import stepsData from "./steps.json" assert { type: "json" };

dotenv.config();

const seedSteps = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Clear existing steps
    await Step.deleteMany();

    for (const step of stepsData) {
      // Find the scheme ID by some identifier (e.g., schemeId from JSON)
      const scheme = await Scheme.findById(step.schemeId);
      if (!scheme) continue;

      await Step.create({
        schemeId: scheme._id,
        stepNumber: step.stepNumber,
        title: step.title,
        action: step.action,
        location: step.location,
        why: step.why,
        estimatedTime: step.estimatedTime
      });
    }

    console.log("Steps seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedSteps();
