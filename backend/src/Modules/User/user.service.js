// Handles business logic for User

import UserRepository from './user.repository.js';

const userRepository = new UserRepository();

export default class UserService {

  async createUser(userData) {
    // Only for admin/system use, not for registration
    return await userRepository.create(userData);
  }

  async getProfile(id) {
    return await userRepository.findById(id);
  }

  async updateProfile(id, update) {
    // update may include profilePic URL if uploaded
    return await userRepository.updateById(id, update);
  }

  async deleteUser(id) {
    return await userRepository.deleteById(id);
  }

  async listUsers() {
    return await userRepository.getAll();
  }

  async followUser(userId, targetId) {
    if (userId === targetId) throw new Error('Cannot follow yourself');
    // Add targetId to user's following, and userId to target's followers
    const user = await userRepository.findById(userId);
    const target = await userRepository.findById(targetId);
    if (!user || !target) throw new Error('User not found');
    if (user.following.includes(targetId)) throw new Error('Already following');
    user.following.push(targetId);
    target.followers.push(userId);
    await user.save();
    await target.save();
    return { message: 'Followed successfully' };
  }

  async unfollowUser(userId, targetId) {
    if (userId === targetId) throw new Error('Cannot unfollow yourself');
    const user = await userRepository.findById(userId);
    const target = await userRepository.findById(targetId);
    if (!user || !target) throw new Error('User not found');
    if (!user.following.includes(targetId)) throw new Error('Not following');
    user.following = user.following.filter(id => id.toString() !== targetId);
    target.followers = target.followers.filter(id => id.toString() !== userId);
    await user.save();
    await target.save();
    return { message: 'Unfollowed successfully' };
  }

  async getFollowers(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');
    return await userRepository.findUsersByIds(user.followers);
  }

  async getFollowing(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');
    return await userRepository.findUsersByIds(user.following);
  }
}
