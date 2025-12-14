import mongoose from 'mongoose';

// Normalize a tag label (trim, lowercase)
export function normalizeLabel(label) {
  return (label || '').trim().toLowerCase();
}

// Check if a string is a valid MongoDB ObjectId
export function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Populate tag references (for richer API responses)
export async function populateTagRefs(tags) {
  // tags: array of Tag documents
  return Promise.all(tags.map(async tag => {
    let refDoc = null;
    if (tag.refType === 'User') {
      const module = await import('../User/user.model.js');
      refDoc = await module.default.findById(tag.ref);
    } else if (tag.refType === 'Blog') {
      const module = await import('../Blog/blog.model.js');
      refDoc = await module.default.findById(tag.ref);
    }
    return {
      ...tag.toObject(),
      refData: refDoc
    };
  }));
}
