// blog.middleware.js
import { body, param, query, validationResult } from 'express-validator';

// Validation middleware for creating/updating a blog
export const validateBlog = [
  body('title').isString().trim().notEmpty().withMessage('Title is required'),
  body('slug').optional().isString().trim(),
  body('description').isString().trim().notEmpty().isLength({ max: 300 }).withMessage('Description is required and max 300 chars'),
  body('thumbnail').isString().notEmpty().withMessage('Thumbnail is required'),
  body('category').isString().isIn([
    'Lifestyle',
    'Culture & Ideas',
    'Conversations',
    'Inspiration',
    'Daily Experiences',
    'Technology',
    'Current Issues'
  ]).withMessage('Invalid category'),
  body('author').optional().isMongoId(),
  body('status').optional().isIn(['draft', 'published', 'archived']),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validation middleware for blog ID param
export const validateBlogId = [
  param('id').isMongoId().withMessage('Invalid blog ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validation middleware for comment ID param
export const validateCommentId = [
  body('commentId').isMongoId().withMessage('Invalid comment ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validation middleware for search query
export const validateSearchQuery = [
  query('query').isString().trim().notEmpty().withMessage('Search query is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
