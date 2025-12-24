import BlogRepository from './blog.repository.js';
import {
  generateSlug,
  formatDescription,
  isCloudinaryUrl,
  isPublished,
  extractKeywords
} from './blog.utils.js';
import TagService from '../Tag/tag.service.js';
import { populateTagRefs } from '../Tag/tag.utils.js';

const blogRepo = new BlogRepository();

class BlogService {
  // Create a new blog post
  async createBlog(data) {
    // Ensure image blocks only use filePath, not url
    if (Array.isArray(data.content)) {
      data.content = data.content.map(block => {
        if (block.type === 'image' && block.data) {
          // Remove url if present
          if ('url' in block.data) delete block.data.url;
        }
        return block;
      });
    }
    // Generate slug if not provided
    if (!data.slug && data.title) {
      data.slug = generateSlug(data.title);
    }
    // Format description
    if (data.description) {
      data.description = formatDescription(data.description);
    }
    // Validate thumbnail URL
    if (data.thumbnail && !isCloudinaryUrl(data.thumbnail)) {
      throw new Error('Thumbnail must be a valid Cloudinary URL');
    }
    // Handle tags: accept array of tag objects or tag IDs
    if (Array.isArray(data.tags)) {
      const tagIds = [];
      for (const tag of data.tags) {
        if (typeof tag === 'string') {
          tagIds.push(tag);
        } else if (tag && typeof tag === 'object') {
          const createdTag = await TagService.createTag(tag);
          tagIds.push(createdTag._id);
        }
      }
      data.tags = tagIds;
    }
    // Set publishedAt if status is published
    if (data.status === 'published' && !data.publishedAt) {
      data.publishedAt = new Date();
    }
    // Extract keywords
    data.keywords = extractKeywords(data);
    const blog = await blogRepo.createBlog(data);
    // Populate tags for response
    if (blog.tags && blog.tags.length) {
      blog.tags = await populateTagRefs(blog.tags);
    }
    return blog;
  }

  // Get a blog by ID
  async getBlogById(id) {
    const blog = await blogRepo.getBlogById(id);
    if (!blog || !blog.active) throw new Error('Blog not found or inactive');
    await blogRepo.incrementViews(id); // Increment views
    // Populate tags for response
    if (blog.tags && blog.tags.length) {
      blog.tags = await populateTagRefs(blog.tags);
    }
    return blog;
  }

  // Get all blogs with filters, pagination, sorting
  async getBlogs(options) {
    options = options || {};
    options.filter = { ...options.filter, active: true };
    const blogs = await blogRepo.getBlogs(options);
    // Optionally format descriptions and filter published blogs
    return Promise.all(blogs.map(async blog => {
      const obj = blog.toObject();
      obj.description = formatDescription(blog.description);
      obj.published = isPublished(blog);
      if (obj.tags && obj.tags.length) {
        obj.tags = await populateTagRefs(obj.tags);
      }
      return obj;
    }));
  }

  // Update a blog
  async updateBlog(id, updateData) {
    if (updateData.title && !updateData.slug) {
      updateData.slug = generateSlug(updateData.title);
    }
    if (updateData.description) {
      updateData.description = formatDescription(updateData.description);
    }
    if (updateData.thumbnail && !isCloudinaryUrl(updateData.thumbnail)) {
      throw new Error('Thumbnail must be a valid Cloudinary URL');
    }
    // Handle tags: accept array of tag objects or tag IDs
    if (Array.isArray(updateData.tags)) {
      const tagIds = [];
      for (const tag of updateData.tags) {
        if (typeof tag === 'string') {
          tagIds.push(tag);
        } else if (tag && typeof tag === 'object') {
          const createdTag = await TagService.createTag(tag);
          tagIds.push(createdTag._id);
        }
      }
      updateData.tags = tagIds;
    }
    if (updateData.status === 'published') {
      updateData.publishedAt = new Date();
    }
    updateData.keywords = extractKeywords(updateData);
    const blog = await blogRepo.updateBlog(id, updateData);
    // Populate tags for response
    if (blog.tags && blog.tags.length) {
      blog.tags = await populateTagRefs(blog.tags);
    }
    return blog;
  }

  // Delete a blog (soft delete)
  async deleteBlog(id) {
    return await blogRepo.deactivateBlog(id);
  }

  // Restore a soft-deleted blog
  async restoreBlog(id) {
    return await blogRepo.activateBlog(id);
  }

  // Permanently delete a blog
  async hardDeleteBlog(id) {
    return await blogRepo.deleteBlog(id);
  }

  // Bulk delete blogs
  async bulkDeleteBlogs(filter) {
    return await blogRepo.deleteBlogs(filter);
  }

  // Search blogs
  async searchBlogs(query, options) {
    return await blogRepo.searchBlogs(query, options);
  }

  // Count blogs
  async countBlogs(filter) {
    return await blogRepo.countBlogs(filter);
  }

  // Get blog stats (aggregation)
  async getBlogStats() {
    return await blogRepo.getBlogStats();
  }

  // Like a blog
  async likeBlog(id, userId) {
    return await blogRepo.addLike(id, userId);
  }

  // Unlike a blog
  async unlikeBlog(id, userId) {
    return await blogRepo.removeLike(id, userId);
  }

  // Add comment to blog
  async addComment(id, commentId) {
    return await blogRepo.addComment(id, commentId);
  }

  // Remove comment from blog
  async removeComment(id, commentId) {
    return await blogRepo.removeComment(id, commentId);
  }

  // Feature/unfeature a blog
  async setFeatured(id, isFeatured) {
    return await blogRepo.setFeatured(id, isFeatured);
  }

  // Get featured blogs
  async getFeaturedBlogs(options = {}) {
    options.filter = { ...options.filter, isFeatured: true, active: true };
    const blogs = await blogRepo.getBlogs(options);
    return blogs.map(blog => ({
      ...blog.toObject(),
      description: formatDescription(blog.description),
      published: isPublished(blog)
    }));
  }

  // Get blogs by author
  async getBlogsByAuthor(authorId, options = {}) {
    options.filter = { ...options.filter, author: authorId, active: true };
    const blogs = await blogRepo.getBlogs(options);
    return Promise.all(blogs.map(async blog => {
      const obj = blog.toObject();
      obj.description = formatDescription(blog.description);
      obj.published = isPublished(blog);
      if (obj.tags && obj.tags.length) {
        obj.tags = await populateTagRefs(obj.tags);
      }
      return obj;
    }));
  }

  // Get blogs by category
  async getBlogsByCategory(category, options = {}) {
    options.filter = { ...options.filter, category, active: true };
    const blogs = await blogRepo.getBlogs(options);
    return Promise.all(blogs.map(async blog => {
      const obj = blog.toObject();
      obj.description = formatDescription(blog.description);
      obj.published = isPublished(blog);
      if (obj.tags && obj.tags.length) {
        obj.tags = await populateTagRefs(obj.tags);
      }
      return obj;
    }));
  }

  // Get blogs by tag
  async getBlogsByTag(tag, options = {}) {
    options.filter = { ...options.filter, tags: tag, active: true };
    const blogs = await blogRepo.getBlogs(options);
    return Promise.all(blogs.map(async blog => {
      const obj = blog.toObject();
      obj.description = formatDescription(blog.description);
      obj.published = isPublished(blog);
      if (obj.tags && obj.tags.length) {
        obj.tags = await populateTagRefs(obj.tags);
      }
      return obj;
    }));
  }
}

export default BlogService;
