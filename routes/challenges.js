const express = require("express");
const Challenge = require("../models/Challenge");

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const { owner, title, description, durationDays, startDate } = req.body;

    const start = new Date(startDate);
    const duration = durationDays || 30;
    const end = new Date(start);
    end.setDate(start.getDate() + duration);

    const challenge = new Challenge({
      owner,
      title,
      description,
      durationDays: duration,
      startDate: start,
      endDate: end,
    });

    const saved = await challenge.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating challenge" });
  }
});


router.get("/user/:userId", async (req, res) => {
  try {
    const challenges = await Challenge.find({ owner: req.params.userId });
    res.json(challenges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching challenges" });
  }
});

module.exports = router;
