import DraftRepository from './draft.repository.js';

const draftRepo = new DraftRepository();

class DraftService {
    // Check if an image publicId is referenced in any draft
    async isImageReferenced(publicId) {
      return await draftRepo.isImageReferenced(publicId);
    }
  // Create a new draft
  async createDraft(data) {
    // Ensure image blocks only use filePath, not url (handled in controller)
    return await draftRepo.createDraft(data);
  }

  // Get a draft by ID
  async getDraftById(id) {
    return await draftRepo.getDraftById(id);
  }

  // Get all drafts for a user
  async getDraftsByUser(userId) {
    return await draftRepo.getDraftsByUser(userId);
  }

  // Update a draft by ID
  async updateDraft(id, updateData) {
    return await draftRepo.updateDraft(id, updateData);
  }

  // Delete a draft by ID
  async deleteDraft(id) {
    return await draftRepo.deleteDraft(id);
  }

  // Publish a draft (move to Blog, then delete draft)
  async publishDraft(id, blogData) {
    // blogData should be validated and processed in controller
    // This method should be called after validation
    // The controller should handle creating the blog and deleting the draft
    return true;
  }
}

export default DraftService;
