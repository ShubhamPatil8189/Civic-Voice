require("dotenv").config();
const mongoose = require("mongoose");

async function testConnection() {
    console.log("🔍 Testing MongoDB Connection...\n");

    const mongoURI = process.env.MONGO_URI;
    const localURI = process.env.MONGO_LOCAL_URI;

    console.log("Cloud URI:", mongoURI ? mongoURI.substring(0, 30) + "..." : "NOT SET");
    console.log("Local URI:", localURI || "NOT SET");
    console.log("\n");

    // Try Cloud First
    console.log("📡 Attempting Cloud Connection (Atlas)...");
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // 5 second timeout
        });
        console.log("✅ Cloud MongoDB Connected!");
        process.exit(0);
    } catch (cloudErr) {
        console.error("❌ Cloud Connection Failed:", cloudErr.message);

        // Try Local Fallback
        if (localURI) {
            console.log("\n📍 Attempting Local Connection (localhost)...");
            try {
                await mongoose.connect(localURI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    serverSelectionTimeoutMS: 3000,
                });
                console.log("✅ Local MongoDB Connected!");
                console.log("\n💡 TIP: Update server.js to use MONGO_LOCAL_URI for development");
                process.exit(0);
            } catch (localErr) {
                console.error("❌ Local Connection Failed:", localErr.message);
            }
        }

        console.log("\n🛠️ TROUBLESHOOTING STEPS:");
        console.log("1. Check your internet connection");
        console.log("2. Verify MongoDB Atlas cluster is active (not paused)");
        console.log("3. Check IP Whitelist in MongoDB Atlas (add 0.0.0.0/0 for testing)");
        console.log("4. Or use local MongoDB: change MONGO_URI to MONGO_LOCAL_URI in server.js");
        process.exit(1);
    }
}

testConnection();
