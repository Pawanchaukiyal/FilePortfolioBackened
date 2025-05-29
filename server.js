const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { corsOptions } = require("./config/frontCors");
const cors = require("cors");
const path = require("path");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors(corsOptions));

// ✅ Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/auth", require("./routes/user.route"));
app.use("/api/projects", require("./routes/project.route"));
app.use("/api/contact", require("./routes/contact.route"));
app.use("/api/freelance", require("./routes/freelanceProject.route"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
