const mongoose = require('mongoose');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');
const Bookmark = require('../models/Bookmark');
require('dotenv').config({ path: __dirname + '/../.env' });

const resetUsersAndSeedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codesolver';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
    console.log('Connected to MongoDB. Resetting all users...');

    // 1. Delete all users, progress, and bookmarks
    const [deletedUsers, deletedProgress, deletedBookmarks] = await Promise.all([
      User.deleteMany({}),
      UserProgress.deleteMany({}),
      Bookmark.deleteMany({})
    ]);

    console.log(`Deleted ${deletedUsers.deletedCount} users, ${deletedProgress.deletedCount} progress records, ${deletedBookmarks.deletedCount} bookmarks.`);

    // 2. Create the exclusive Admin Account
    const adminUser = new User({
      name: 'CodeSolver Admin',
      email: 'codesolver@gmail.com',
      password_hash: 'I love you daddy@143',
      role: 'admin'
    });

    await adminUser.save();
    console.log('✅ Created exclusive Admin account:');
    console.log('   Name: CodeSolver Admin');
    console.log('   Email: codesolver@gmail.com');
    console.log('   Password: I love you daddy@143');
    console.log('   Role: admin');

    console.log('\nAll users reset successfully! Only codesolver@gmail.com is Admin.');
    return adminUser;
  } catch (error) {
    console.error('Error resetting users:', error);
    throw error;
  }
};

if (require.main === module) {
  resetUsersAndSeedAdmin()
    .then(() => {
      console.log('Reset complete.');
      process.exit(0);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = resetUsersAndSeedAdmin;
