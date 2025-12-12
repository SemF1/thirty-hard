const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  day: { type: Number, default: 1 },
  goals: [
    {
      id: Number,
      text: String,
      done: Boolean,
    },
  ],
  lastCompletedDate: { type: String },
  locked: { type: Boolean, default: false },
});

module.exports = mongoose.model("Progress", progressSchema);
