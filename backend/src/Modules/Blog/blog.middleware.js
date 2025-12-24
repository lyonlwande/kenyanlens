// blog.middleware.js
import { body, param, query, validationResult } from 'express-validator';

// Validation middleware for creating/updating a blog
export const validateBlog = [
  body('title').isString().trim().notEmpty().withMessage('Title is required'),
  body('slug').optional().isString().trim(),
  body('description').isString().trim().notEmpty().isLength({ max: 300 }).withMessage('Description is required and max 300 chars'),
  // Allow thumbnail to be set after file upload (skip validation if file is present)
  body('thumbnail').custom((value, { req }) => {
    if (req.file) return true; // If file is uploaded, skip thumbnail string check
    if (typeof value === 'string' && value.trim() !== '') return true;
    throw new Error('Thumbnail is required');
  }),
  body('category').isString().trim().notEmpty().withMessage('Category is required'),
  body('author').optional().isMongoId(),
  body('status').optional().isIn(['draft', 'published', 'archived']),
  // Custom validation for image blocks in content
  body('content').custom((blocks, { req }) => {
    if (!Array.isArray(blocks)) return true; // skip if not array
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      if (block.type === 'image') {
        // filePath must exist and url must not exist
        if (!block.filePath || typeof block.filePath !== 'string' || block.filePath.trim() === '') {
          throw new Error(`Image block at index ${i} is missing filePath.`);
        }
        if ('url' in block && block.url) {
          throw new Error(`Image block at index ${i} should not have a url.`);
        }
      }
    }
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('[validateBlog] Request body:', req.body);
      console.log('[validateBlog] Validation errors:', errors.array());
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
