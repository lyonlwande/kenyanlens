// Defines user-related routes
import { Router } from 'express';
import multer from 'multer';
import path from 'path';

import {
  getProfile,
  updateProfile,
  deleteUser,
  listUsers,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing
} from './user.controller.js';

const router = Router();

// Multer setup for profilePic upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Registration and login are handled by the Authentication module

router.get('/:id', getProfile);
router.put('/:id', upload.single('profilePic'), updateProfile);
router.delete('/:id', deleteUser);
router.get('/', listUsers);

// Follow system endpoints
router.post('/:id/follow', followUser);
router.post('/:id/unfollow', unfollowUser);
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);

export default router;
