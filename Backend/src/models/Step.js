import mongoose from "mongoose";

const StepSchema = new mongoose.Schema({
  schemeId: { type: mongoose.Schema.Types.ObjectId, ref: "Scheme", required: true },
  stepNumber: { type: Number, required: true },
  title: { type: String, required: true },
  action: { type: String, required: true },
  location: { type: String },
  why: { type: String },
  estimatedTime: { type: String }
});

const Step = mongoose.model("Step", StepSchema);
export default Step;
