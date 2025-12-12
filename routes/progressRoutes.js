const express = require("express");
const Progress = require("../models/Progress");
const User = require("../models/User");
const router = express.Router();

router.post("/seed-dummies", async (req, res) => {
  try {
    const usersData = [
      { username: "Victor", email: "victor@example.com", character: "Rogue" },
      { username: "Connor", email: "connor@example.com", character: "Mage" },
      { username: "Mia", email: "mia@example.com", character: "Warrior" },
      { username: "Leo", email: "leo@example.com", character: "Monk" },
      { username: "Aria", email: "aria@example.com", character: "Healer" },
    ];

    const users = [];
    for (const data of usersData) {
      let user = await User.findOne({ username: data.username });
      if (!user) user = await User.create(data);
      users.push(user);
    }

    const progressData = [
      {
        user: users[0]._id,
        day: 3,
        goals: [
          { id: 1, text: "Workout", done: true },
          { id: 2, text: "Read 10 pages", done: true },
          { id: 3, text: "No junk food", done: false },
          { id: 4, text: "Cold shower", done: false },
        ],
        locked: false,
        lastCompletedDate: "2025-12-08",
      },
      {
        user: users[1]._id,
        day: 8,
        goals: [
          { id: 1, text: "Workout", done: true },
          { id: 2, text: "Read 10 pages", done: true },
          { id: 3, text: "No junk food", done: true },
          { id: 4, text: "Cold shower", done: false },
        ],
        locked: false,
        lastCompletedDate: "2025-12-08",
      },
      {
        user: users[2]._id,
        day: 12,
        goals: [
          { id: 1, text: "Workout", done: true },
          { id: 2, text: "Read 10 pages", done: true },
          { id: 3, text: "No junk food", done: true },
          { id: 4, text: "Cold shower", done: true },
        ],
        locked: true,
        lastCompletedDate: "2025-12-08",
      },
      {
        user: users[3]._id,
        day: 5,
        goals: [
          { id: 1, text: "Workout", done: true },
          { id: 2, text: "Read 10 pages", done: false },
          { id: 3, text: "No junk food", done: false },
          { id: 4, text: "Cold shower", done: false },
        ],
        locked: false,
        lastCompletedDate: "2025-12-08",
      },
      {
        user: users[4]._id,
        day: 1,
        goals: [
          { id: 1, text: "Workout", done: false },
          { id: 2, text: "Read 10 pages", done: false },
          { id: 3, text: "No junk food", done: false },
          { id: 4, text: "Cold shower", done: false },
        ],
        locked: false,
        lastCompletedDate: "2025-12-08",
      },
    ];

    for (const p of progressData) {
      await Progress.findOneAndUpdate({ user: p.user }, p, { upsert: true, new: true });
    }

    res.json({ message: "Dummy users and progress created successfully", users });
  } catch (err) {
    console.error(" Seed error:", err);
    res.status(500).json({ message: "Error saving progress", error: err.message });
  }
});


router.get("/:userId", async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.params.userId });
    if (!progress) return res.json({});
    res.json(progress);
  } catch (err) {
    console.error("GET progress error:", err);
    res.status(500).json({ message: "Error fetching progress" });
  }
});

router.post("/:userId", async (req, res) => {
  try {
    const { goals, day, locked, lastCompletedDate } = req.body;
    const updated = await Progress.findOneAndUpdate(
      { user: req.params.userId },
      {
        $set: {
          goals,
          day,
          locked,
          lastCompletedDate,
          completed: goals?.every((g) => g.done),
        },
      },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("Error saving progress:", err);
    res.status(500).json({ message: "Error saving progress" });
  }
});

router.post("/:userId/friend/:friendId", async (req, res) => {
  try {
    const { userId, friendId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isFriend = user.friends.includes(friendId);
    if (isFriend) {
      user.friends = user.friends.filter((id) => id.toString() !== friendId);
    } else {
      user.friends.push(friendId);
    }
    await user.save();

    res.json({
      message: isFriend ? "Friend removed" : "Friend added",
      friends: user.friends,
    });
  } catch (err) {
    console.error("Friend toggle error:", err);
    res.status(500).json({ message: "Error updating friends" });
  }
});

router.get("/:userId/friends", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("friends");
    if (!user || !user.friends.length) return res.json([]);

    const friendsProgress = await Promise.all(
      user.friends.map(async (f) => {
        const progress = await Progress.findOne({ user: f._id });
        return {
          _id: f._id,
          username: f.username,
          character: f.character,
          day: progress?.day || 1,
          goals: progress?.goals || [],
        };
      })
    );

    res.json(friendsProgress);
  } catch (err) {
    console.error("Error loading friends’ progress:", err);
    res.status(500).json({ message: "Error loading friends’ progress" });
  }
});


module.exports = router;
