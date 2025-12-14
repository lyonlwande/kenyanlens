
import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema({
  refType: {
    type: String,
    enum: ['User', 'Blog'],
    required: true
  },
  ref: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'refType'
  },
  label: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Tag = mongoose.model('Tag', TagSchema);
export default Tag;