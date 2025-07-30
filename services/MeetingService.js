const { Meeting, Op } = require('../models');

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

module.exports = {
  isRoomAvailable,
  createMeeting,
};
