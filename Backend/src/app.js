const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

const app = express();

/* ======================================================
   CORS CONFIGURATION  (MOST IMPORTANT PART)
   Allows ANY localhost port (8080, 8081, 5173, etc)
====================================================== */

const corsOptions = {
  origin: function (origin, callback) {

    // Allow Postman / mobile apps / direct server calls
    if (!origin) return callback(null, true);

    // Allow any localhost or 127.0.0.1 port
    if (
      origin.startsWith("http://localhost") ||
      origin.startsWith("http://127.0.0.1")
    ) {
      return callback(null, true);
    }

    // Otherwise block
    return callback(new Error("CORS blocked: " + origin));
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS
app.use(cors(corsOptions));

// VERY IMPORTANT — handle preflight requests
app.options("*", cors(corsOptions));

/* ======================================================
   BODY PARSER
====================================================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================================================
   SESSION CONFIG (You are NOT using JWT)
====================================================== */

app.use(
  session({
    name: "civic.sid",
    secret: process.env.SESSION_SECRET || "civic-secret-key",
    resave: false,
    saveUninitialized: false,

    cookie: {
      secure: false,       // must be false for localhost
      httpOnly: true,
      sameSite: "lax",     // allows frontend requests
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

/* ======================================================
   STATIC PUBLIC FOLDER
====================================================== */
app.use("/public", express.static(path.join(__dirname, "public")));

/* ======================================================
   ROUTES
====================================================== */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/visual", require("./routes/visualRoutes"));
app.use("/api/session", require("./routes/sessionroutes"));
app.use("/api/conversation", require("./routes/conversationsroutes"));
app.use("/api/eligibility", require("./routes/eligibilityroutes"));
app.use("/api/scheme", require("./routes/schemeroutes"));
app.use("/api/voice", require("./routes/Voiceroutes"));
app.use("/api/stories", require("./routes/storyRoutes"));

/* ======================================================
   TEST ROUTE
====================================================== */

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Civic Voice Backend Running 🚀",
    session: req.sessionID,
  });
});

/* ======================================================
   ERROR HANDLING
====================================================== */

app.use(require("./middleware/notFound"));
app.use(require("./middleware/errorHandler"));

module.exports = app;
