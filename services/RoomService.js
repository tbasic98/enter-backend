const Room = require('../models/Room');

class RoomService {
  static async getAllRooms() {
    return await Room.findAll();
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
