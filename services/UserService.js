const User = require('../models/User');

class UserService {
  static async getAllUsers({ page = 1, limit = 10, search = '', role }) {
    const nameParts = search.trim().split(' ').filter(Boolean);
    let whereClause = {};

    if (nameParts.length === 1) {
      whereClause = {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${nameParts[0]}%` } },
          { lastName: { [Op.iLike]: `%${nameParts[0]}%` } }
        ]
      };
    } else if (nameParts.length >= 2) {
      whereClause = {
        firstName: { [Op.iLike]: `%${nameParts[0]}%` },
        lastName: { [Op.iLike]: `%${nameParts[nameParts.length - 1]}%` }
      };
    }

    if (role) {
      whereClause.role = role;
    }

    const offset = (page - 1) * limit;

    const { rows: users, count: total } = await User.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['lastName', 'ASC'], ['firstName', 'ASC']],
    });

    return {
      users,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / limit),
    };
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
