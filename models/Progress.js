const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    goals: [
      {
        id: Number,
        text: String,
        done: Boolean,
      },
    ],
    day: { type: Number, default: 1 },
    locked: { type: Boolean, default: false },
    lastCompletedDate: { type: String },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);
