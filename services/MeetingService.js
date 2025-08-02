const { Op } = require('sequelize');
const { Meeting, User, Room } = require('../models');

async function getAllMeetings() {
  return await Meeting.findAll({
    include: [
      { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
      { model: Room, as: 'room', attributes: ['id', 'name', 'capacity', 'location'] },
    ],
    order: [['startTime', 'ASC']],
  });
}

async function getMeetingById(id) {
  return await Meeting.findByPk(id, {
    include: [
      { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
      { model: Room, as: 'room', attributes: ['id', 'name', 'capacity', 'location'] },
    ],
  });
}

const createMeeting = async (userId, roomId, startTime, endTime, title) => {
  const available = await isRoomAvailable(roomId, startTime, endTime);
  if (!available) {
    throw new Error('Soba je zauzeta u zadanom vremenu.');
  }

  return await Meeting.create({
    userId,
    roomId,
    startTime,
    endTime,
    title,
  });
};
async function updateMeeting(id, data) {
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

async function deleteMeeting(id) {
  const meeting = await Meeting.findByPk(id);
  if (!meeting) return false;

  await meeting.destroy();
  return true;
}


async function getAvailableRooms(startTime, endTime) {
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

async function getMeetingsByUserId(userId) {
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

const isRoomAvailable = async (roomId, startTime, endTime) => {
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
};


module.exports = {
  getAllMeetings,
  getMeetingById,
  isRoomAvailable,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  getAvailableRooms,
  getMeetingsByUserId
};
