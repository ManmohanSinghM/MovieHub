const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }, // Removed required
  rating: { type: Number },      // Removed required
  year: { type: String },
  duration: { type: String },
  poster: { type: String },      // Field for Image
  backdrop: { type: String },    // Field for Image
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: { type: Date, default: Date.now },
});

// Prevent model overwrite error
module.exports = mongoose.models.Movie || mongoose.model('Movie', MovieSchema);