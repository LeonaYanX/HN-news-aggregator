const cron = require('node-cron');
const User = require('../models/User');

// Every hour task
exports.schedule = async ()=>{
cron.schedule('0 * * * *', async () => {
  try {
    const now = new Date();

    // finding each user that is blocked
    const usersToUnblock = await User.find({
      isBlocked: true,
      blockedUntil: { $ne: null, $lte: now }
    });

    await Promise.all(usersToUnblock.map(async (user) => {
        user.isBlocked = false;
        user.blockedUntil = null;
        await user.save();
      }));

    console.log(`Processed ${usersToUnblock.length} blocked users.`);
    
  } catch (err) {
    console.error('Scheduler error:', err);
  }
});
};
