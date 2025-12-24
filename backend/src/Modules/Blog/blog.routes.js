import express from 'express';
import blogController from './blog.controller.js';
import DraftController from './draft.controller.js';
import { requireAuth } from '../Authentication/auth.middleware.js';
import { validateBlog, validateBlogId, validateCommentId, validateSearchQuery } from './blog.middleware.js';
import upload, { blogUpload } from '../../config/multer.js';


const draftController = new DraftController();
const router = express.Router();

// Draft routes
router.post('/drafts', requireAuth, blogUpload, draftController.createDraft);
router.put('/drafts/:id', requireAuth, blogUpload, draftController.updateDraft);
router.get('/drafts', requireAuth, draftController.getDrafts);
router.get('/drafts/:id', requireAuth, draftController.getDraftById);
router.delete('/drafts/:id', requireAuth, draftController.deleteDraft);
router.post('/drafts/:id/publish', requireAuth, draftController.publishDraft);

// Create a new blog post (protected, validated, with image and blockImages upload)
router.post('/', requireAuth, blogUpload, validateBlog, blogController.createBlog);

// Get all blogs (public)
router.get('/', blogController.getBlogs);

// Get a blog by ID (public, validated)
router.get('/:id', validateBlogId, blogController.getBlogById);

// Update a blog (protected, validated)
router.put('/:id', requireAuth, blogUpload, validateBlogId, validateBlog, blogController.updateBlog);

// Soft delete a blog (protected, validated)
router.delete('/:id', requireAuth, validateBlogId, blogController.deleteBlog);

// Restore a soft-deleted blog (protected, validated)
router.patch('/:id/restore', requireAuth, validateBlogId, blogController.restoreBlog);

// Hard delete a blog (protected, validated)
router.delete('/:id/hard', requireAuth, validateBlogId, blogController.hardDeleteBlog);

// Search blogs (public, validated)
router.get('/search', validateSearchQuery, blogController.searchBlogs);

// Like a blog (protected, validated)
router.post('/:id/like', requireAuth, validateBlogId, blogController.likeBlog);

// Unlike a blog (protected, validated)
router.post('/:id/unlike', requireAuth, validateBlogId, blogController.unlikeBlog);

// Add comment to blog (protected, validated)
router.post('/:id/comment', requireAuth, validateBlogId, validateCommentId, blogController.addComment);

// Remove comment from blog (protected, validated)
router.delete('/:id/comment', requireAuth, validateBlogId, validateCommentId, blogController.removeComment);

// Feature/unfeature a blog (protected, validated)
router.patch('/:id/feature', requireAuth, validateBlogId, blogController.setFeatured);

// Get featured blogs (public)
router.get('/featured', blogController.getFeaturedBlogs);

// Get blogs by author (public)
router.get('/author/:authorId', blogController.getBlogsByAuthor);

// Get blogs by category (public)
router.get('/category/:category', blogController.getBlogsByCategory);

// Get blogs by tag (public)
router.get('/tag/:tag', blogController.getBlogsByTag);

export default router;
