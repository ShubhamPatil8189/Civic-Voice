require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app"); // Import the fully configured app

const PORT = process.env.PORT || 5000;

/* ----------- MONGODB CONNECTION ----------- */
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not found in .env file");
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected Successfully");

    // Start Server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 API Endpoints available at /api/...`);
    });

  } catch (error) {
    console.error("❌ Failed to connect MongoDB");
    console.error(error.message);
    process.exit(1);
  }
};

startServer();