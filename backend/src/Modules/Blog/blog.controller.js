import BlogService from './blog.service.js';

const blogService = new BlogService();

class BlogController {
  // Create a new blog post
  async createBlog(req, res) {
    try {
      // Accept tags as array of tag objects or tag IDs
      const blog = await blogService.createBlog({ ...req.body, author: req.user._id });
      res.status(201).json(blog);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Get a blog by ID
  async getBlogById(req, res) {
    try {
      const blog = await blogService.getBlogById(req.params.id);
      res.status(200).json(blog);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  // Get all blogs
  async getBlogs(req, res) {
    try {
      const { skip, limit, sort, ...filter } = req.query;
      const blogs = await blogService.getBlogs({
        filter,
        skip: Number(skip) || 0,
        limit: Number(limit) || 10,
        sort: sort ? JSON.parse(sort) : { createdAt: -1 }
      });
      res.status(200).json(blogs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Update a blog
  async updateBlog(req, res) {
    try {
      // Accept tags as array of tag objects or tag IDs
      const blog = await blogService.updateBlog(req.params.id, req.body);
      res.status(200).json(blog);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Soft delete a blog
  async deleteBlog(req, res) {
    try {
      await blogService.deleteBlog(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Restore a soft-deleted blog
  async restoreBlog(req, res) {
    try {
      const blog = await blogService.restoreBlog(req.params.id);
      res.status(200).json(blog);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Hard delete a blog
  async hardDeleteBlog(req, res) {
    try {
      await blogService.hardDeleteBlog(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Search blogs
  async searchBlogs(req, res) {
    try {
      const { query, skip, limit } = req.query;
      const blogs = await blogService.searchBlogs(query, { skip: Number(skip) || 0, limit: Number(limit) || 10 });
      res.status(200).json(blogs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Like a blog
  async likeBlog(req, res) {
    try {
      const blog = await blogService.likeBlog(req.params.id, req.user._id);
      res.status(200).json(blog);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Unlike a blog
  async unlikeBlog(req, res) {
    try {
      const blog = await blogService.unlikeBlog(req.params.id, req.user._id);
      res.status(200).json(blog);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Add comment to blog
  async addComment(req, res) {
    try {
      const blog = await blogService.addComment(req.params.id, req.body.commentId);
      res.status(200).json(blog);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Remove comment from blog
  async removeComment(req, res) {
    try {
      const blog = await blogService.removeComment(req.params.id, req.body.commentId);
      res.status(200).json(blog);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Feature/unfeature a blog
  async setFeatured(req, res) {
    try {
      const blog = await blogService.setFeatured(req.params.id, req.body.isFeatured);
      res.status(200).json(blog);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Get featured blogs
  async getFeaturedBlogs(req, res) {
    try {
      const { skip, limit, sort } = req.query;
      const blogs = await blogService.getFeaturedBlogs({
        skip: Number(skip) || 0,
        limit: Number(limit) || 10,
        sort: sort ? JSON.parse(sort) : { createdAt: -1 }
      });
      res.status(200).json(blogs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Get blogs by author
  async getBlogsByAuthor(req, res) {
    try {
      const { skip, limit, sort } = req.query;
      const blogs = await blogService.getBlogsByAuthor(req.params.authorId, {
        skip: Number(skip) || 0,
        limit: Number(limit) || 10,
        sort: sort ? JSON.parse(sort) : { createdAt: -1 }
      });
      res.status(200).json(blogs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Get blogs by category
  async getBlogsByCategory(req, res) {
    try {
      const { skip, limit, sort } = req.query;
      const blogs = await blogService.getBlogsByCategory(req.params.category, {
        skip: Number(skip) || 0,
        limit: Number(limit) || 10,
        sort: sort ? JSON.parse(sort) : { createdAt: -1 }
      });
      res.status(200).json(blogs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Get blogs by tag
  async getBlogsByTag(req, res) {
    try {
      const { skip, limit, sort } = req.query;
      const blogs = await blogService.getBlogsByTag(req.params.tag, {
        skip: Number(skip) || 0,
        limit: Number(limit) || 10,
        sort: sort ? JSON.parse(sort) : { createdAt: -1 }
      });
      res.status(200).json(blogs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

export default new BlogController();
