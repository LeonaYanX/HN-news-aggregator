const cron = require("node-cron");
const User = require("../models/User");

/**
 * schedule — sets up a recurring task to automatically
 * unblock users whose temporary block period has expired.
 *
 * This task runs once every hour (on the hour).
 */
exports.schedule = () => {
  // cron pattern "0 * * * *" means: minute 0 of every hour
  cron.schedule("0 * * * *", async () => {
    try {
      // 1) Get current timestamp
      const now = new Date();

      // 2) Query for all users who:
      //    - are currently blocked (isBlocked: true)
      //    - have a non-null blockedUntil date that is <= now
      const usersToUnblock = await User.find({
        isBlocked: true,
        blockedUntil: { $ne: null, $lte: now },
      });

      // 3) For each such user, clear their block flags
      await Promise.all(
        usersToUnblock.map(async (user) => {
          user.isBlocked = false;
          user.blockedUntil = null;
          await user.save();
        })
      );

      // 4) Log how many users were unblocked this run
      console.log(`Processed ${usersToUnblock.length} blocked users.`);
    } catch (err) {
      // Catch and log any errors to prevent the cron job from crashing
      console.error("Scheduler error:", err);
    }
  });
};
