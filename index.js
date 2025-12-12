const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/users");
const progressRoutes = require("./routes/progressRoutes");
const OpenAI = require("openai"); // 🆕 added
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/progress", progressRoutes);
app.use("/api/users", userRoutes);

// 🧠 Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🆕 New Motivation route
app.get("/api/motivation", async (req, res) => {
  try {
    const prompt = `Give me one short motivational quote for someone staying disciplined in a 30-day challenge. Keep it under 20 words.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 40,
    });

    const message = response.choices[0].message.content.trim();
    res.json({ message });
  } catch (error) {
    console.error("Error fetching motivation:", error.message);
    res.status(500).json({ message: "Failed to generate motivation" });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Mongo connection error", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
