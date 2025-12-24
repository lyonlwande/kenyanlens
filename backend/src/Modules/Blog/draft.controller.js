import DraftService from './draft.service.js';
import BlogService from './blog.service.js';
import { uploadToCloudinary, extractCloudinaryPublicId, deleteFromCloudinary } from '../../config/cloudinary.js';
import fs from 'fs';

const draftService = new DraftService();
const blogService = new BlogService();

class DraftController {
    // On draft delete, cleanup unused images
    async deleteDraft(req, res) {
      try {
        const draft = await draftService.getDraftById(req.params.id);
        if (!draft) return res.status(404).json({ error: 'Draft not found' });
        // Collect all image, video, and thumbnail filePaths in the draft
        const imageFilePaths = (draft.content || [])
          .filter(block => block.type === 'image' && block.data && block.data.filePath)
          .map(block => block.data.filePath);
        const videoFilePaths = (draft.content || [])
          .filter(block => block.type === 'media' && block.data && block.data.filePath)
          .map(block => block.data.filePath);
        const thumbnailFilePath = draft.thumbnail || '';
        // Delete draft
        await draftService.deleteDraft(req.params.id);
        // Cleanup images if not referenced elsewhere
        for (const filePath of imageFilePaths) {
          const publicId = extractCloudinaryPublicId(filePath);
          if (publicId) {
            const stillReferenced = await draftService.isImageReferenced(publicId) || await blogService.isImageReferenced(publicId);
            if (!stillReferenced) {
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
            const stillReferenced = await draftService.isImageReferenced(publicId) || await blogService.isImageReferenced(publicId);
            if (!stillReferenced) {
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
            const stillReferenced = await draftService.isImageReferenced(publicId) || await blogService.isImageReferenced(publicId);
            if (!stillReferenced) {
              await deleteFromCloudinary(publicId);
              console.log(`[Cleanup] Deleted unused thumbnail from Cloudinary: ${publicId}`);
            } else {
              console.log(`[Cleanup] Thumbnail still referenced, not deleted: ${publicId}`);
            }
          }
        }
        res.status(200).json({ success: true });
      } catch (err) {
        console.error('[DraftController][deleteDraft] Error:', err);
        res.status(400).json({ error: err.message, ...(err.errors ? { errors: err.errors } : {}) });
      }
    }
  // Create a new draft
  async createDraft(req, res) {
    console.log('createDraft called with body:', req.body);
    console.log('createDraft called with files:', req.files);
    try {
      // Handle main image (thumbnail)
      let imageUrl = '';
      if (req.files && req.files['thumbnail'] && req.files['thumbnail'][0]) {
        const result = await uploadToCloudinary(req.files['thumbnail'][0].path, { fileType: 'image', deleteAfterUpload: true });
        imageUrl = result.secure_url;
        if (fs.existsSync(req.files['thumbnail'][0].path)) fs.unlinkSync(req.files['thumbnail'][0].path);
      }
      // Parse content
      let content = req.body.content;
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

      // Parse block video map
      let blockVideoMap = {};
      if (req.body.blockVideoMap) {
        try { blockVideoMap = JSON.parse(req.body.blockVideoMap); } catch (e) { blockVideoMap = {}; }
      }
      // Handle block videos
      const blockVideoFiles = req.files && req.files['blockVideos'] ? req.files['blockVideos'] : [];
      const blockVideoUrlMap = {};
      for (const file of blockVideoFiles) {
        const result = await uploadToCloudinary(file.path, { fileType: 'video', deleteAfterUpload: true });
        blockVideoUrlMap[file.originalname] = result.secure_url;
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      }

      // Map filePath to image and video blocks
      if (Array.isArray(content)) {
        content = content.map(block => {
          if (block.type === 'image') {
            // If new image uploaded for this block, set filePath
            if (blockImageMap[block.id] && blockImageUrlMap[blockImageMap[block.id]]) {
              return {
                ...block,
                data: {
                  ...block.data,
                  filePath: blockImageUrlMap[blockImageMap[block.id]]
                }
              };
            }
            // Otherwise, preserve existing filePath if present
            return {
              ...block,
              data: {
                ...block.data,
                filePath: block.data && block.data.filePath ? block.data.filePath : ''
              }
            };
          }
          if (block.type === 'media') {
            // If new video uploaded for this block, set filePath
            if (blockVideoMap[block.id] && blockVideoUrlMap[blockVideoMap[block.id]]) {
              return {
                ...block,
                data: {
                  ...block.data,
                  filePath: blockVideoUrlMap[blockVideoMap[block.id]]
                }
              };
            }
            // Otherwise, preserve existing filePath if present
            return {
              ...block,
              data: {
                ...block.data,
                filePath: block.data && block.data.filePath ? block.data.filePath : ''
              }
            };
          }
          return block;
        });
      }
      // Log image blocks for debugging
      if (Array.isArray(content)) {
        content.forEach((block, idx) => {
          if (block.type === 'image') {
            console.log(`[createDraft] Block ${idx} image block:`, block);
          }
        });
      }
      const draft = await draftService.createDraft({
        ...req.body,
        content,
        thumbnail: imageUrl,
        userId: req.user._id || req.user.id
      });
      // Log the final draft object before sending response
      console.log('[DraftController][createDraft] Final draft response:', JSON.stringify(draft, null, 2));
      res.status(201).json(draft);
    } catch (err) {
      console.error('[DraftController][createDraft] Error:', err);
      res.status(400).json({ error: err.message, ...(err.errors ? { errors: err.errors } : {}) });
    }
  }

  // Update a draft
  async updateDraft(req, res) {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    try {
      // Fetch the existing draft for cleanup logic
      const existingDraft = await draftService.getDraftById(req.params.id);

      // Handle main image (thumbnail)
      let imageUrl = '';
      let oldThumbnailUrl = '';
      if (req.files && req.files['thumbnail'] && req.files['thumbnail'][0]) {
        const result = await uploadToCloudinary(req.files['thumbnail'][0].path, { fileType: 'image', deleteAfterUpload: true });
        imageUrl = result.secure_url;
        if (fs.existsSync(req.files['thumbnail'][0].path)) fs.unlinkSync(req.files['thumbnail'][0].path);
        // Track old thumbnail for cleanup
        if (existingDraft && existingDraft.thumbnail) {
          oldThumbnailUrl = existingDraft.thumbnail;
        }
      }
      // Parse content
      let content = req.body.content;
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

      // Parse block video map
      let blockVideoMap = {};
      if (req.body.blockVideoMap) {
        try { blockVideoMap = JSON.parse(req.body.blockVideoMap); } catch (e) { blockVideoMap = {}; }
      }
      // Handle block videos
      const blockVideoFiles = req.files && req.files['blockVideos'] ? req.files['blockVideos'] : [];
      const blockVideoUrlMap = {};
      for (const file of blockVideoFiles) {
        const result = await uploadToCloudinary(file.path, { fileType: 'video', deleteAfterUpload: true });
        blockVideoUrlMap[file.originalname] = result.secure_url;
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      }

      // Track old image and video filePaths for blocks being replaced
      let oldImageFilePaths = [];
      let oldVideoFilePaths = [];
      // Track removed blocks for cleanup
      let removedImageFilePaths = [];
      let removedVideoFilePaths = [];
      // Compare old and new blocks for removal
      const oldBlocks = Array.isArray(existingDraft?.content) ? existingDraft.content : [];
      const newBlockIds = Array.isArray(content) ? content.map(b => b.id) : [];
      for (const oldBlock of oldBlocks) {
        if (!newBlockIds.includes(oldBlock.id)) {
          if (oldBlock.type === 'image' && oldBlock.data?.filePath) {
            removedImageFilePaths.push(oldBlock.data.filePath);
          }
          if (oldBlock.type === 'media' && oldBlock.data?.filePath) {
            removedVideoFilePaths.push(oldBlock.data.filePath);
          }
        }
      }

      if (Array.isArray(content)) {
        content = content.map((block, idx) => {
          if (block.type === 'image') {
            // If new image uploaded for this block, set filePath
            if (blockImageMap[block.id] && blockImageUrlMap[blockImageMap[block.id]]) {
              // Track old filePath for cleanup
              if (block.data && block.data.filePath) {
                oldImageFilePaths.push(block.data.filePath);
              }
              return {
                ...block,
                data: {
                  ...block.data,
                  filePath: blockImageUrlMap[blockImageMap[block.id]]
                }
              };
            }
            // Otherwise, preserve existing filePath if present
            return {
              ...block,
              data: {
                ...block.data,
                filePath: block.data && block.data.filePath ? block.data.filePath : ''
              }
            };
          }
          if (block.type === 'media') {
            // If new video uploaded for this block, set filePath
            if (blockVideoMap[block.id] && blockVideoUrlMap[blockVideoMap[block.id]]) {
              // Track old filePath for cleanup
              if (block.data && block.data.filePath) {
                oldVideoFilePaths.push(block.data.filePath);
              }
              return {
                ...block,
                data: {
                  ...block.data,
                  filePath: blockVideoUrlMap[blockVideoMap[block.id]]
                }
              };
            }
            // Otherwise, preserve existing filePath if present
            return {
              ...block,
              data: {
                ...block.data,
                filePath: block.data && block.data.filePath ? block.data.filePath : ''
              }
            };
          }
          return block;
        });
      }
      // Log image blocks for debugging
      if (Array.isArray(content)) {
        content.forEach((block, idx) => {
          if (block.type === 'image') {
            console.log(`[updateDraft] Block ${idx} image block:`, block);
          }
        });
      }
      const draft = await draftService.updateDraft(req.params.id, {
        ...req.body,
        content,
        ...(imageUrl && { thumbnail: imageUrl })
      });
      // After update, check and cleanup old images
      for (const oldFilePath of oldImageFilePaths.concat(removedImageFilePaths)) {
        const publicId = extractCloudinaryPublicId(oldFilePath);
        if (publicId) {
          // Check references in other drafts/blogs before deleting
          const stillReferenced = await draftService.isImageReferenced(publicId) || await blogService.isImageReferenced(publicId);
          if (!stillReferenced) {
            await deleteFromCloudinary(publicId);
            console.log(`[Cleanup] Deleted unused image from Cloudinary: ${publicId}`);
          } else {
            console.log(`[Cleanup] Image still referenced, not deleted: ${publicId}`);
          }
        }
      }
      // After update, check and cleanup old videos
      for (const oldFilePath of oldVideoFilePaths.concat(removedVideoFilePaths)) {
        const publicId = extractCloudinaryPublicId(oldFilePath);
        if (publicId) {
          // Check references in other drafts/blogs before deleting
          const stillReferenced = await draftService.isImageReferenced(publicId) || await blogService.isImageReferenced(publicId);
          if (!stillReferenced) {
            await deleteFromCloudinary(publicId, { resource_type: 'video' });
            console.log(`[Cleanup] Deleted unused video from Cloudinary: ${publicId}`);
          } else {
            console.log(`[Cleanup] Video still referenced, not deleted: ${publicId}`);
          }
        }
      }
      // After update, check and cleanup old thumbnail
      if (oldThumbnailUrl && oldThumbnailUrl !== imageUrl) {
        const publicId = extractCloudinaryPublicId(oldThumbnailUrl);
        if (publicId) {
          const stillReferenced = await draftService.isImageReferenced(publicId) || await blogService.isImageReferenced(publicId);
          if (!stillReferenced) {
            await deleteFromCloudinary(publicId);
            console.log(`[Cleanup] Deleted unused thumbnail from Cloudinary: ${publicId}`);
          } else {
            console.log(`[Cleanup] Thumbnail still referenced, not deleted: ${publicId}`);
          }
        }
      }
      // Log the final draft object before sending response
      console.log('[DraftController][updateDraft] Final draft response:', JSON.stringify(draft, null, 2));
      res.status(200).json(draft);
    } catch (err) {
      console.error('[DraftController][updateDraft] Error:', err);
      res.status(400).json({ error: err.message, ...(err.errors ? { errors: err.errors } : {}) });
    }
  }

  // Get all drafts for the user
  async getDrafts(req, res) {
    try {
      const drafts = await draftService.getDraftsByUser(req.user._id || req.user.id);
      res.status(200).json(drafts);
    } catch (err) {
      console.error('[DraftController][getDrafts] Error:', err);
      res.status(400).json({ error: err.message, ...(err.errors ? { errors: err.errors } : {}) });
    }
  }

  // Get a single draft
  async getDraftById(req, res) {
    try {
      const draft = await draftService.getDraftById(req.params.id);
      if (!draft) return res.status(404).json({ error: 'Draft not found' });
      if (String(draft.userId) !== String(req.user._id || req.user.id)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      res.status(200).json(draft);
    } catch (err) {
      console.error('[DraftController][getDraftById] Error:', err);
      res.status(400).json({ error: err.message, ...(err.errors ? { errors: err.errors } : {}) });
    }
  }

  // Delete a draft
  async deleteDraft(req, res) {
    try {
      const draft = await draftService.getDraftById(req.params.id);
      if (!draft) return res.status(404).json({ error: 'Draft not found' });
      if (String(draft.userId) !== String(req.user._id || req.user.id)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      await draftService.deleteDraft(req.params.id);
      res.status(204).send();
    } catch (err) {
      console.error('[DraftController][deleteDraft] Error:', err);
      res.status(400).json({ error: err.message, ...(err.errors ? { errors: err.errors } : {}) });
    }
  }

  // Publish a draft (create blog, then delete draft)
  async publishDraft(req, res) {
    try {
      const draft = await draftService.getDraftById(req.params.id);
      // Log the draft fields for debugging
      console.log('[publishDraft] Draft fields:', draft.toObject ? draft.toObject() : draft);
      if (!draft) return res.status(404).json({ error: 'Draft not found' });
      if (String(draft.userId) !== String(req.user._id || req.user.id)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      // Expand content blocks
      let expandedBlocks = [];
      if (Array.isArray(draft.content)) {
        expandedBlocks = draft.content.map(block => ({
          ...block.data,
          type: block.type,
          id: block.id
        }));
      }
      // Create blog from draft with expanded content
      const blog = await blogService.createBlog({
        ...draft.toObject(),
        author: draft.userId,
        isPublished: true,
        content: expandedBlocks
      });
      // Log the blog fields for inspection
      if (process.env.NODE_ENV !== 'test') {
        console.log('[publishDraft] Blog fields:');
        for (const [key, value] of Object.entries(blog.toObject ? blog.toObject() : blog)) {
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
      // Delete draft
      await draftService.deleteDraft(req.params.id);
      res.status(201).json(blog);
    } catch (err) {
      console.error('[DraftController][publishDraft] Error:', err);
      res.status(400).json({ error: err.message, ...(err.errors ? { errors: err.errors } : {}) });
    }
  }
}

export default DraftController;
