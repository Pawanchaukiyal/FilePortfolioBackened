const Freelancer = require('../models/freelancer.model');

// Create or update freelancer profile
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { skills, bio, experience, portfolioLinks } = req.body;
    const userId = req.user.id;

    let profile = await Freelancer.findOne({ user: userId });

    if (profile) {
      // Update existing profile
      profile.skills = skills || profile.skills;
      profile.bio = bio || profile.bio;
      profile.experience = experience || profile.experience;
      profile.portfolioLinks = portfolioLinks || profile.portfolioLinks;
    } else {
      // Create new profile
      profile = new Freelancer({
        user: userId,
        skills,
        bio,
        experience,
        portfolioLinks
      });
    }

    await profile.save();
    res.status(200).json({ message: 'Profile saved successfully', profile });
  } catch (err) {
    res.status(500).json({ error: 'Error saving profile', details: err.message });
  }
};

// Get freelancer profile by user ID
exports.getProfileByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const profile = await Freelancer.findOne({ user: userId }).populate('user', 'name email');

    if (!profile) {
      return res.status(404).json({ message: 'Freelancer profile not found' });
    }

    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching profile', details: err.message });
  }
};


exports.getAllFreelancers = async (req, res) => {
  try {
    const freelancers = await Freelancer.find().populate('user', 'name email');
    res.status(200).json(freelancers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch freelancers' });
  }
};


exports.searchFreelancers = async (req, res) => {
  try {
    const { skill, minExperience, minRating } = req.query;
    const query = {};

    if (skill) query.skills = skill;
    if (minExperience) query.experience = { $gte: parseInt(minExperience) };
    if (minRating) query.rating = { $gte: parseFloat(minRating) };

    const freelancers = await Freelancer.find(query).populate('user', 'name email');
    res.status(200).json(freelancers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search freelancers' });
  }
};
