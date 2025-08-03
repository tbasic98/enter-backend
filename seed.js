// seed.js
const bcrypt = require('bcrypt');
const { sequelize, User, Room, Meeting } = require('./models');

async function seed() {
  try {
    // Drop and recreate all tables
    await sequelize.sync({ force: true });
    console.log('✅ Database synced.');

    // Hash password
    const passwordHash = await bcrypt.hash('password123', 10);

    // Create Users
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      username: 'admin',
      email: 'admin@example.com',
      password: passwordHash,
      role: 'admin',
    });

    const user = await User.create({
      firstName: 'Test',
      lastName: 'User',
      username: 'testuser',
      email: 'user@example.com',
      password: passwordHash,
      role: 'user',
    });

    // Create Rooms
    const room1 = await Room.create({ name: 'Conference Room 1' });
    const room2 = await Room.create({ name: 'Conference Room 2' });

    // Create Meetings
    await Meeting.create({
      title: 'Project Kickoff',
      description: 'Initial project meeting.',
      startTime: new Date(),
      endTime: new Date(Date.now() + 60 * 60 * 1000), // +1 hour
      userId: admin.id,
      roomId: room1.id,
    });

    await Meeting.create({
      title: 'Weekly Sync',
      description: 'Team weekly sync-up.',
      startTime: new Date(),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // +2 hours
      userId: user.id,
      roomId: room2.id,
    });

    console.log('🌱 Seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
