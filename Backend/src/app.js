const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ ROUTES
app.use("/api/session", require("./routes/sessionroutes"));
app.use("/api/conversation", require("./routes/conversationsroutes"));
//app.use("/api/eligibility", require("./routes/eligibilityroutes"));
app.use("/api/eligibility", require("./routes/eligibilityroutes"));
app.use("/api/scheme", require("./routes/schemeroutes"));
app.use("/api/voice", require("./routes/Voiceroutes"));

// ✅ MIDDLEWARES
app.use(require("./middleware/notFound"));
app.use(require("./middleware/errorHandler"));

module.exports = app;
