
import BlogService from './blog.service.js';
import { uploadToCloudinary } from '../../config/cloudinary.js';
import fs from 'fs';

const blogService = new BlogService();

class BlogController {
    // On blog delete, cleanup unused images, videos, and thumbnail
    async deleteBlog(req, res) {
      try {
        const blog = await blogService.getBlogById(req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        // Collect all image, video, and thumbnail filePaths in the blog
        const imageFilePaths = (blog.content || [])
          .filter(block => block.type === 'image' && block.data && block.data.filePath)
          .map(block => block.data.filePath);
        const videoFilePaths = (blog.content || [])
          .filter(block => block.type === 'media' && block.data && block.data.filePath)
          .map(block => block.data.filePath);
        const thumbnailFilePath = blog.thumbnail || '';
        // Delete blog
        await blogService.deleteBlog(req.params.id);
        // Cleanup images if not referenced elsewhere
        const { extractCloudinaryPublicId, deleteFromCloudinary } = require('../../config/cloudinary.js');
        const DraftService = require('./draft.service.js').default;
        const draftService = new DraftService();
        for (const filePath of imageFilePaths) {
          const publicId = extractCloudinaryPublicId(filePath);
          if (publicId) {
            const stillReferenced = await blogService.isImageReferenced(publicId);
            const referencedInDrafts = await draftService.isImageReferenced(publicId);
            if (!stillReferenced && !referencedInDrafts) {
              await deleteFromCloudinary(publicId);
              console.log(`[Cleanup] Deleted unused image from Cloudinary: ${publicId}`);
            } else {
              console.log(`[Cleanup] Image still referenced, not deleted: ${publicId}`);
            }
          }
        }
        // Cleanup videos if not referenced elsewhere
        for (const filePath of videoFilePaths) {
          const publicId = extractCloudinaryPublicId(filePath);
          if (publicId) {
            const stillReferenced = await blogService.isImageReferenced(publicId);
            const referencedInDrafts = await draftService.isImageReferenced(publicId);
            if (!stillReferenced && !referencedInDrafts) {
              await deleteFromCloudinary(publicId, { resource_type: 'video' });
              console.log(`[Cleanup] Deleted unused video from Cloudinary: ${publicId}`);
            } else {
              console.log(`[Cleanup] Video still referenced, not deleted: ${publicId}`);
            }
          }
        }
        // Cleanup thumbnail if not referenced elsewhere
        if (thumbnailFilePath) {
          const publicId = extractCloudinaryPublicId(thumbnailFilePath);
          if (publicId) {
            const stillReferenced = await blogService.isImageReferenced(publicId);
            const referencedInDrafts = await draftService.isImageReferenced(publicId);
            if (!stillReferenced && !referencedInDrafts) {
              await deleteFromCloudinary(publicId);
              console.log(`[Cleanup] Deleted unused thumbnail from Cloudinary: ${publicId}`);
            } else {
              console.log(`[Cleanup] Thumbnail still referenced, not deleted: ${publicId}`);
            }
          }
        }
        res.status(200).json({ success: true });
      } catch (err) {
        console.error('[BlogController][deleteBlog] Error:', err);
        res.status(400).json({ error: err.message, ...(err.errors ? { errors: err.errors } : {}) });
      }
    }
  // Create a new blog post
  async createBlog(req, res) {
    try {
      // Handle main image (thumbnail)
      let imageUrl = '';
      if (req.files && req.files['thumbnail'] && req.files['thumbnail'][0]) {
        const result = await uploadToCloudinary(req.files['thumbnail'][0].path, { fileType: 'image', deleteAfterUpload: true });
        imageUrl = result.secure_url;
        if (fs.existsSync(req.files['thumbnail'][0].path)) fs.unlinkSync(req.files['thumbnail'][0].path);
      }
      // Parse content
          // ...existing code for creating a blog...
          // Detailed logging of all blog fields, especially content blocks
          if (process.env.NODE_ENV !== 'test') {
            console.log('[createBlog] Blog fields:');
            for (const [key, value] of Object.entries(blog)) {
              if (key === 'content' && Array.isArray(value)) {
                console.log('  content: [');
                value.forEach((block, idx) => {
                  console.log(`    Block ${idx}:`);
                  for (const [bKey, bVal] of Object.entries(block)) {
                    console.log(`      ${bKey}:`, bVal);
                  }
                });
                console.log('  ]');
              } else {
                console.log(`  ${key}:`, value);
              }
            }
          }
      if (typeof content === 'string') {
        try { content = JSON.parse(content); } catch (e) { content = []; }
      }
      // Parse block image map
      let blockImageMap = {};
      if (req.body.blockImageMap) {
        try { blockImageMap = JSON.parse(req.body.blockImageMap); } catch (e) { blockImageMap = {}; }
      }
      // Handle block images
      const blockImageFiles = req.files && req.files['blockImages'] ? req.files['blockImages'] : [];
      const blockImageUrlMap = {};
      for (const file of blockImageFiles) {
        const result = await uploadToCloudinary(file.path, { fileType: 'image', deleteAfterUpload: true });
        blockImageUrlMap[file.originalname] = result.secure_url;
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      }
      // Map filePath to image blocks
      if (Array.isArray(content)) {
        content = content.map(block => {
          if (block.type === 'image' && blockImageMap[block.id] && blockImageUrlMap[blockImageMap[block.id]]) {
            return {
              ...block,
              data: {
                ...block.data,
                filePath: blockImageUrlMap[blockImageMap[block.id]]
              }
            };
          }
          return block;
        });
      }
      const blog = await blogService.createBlog({
        ...req.body,
        content,
        thumbnail: imageUrl,
        author: req.user._id || req.user.id
      });
     
      console.log('Blog created:', JSON.stringify(blog, null, 2));
      res.status(201).json(blog);
    } catch (err) {
      console.error('[BlogController] Error in createBlog:', err);
      res.status(400).json({ error: err.message });
    }
  }

  // Get a blog by ID
  async getBlogById(req, res) {
    try {
      console.log(`[getBlogById] Request for blog id: ${req.params.id}`);
      const blog = await blogService.getBlogById(req.params.id);
      if (!blog) {
        console.warn(`[getBlogById] Blog not found for id: ${req.params.id}`);
        return res.status(404).json({ error: 'Blog not found' });
      }
      console.log(`[getBlogById] Blog found: ${blog._id}`);
      res.status(200).json(blog);
    } catch (err) {
      console.error(`[getBlogById] Error fetching blog id ${req.params.id}:`, err);
      res.status(404).json({ error: err.message });
    }
  }

  // Get all blogs
  async getBlogs(req, res) {
    try {
      console.log('[getBlogs] Query params:', req.query);
      const { skip, limit, sort, ...filter } = req.query;
      let parsedSort = { createdAt: -1 };
      if (sort) {
        try {
          parsedSort = JSON.parse(sort);
        } catch (e) {
          console.error('[getBlogs] Failed to parse sort param:', sort, e);
        }
      }
      const blogs = await blogService.getBlogs({
        filter,
        skip: Number(skip) || 0,
        limit: Number(limit) || 10,
        sort: parsedSort
      });
      res.status(200).json(blogs);
    } catch (err) {
      console.error('[getBlogs] Error fetching blogs:', err);
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
