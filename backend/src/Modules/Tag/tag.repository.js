import Tag from './tag.model.js';

/**
 * Repository layer for Tag operations
 */
const TagRepository = {
  /**
   * Create a new tag
   * @param {Object} tagData
   * @returns {Promise<Tag>}
   */
  async create(tagData) {
    const tag = new Tag(tagData);
    return await tag.save();
  },

  /**
   * Find tags by filter
   * @param {Object} filter
   * @param {Object} [options]
   * @returns {Promise<Tag[]>}
   */
  async find(filter = {}, options = {}) {
    return await Tag.find(filter, null, options);
  },

  /**
   * Find a tag by ID
   * @param {string} id
   * @returns {Promise<Tag|null>}
   */
  async findById(id) {
    return await Tag.findById(id);
  },

  /**
   * Update a tag by ID
   * @param {string} id
   * @param {Object} update
   * @returns {Promise<Tag|null>}
   */
  async updateById(id, update) {
    return await Tag.findByIdAndUpdate(id, update, { new: true });
  },

  /**
   * Delete a tag by ID
   * @param {string} id
   * @returns {Promise<Tag|null>}
   */
  async deleteById(id) {
    return await Tag.findByIdAndDelete(id);
  },

  /**
   * Find one tag by filter
   * @param {Object} filter
   * @returns {Promise<Tag|null>}
   */
  async findOne(filter) {
    return await Tag.findOne(filter);
  }
};

export default TagRepository;
