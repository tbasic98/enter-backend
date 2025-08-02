const Room = require('../models/Room');

class RoomService {
  static async getAllRooms({ page = 1, limit = 10, search = '' }) {
    const offset = (page - 1) * limit;

    let where = {};

    if (search.trim()) {
      where.name = { [Op.iLike]: `%${search.trim()}%` };
    }

    const { rows: rooms, count: total } = await Room.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']],
    });

    return {
      rooms,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getRoomById(id) {
    return await Room.findByPk(id);
  }

  static async createRoom(data) {
    return await Room.create(data);
  }

  static async updateRoom(id, updates) {
    const room = await Room.findByPk(id);
    if (!room) return null;

    return await room.update({
      name: updates.name ?? room.name,
      capacity: updates.capacity ?? room.capacity,
      location: updates.location ?? room.location,
    });
  }

  static async deleteRoom(id) {
    const room = await Room.findByPk(id);
    if (!room) return null;

    await room.destroy();
    return room;
  }
}

module.exports = RoomService;
