import TagService from './tag.service.js';

/**
 * Controller layer for Tag operations
 */
const TagController = {
  /**
   * Create a new tag
   */
  async createTag(req, res, next) {
    try {
      const tag = await TagService.createTag(req.body);
      res.status(201).json(tag);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get all tags (with optional filters)
   */
  async getTags(req, res, next) {
    try {
      const tags = await TagService.getTags(req.query);
      res.json(tags);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get a tag by ID
   */
  async getTagById(req, res, next) {
    try {
      const tag = await TagService.getTagById(req.params.id);
      if (!tag) return res.status(404).json({ message: 'Tag not found' });
      res.json(tag);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update a tag by ID
   */
  async updateTag(req, res, next) {
    try {
      const tag = await TagService.updateTag(req.params.id, req.body);
      if (!tag) return res.status(404).json({ message: 'Tag not found' });
      res.json(tag);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Delete a tag by ID
   */
  async deleteTag(req, res, next) {
    try {
      const tag = await TagService.deleteTag(req.params.id);
      if (!tag) return res.status(404).json({ message: 'Tag not found' });
      res.json({ message: 'Tag deleted', tag });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get tags for a specific referenced entity
   */
  async getTagsForRef(req, res, next) {
    try {
      const { refType, refId } = req.params;
      const tags = await TagService.getTagsForRef(refType, refId);
      res.json(tags);
    } catch (err) {
      next(err);
    }
  }
};

export default TagController;
