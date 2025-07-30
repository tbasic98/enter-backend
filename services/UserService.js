const User = require('../models/User');

class UserService {
  static async getAllUsers() {
    return await User.findAll();
  }

  static async getUserById(id) {
    return await User.findByPk(id);
  }

  static async createUser(data) {
    return await User.create(data);
  }

  static async updateUser(id, updates) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(updates);
  }

  static async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.destroy();
    return user;
  }

  static async updateRole(id, role) {
    const user = await User.findByPk(id);
    if (!user) return null;
    user.role = role;
    await user.save();
    return user;
  }
}

module.exports = UserService;
