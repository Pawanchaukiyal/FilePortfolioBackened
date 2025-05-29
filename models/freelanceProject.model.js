const mongoose = require('mongoose');

const freelanceProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['All', 'Android Design', 'Website Design', 'System Design', 'Hardware Design', 'Software Design'], default: 'All' },
  budget: { type: Number },
  email: { type: String, required: true },
  fileUrl: { type: String }, // Cloudinary file URL
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FreelanceProject', freelanceProjectSchema);
