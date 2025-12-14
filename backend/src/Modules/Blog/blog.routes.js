import express from 'express';
import blogController from './blog.controller.js';
import authMiddleware from '../Authentication/auth.middleware.js';
import { validateBlog, validateBlogId, validateCommentId, validateSearchQuery } from './blog.middleware.js';

const router = express.Router();



// Create a new blog post (protected, validated)
router.post('/', authMiddleware, validateBlog, blogController.createBlog);

// Get all blogs (public)
router.get('/', blogController.getBlogs);

// Get a blog by ID (public, validated)
router.get('/:id', validateBlogId, blogController.getBlogById);

// Update a blog (protected, validated)
router.put('/:id', authMiddleware, validateBlogId, validateBlog, blogController.updateBlog);

// Soft delete a blog (protected, validated)
router.delete('/:id', authMiddleware, validateBlogId, blogController.deleteBlog);

// Restore a soft-deleted blog (protected, validated)
router.patch('/:id/restore', authMiddleware, validateBlogId, blogController.restoreBlog);

// Hard delete a blog (protected, validated)
router.delete('/:id/hard', authMiddleware, validateBlogId, blogController.hardDeleteBlog);

// Search blogs (public, validated)
router.get('/search', validateSearchQuery, blogController.searchBlogs);

// Like a blog (protected, validated)
router.post('/:id/like', authMiddleware, validateBlogId, blogController.likeBlog);

// Unlike a blog (protected, validated)
router.post('/:id/unlike', authMiddleware, validateBlogId, blogController.unlikeBlog);

// Add comment to blog (protected, validated)
router.post('/:id/comment', authMiddleware, validateBlogId, validateCommentId, blogController.addComment);

// Remove comment from blog (protected, validated)
router.delete('/:id/comment', authMiddleware, validateBlogId, validateCommentId, blogController.removeComment);

// Feature/unfeature a blog (protected, validated)
router.patch('/:id/feature', authMiddleware, validateBlogId, blogController.setFeatured);

// Get featured blogs (public)
router.get('/featured', blogController.getFeaturedBlogs);

// Get blogs by author (public)
router.get('/author/:authorId', blogController.getBlogsByAuthor);

// Get blogs by category (public)
router.get('/category/:category', blogController.getBlogsByCategory);

// Get blogs by tag (public)
router.get('/tag/:tag', blogController.getBlogsByTag);

export default router;
