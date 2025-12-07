require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/users");
const challengeRoutes = require("./routes/challenges");
const progressRoutes = require("./routes/progress");
const friendRoutes = require("./routes/friends");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "30 Hard API is running" });
});

app.use("/api/users", userRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/friends", friendRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Mongo connection error", err);
  });
