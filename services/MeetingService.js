const { Op } = require('sequelize');
const { Meeting, User, Room } = require('../models');

class MeetingService {

  static async getAllMeetings({ startTime, endTime } = {}) {
    const where = {};

    if (startTime && endTime) {
      where.startTime = { [Op.gte]: new Date(startTime) };
      where.endTime = { [Op.lte]: new Date(endTime) };
    } else if (startTime) {
      where.startTime = { [Op.gte]: new Date(startTime) };
    } else if (endTime) {
      where.endTime = { [Op.lte]: new Date(endTime) };
    }

    return await Meeting.findAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Room, as: 'room', attributes: ['id', 'name', 'capacity', 'location'] },
      ],
      order: [['startTime', 'ASC']],
    });
  }

  static async getMeetingById(id) {
    return await Meeting.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Room, as: 'room', attributes: ['id', 'name', 'capacity', 'location'] },
      ],
    });
  }

  static async createMeeting(userId, roomId, startTime, endTime, title, description) {
    const available = await this.isRoomAvailable(roomId, startTime, endTime);
    if (!available) {
      throw new Error('Soba je zauzeta u zadanom vremenu.');
    }

    return await Meeting.create({
      userId,
      roomId,
      startTime,
      endTime,
      title,
      description,
    });
  }

  static async updateMeeting(id, data) {
    const meeting = await Meeting.findByPk(id);

    if (!meeting) return null;

    const { roomId, startTime, endTime } = data;

    const roomChanged = roomId && roomId !== meeting.roomId;
    const timeChanged = startTime && endTime &&
                        (startTime !== meeting.startTime || endTime !== meeting.endTime);

    if (roomChanged || timeChanged) {
      const conflict = await Meeting.findOne({
        where: {
          roomId: roomId || meeting.roomId,
          id: { [Op.ne]: meeting.id },
          [Op.or]: [
            {
              startTime: { [Op.lt]: endTime },
              endTime: { [Op.gt]: startTime }
            }
          ],
        },
      });

      if (conflict) {
        throw new Error('Room is already booked for the selected time.');
      }
    }

    await meeting.update(data);
    return meeting;
  }

  static async deleteMeeting(id) {
    const meeting = await Meeting.findByPk(id);
    if (!meeting) return false;

    await meeting.destroy();
    return true;
  }

  static async getAvailableRooms(startTime, endTime) {
    const rooms = await Room.findAll();

    const bookedMeetings = await Meeting.findAll({
      where: {
        [Op.or]: [
          {
            startTime: { [Op.lt]: endTime },
            endTime: { [Op.gt]: startTime },
          },
        ],
      },
      attributes: ['roomId'],
    });

    const bookedRoomIds = bookedMeetings.map(m => m.roomId);

    return rooms.filter(room => !bookedRoomIds.includes(room.id));
  }

  static async getMeetingsByUserId(userId) {
    return Meeting.findAll({
      where: { userId },
      include: [
        {
          model: Room,
          as: 'room',
          attributes: ['id', 'name', 'location']
        }
      ],
      order: [['startTime', 'ASC']],
    });
  }

  static async getMeetingsByRoomId(roomId) {
    return Meeting.findAll({
      where: { roomId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'username', 'email', 'role']
        }
      ],
      order: [['startTime', 'ASC']],
    });
  }

  static async isRoomAvailable(roomId, startTime, endTime) {
    const overlappingMeeting = await Meeting.findOne({
      where: {
        roomId,
        [Op.or]: [
          {
            startTime: {
              [Op.between]: [startTime, endTime],
            },
          },
          {
            endTime: {
              [Op.between]: [startTime, endTime],
            },
          },
          {
            startTime: {
              [Op.lte]: startTime,
            },
            endTime: {
              [Op.gte]: endTime,
            },
          },
        ],
      },
    });

    return !overlappingMeeting;
  }
}

module.exports = MeetingService;
