const express = require("express");
const User = require("../models/User");

const router = express.Router();

// create user
router.post("/", async (req, res) => {
  try {
    const { username, email, character } = req.body;
    const user = new User({ username, email, character });
    const saved = await user.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user" });
  }
});

// get user by id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("friends");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});


module.exports = router;
