import mongoose from 'mongoose';

const DraftSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    default: ''
  },
  subTitle: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  content: {
    type: Array, // Array of blocks (Editor.js style)
    default: []
  },
  thumbnail: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: ''
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Draft', DraftSchema);