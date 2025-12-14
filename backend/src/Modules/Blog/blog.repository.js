import Blog from './blog.model.js';

class BlogRepository {
  // Create a new blog post
  async createBlog(data) {
    return await Blog.create(data);
  }

  // Get a blog by ID
  async getBlogById(id) {
    return await Blog.findById(id)
      .populate('author')
      .populate('comments')
      .populate('tags');
  }

  // Get all blogs with optional filters, pagination, and sorting
  async getBlogs({ filter = {}, skip = 0, limit = 10, sort = { createdAt: -1 } } = {}) {
    return await Blog.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('author')
      .populate('comments')
      .populate('tags');
  }

  // Update a blog by ID
  async updateBlog(id, updateData) {
    return await Blog.findByIdAndUpdate(id, updateData, { new: true });
  }

  // Delete a blog by ID
  async deleteBlog(id) {
    return await Blog.findByIdAndDelete(id);
  }

  // Bulk delete blogs by filter
  async deleteBlogs(filter) {
    return await Blog.deleteMany(filter);
  }

  // Search blogs by title, description, or content
  async searchBlogs(query, { skip = 0, limit = 10 } = {}) {
    return await Blog.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'content.text': { $regex: query, $options: 'i' } }
      ]
    })
      .skip(skip)
      .limit(limit);
  }

  // Count blogs by filter
  async countBlogs(filter = {}) {
    return await Blog.countDocuments(filter);
  }

  // Aggregate: e.g., get stats (blogs per author)
  async getBlogStats() {
    return await Blog.aggregate([
      { $group: { _id: '$author', count: { $sum: 1 } } }
    ]);
  }

  // Increment views count
  async incrementViews(id) {
    return await Blog.findByIdAndUpdate(id, { $inc: { viewsCount: 1 } }, { new: true });
  }

  // Add like to blog
  async addLike(id, userId) {
    return await Blog.findByIdAndUpdate(id, { $addToSet: { likes: userId } }, { new: true });
  }

  // Remove like from blog
  async removeLike(id, userId) {
    return await Blog.findByIdAndUpdate(id, { $pull: { likes: userId } }, { new: true });
  }

  // Add comment to blog
  async addComment(id, commentId) {
    return await Blog.findByIdAndUpdate(id, { $push: { comments: commentId } }, { new: true });
  }

  // Remove comment from blog
  async removeComment(id, commentId) {
    return await Blog.findByIdAndUpdate(id, { $pull: { comments: commentId } }, { new: true });
  }

  // Feature/unfeature a blog
  async setFeatured(id, isFeatured) {
    return await Blog.findByIdAndUpdate(id, { isFeatured }, { new: true });
  }

  // Soft delete (deactivate) a blog
  async deactivateBlog(id) {
    return await Blog.findByIdAndUpdate(id, { active: false }, { new: true });
  }

  // Restore a soft-deleted blog
  async activateBlog(id) {
    return await Blog.findByIdAndUpdate(id, { active: true }, { new: true });
  }
}

export default BlogRepository;
