const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/public", express.static(path.join(__dirname, "public")));

// ✅ ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/visual", require("./routes/visualRoutes"));
// ✅ ROUTES
app.use("/api/session", require("./routes/sessionroutes"));
app.use("/api/conversation", require("./routes/conversationsroutes"));
//app.use("/api/eligibility", require("./routes/eligibilityroutes"));
app.use("/api/eligibility", require("./routes/eligibilityroutes"));
app.use("/api/scheme", require("./routes/schemeroutes"));
app.use("/api/voice", require("./routes/Voiceroutes"));

// ✅ ADD STORY ROUTES HERE
app.use("/api/stories", require("./routes/storyRoutes"));

// ✅ MIDDLEWARES
app.use(require("./middleware/notFound"));
app.use(require("./middleware/errorHandler"));

module.exports = app;

