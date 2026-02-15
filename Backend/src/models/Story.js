const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  schemeId: {
  type: String,  // CHANGE TO STRING
  ref: 'Scheme',
  required: true
},
  heroName: {
    type: String,
    required: true
  },
  heroAge: Number,
  heroGender: String,
  heroOccupation: String,
  village: String,
  district: String,
  problem: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  result: {
    type: String,
    required: true
  },
  message: String,
  language: {
    type: String,
    default: 'english'
  },
  tags: [String],
  likes: {
    type: Number,
    default: 0
  },
  usedCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'stories'  // 👈 ADD THIS LINE
});

module.exports = mongoose.model('Story', storySchema);