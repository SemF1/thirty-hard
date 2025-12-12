const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    character: {
      type: String,
      default: "default",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
