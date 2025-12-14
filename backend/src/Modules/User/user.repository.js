// Handles direct database operations for User
import User from './user.model.js';

export default class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findById(id) {
    return await User.findById(id);
  }

  async updateById(id, update) {
    return await User.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteById(id) {
    return await User.findByIdAndDelete(id);
  }

  async getAll() {
    return await User.find();
  }

  async findUsersByIds(ids) {
    return await User.find({ _id: { $in: ids } }, '-password');
  }
}
