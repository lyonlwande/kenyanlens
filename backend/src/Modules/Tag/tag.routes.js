
import { Router } from 'express';
import TagController from './tag.controller.js';
import { validateTagInput, checkTagRefExists } from './tag.middleware.js';

const router = Router();

// Create a new tag with validation and existence check
router.post('/', validateTagInput, checkTagRefExists, TagController.createTag);

// Get all tags (with optional filters)
router.get('/', TagController.getTags);

// Get a tag by ID
router.get('/:id', TagController.getTagById);

// Update a tag by ID (validate input if refType/ref are being updated)
router.patch('/:id', validateTagInput, checkTagRefExists, TagController.updateTag);

// Delete a tag by ID
router.delete('/:id', TagController.deleteTag);

// Get tags for a specific referenced entity
router.get('/ref/:refType/:refId', TagController.getTagsForRef);

export default router;
