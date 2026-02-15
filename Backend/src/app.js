const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

const app = express();

/* ------------------ MIDDLEWARES ------------------ */

// CORS (VERY IMPORTANT for frontend connection)
app.use(
  cors({
    origin: "http://localhost:8080",   // frontend port
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session (login will work properly now)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "civic-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,        // true only on https
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);

// Public folder (images/audio)
app.use("/public", express.static(path.join(__dirname, "public")));


/* ------------------ ROUTES ------------------ */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/visual", require("./routes/visualRoutes"));
app.use("/api/session", require("./routes/sessionroutes"));
app.use("/api/conversation", require("./routes/conversationsroutes"));
app.use("/api/eligibility", require("./routes/eligibilityroutes"));
app.use("/api/scheme", require("./routes/schemeroutes"));
app.use("/api/voice", require("./routes/Voiceroutes"));
app.use("/api/stories", require("./routes/storyRoutes"));

/* ------------------ TEST ROUTE ------------------ */

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Civic Voice Backend Running 🚀",
  });
});

/* ------------------ ERROR HANDLING ------------------ */

app.use(require("./middleware/notFound"));
app.use(require("./middleware/errorHandler"));

module.exports = app;
