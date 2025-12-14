import mongoose from 'mongoose';
import User from '../User/user.model.js';
import Blog from '../Blog/blog.model.js';

// Validate tag input middleware
export const validateTagInput = (req, res, next) => {
  const { refType, ref } = req.body;
  if (!refType || !['User', 'Blog'].includes(refType)) {
    return res.status(400).json({ message: 'Invalid or missing refType. Must be "User" or "Blog".' });
  }
  if (!ref || !mongoose.Types.ObjectId.isValid(ref)) {
    return res.status(400).json({ message: 'Invalid or missing ref (ObjectId).' });
  }
  next();
};

// Check if referenced entity exists
export const checkTagRefExists = async (req, res, next) => {
  const { refType, ref } = req.body;
  let exists = false;
  if (refType === 'User') {
    exists = await User.exists({ _id: ref });
  } else if (refType === 'Blog') {
    exists = await Blog.exists({ _id: ref });
  }
  if (!exists) {
    return res.status(404).json({ message: `Referenced ${refType} not found.` });
  }
  next();
};
