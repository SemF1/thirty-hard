const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found" });
    }

    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      await user.save();
    }

    if (!friend.friends.includes(userId)) {
      friend.friends.push(userId);
      await friend.save();
    }

    res.json({ message: "Friends linked", user, friend });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding friend" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("friends");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.friends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching friends" });
  }
});

module.exports = router;
