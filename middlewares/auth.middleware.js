const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

exports.updateFreelancerProfile = async (req, res) => {
  try {
    const { skills, bio, pricePerProject } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        skills,
        bio,
        pricePerProject,
        isFreelancer: true,
      },
      { new: true }
    );

    res.json({ message: "Freelancer profile updated", user: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update freelancer profile" });
  }
};


