// Handles HTTP requests for User
import UserService from './user.service.js';
import { uploadToCloudinary } from '../../config/cloudinary.js';
import path from 'path';

const userService = new UserService();




export async function getProfile(req, res) {
  try {
    // Only allow user to access their own profile
    if (req.user.id !== req.params.id) return res.status(403).json({ error: 'Forbidden' });
    const user = await userService.getProfile(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


export async function updateProfile(req, res) {
  try {
    if (req.user.id !== req.params.id) return res.status(403).json({ error: 'Forbidden' });

    let updateData = { ...req.body };

    // Handle profilePic upload if file is present
    if (req.file) {
      // Save to Cloudinary
      const filePath = req.file.path;
      const result = await uploadToCloudinary(filePath, {
        folder: 'profilePics',
        fileType: 'image',
        deleteAfterUpload: true
      });
      updateData.profilePic = result.secure_url;
    }

    const user = await userService.updateProfile(req.user.id, updateData);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


export async function deleteUser(req, res) {
  try {
    if (req.user.id !== req.params.id) return res.status(403).json({ error: 'Forbidden' });
    await userService.deleteUser(req.user.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function listUsers(req, res) {
  try {
    const users = await userService.listUsers();
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function followUser(req, res) {
  try {
    if (req.user.id === req.params.id) return res.status(400).json({ error: 'Cannot follow yourself' });
    const result = await userService.followUser(req.user.id, req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function unfollowUser(req, res) {
  try {
    if (req.user.id === req.params.id) return res.status(400).json({ error: 'Cannot unfollow yourself' });
    const result = await userService.unfollowUser(req.user.id, req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getFollowers(req, res) {
  try {
    const followers = await userService.getFollowers(req.params.id);
    res.json(followers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getFollowing(req, res) {
  try {
    const following = await userService.getFollowing(req.params.id);
    res.json(following);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
