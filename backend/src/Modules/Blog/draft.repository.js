import Draft from './draft.model.js';

class DraftRepository {
    // Check if an image publicId is referenced in any draft
    async isImageReferenced(publicId) {
      if (!publicId) return false;
      // Search all drafts for any block with filePath containing the publicId
      const drafts = await Draft.find({ 'content.data.filePath': { $regex: publicId } });
      return drafts.length > 0;
    }
  // Create a new draft
  async createDraft(data) {
    // Do not remove url from image blocks; preserve all data
    return await Draft.create(data);
  }

  // Get a draft by ID
  async getDraftById(id) {
    return await Draft.findById(id);
  }

  // Get all drafts for a user
  async getDraftsByUser(userId) {
    return await Draft.find({ userId }).sort({ updatedAt: -1 });
  }

  // Update a draft by ID
  async updateDraft(id, updateData) {
    // Do not remove url from image blocks; preserve all data
    return await Draft.findByIdAndUpdate(id, updateData, { new: true });
  }

  // Delete a draft by ID
  async deleteDraft(id) {
    return await Draft.findByIdAndDelete(id);
  }
}

export default DraftRepository;
