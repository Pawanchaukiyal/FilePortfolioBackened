const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { corsOptions } = require("./config/frontCors");
const cors = require("cors");
const path = require("path");

dotenv.config(); // Load env variables
connectDB(); // MongoDB connection

const app = express();

// Middleware
app.use(express.json()); // Parse JSON
app.use(cors(corsOptions)); // Handle CORS

// ✅ Serve static files (if any file uploads needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes
app.use("/api/auth", require("./routes/user.route"));
app.use("/api/projects", require("./routes/project.route"));
app.use("/api/contact", require("./routes/contact.route"));
app.use("/api/freelance", require("./routes/freelanceProject.route"));
app.use("/api/freelancer", require("./routes/freelancer.route")); // ✅ Add this line

// ✅ Server Startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
