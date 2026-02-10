require('dotenv').config();
const mongoose = require('mongoose');

// 1. Define how your "Scheme" looks (must match your Atlas collection name)
const Scheme = mongoose.model('Scheme', new mongoose.Schema({
    title: String,
    description: String
}, { collection: 'schemes' })); // This matches your screenshot

async function runTest() {
    try {
        // 2. Connect using your URI
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Atlas...");

        // 3. Create a dummy piece of data
        const testData = new Scheme({
            title: "Test Scheme",
            description: "If I see this in Atlas, my code works!"
        });

        // 4. Save it to the database
        await testData.save();
        console.log("✅ SUCCESS! Check your Atlas dashboard now.");

    } catch (err) {
        console.error("❌ ERROR:", err.message);
    } finally {
        mongoose.connection.close();
    }
}

runTest();