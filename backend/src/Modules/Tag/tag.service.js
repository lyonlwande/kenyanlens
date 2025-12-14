import TagRepository from './tag.repository.js';

/**
 * Service layer for Tag operations
 */
const TagService = {
  /**
   * Create a new tag, or return existing if duplicate (same refType, ref, label)
   * @param {Object} tagData
   * @returns {Promise<Object>}
   */
  async createTag(tagData) {
    // Prevent duplicate tags for same refType, ref, and label
    const existing = await TagRepository.findOne({
      refType: tagData.refType,
      ref: tagData.ref,
      label: tagData.label || ''
    });
    if (existing) return existing;
    return await TagRepository.create(tagData);
  },

  /**
   * Get tags by filter
   * @param {Object} filter
   * @param {Object} [options]
   * @returns {Promise<Array>}
   */
  async getTags(filter = {}, options = {}) {
    return await TagRepository.find(filter, options);
  },

  /**
   * Get a tag by ID
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async getTagById(id) {
    return await TagRepository.findById(id);
  },

  /**
   * Update a tag by ID
   * @param {string} id
   * @param {Object} update
   * @returns {Promise<Object|null>}
   */
  async updateTag(id, update) {
    return await TagRepository.updateById(id, update);
  },

  /**
   * Delete a tag by ID
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async deleteTag(id) {
    return await TagRepository.deleteById(id);
  },

  /**
   * Get tags for a specific referenced entity
   * @param {string} refType
   * @param {string} refId
   * @returns {Promise<Array>}
   */
  async getTagsForRef(refType, refId) {
    return await TagRepository.find({ refType, ref: refId });
  }
};

export default TagService;
