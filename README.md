# 🥇 Thirty Hard — 30-Day Challenge Tracker

**Thirty Hard** is a full-stack MERN application that helps users stay disciplined for 30 consecutive days — tracking daily goals, showing friend progress, and visualizing everyone’s journey on a shared **Challenge Map**. Users can create or return to characters, check off their daily habits, and even get an AI-generated motivational quote to keep them going.

---

## 🚀 Features

### 🧍 New Player / Returning Player
- **New Player** lets users create a unique profile with:
  - Username
  - Email
  - nickname  
- **Returning Player** allows existing users to log back in and resume their challenge progress instantly.

---

### ✅ Daily Checklist
- Each player has a **4-item checklist** that resets every day:
  - Workout  
  - Read 10 pages  
  - No junk food  
  - Cold shower  

- Completing all tasks for the day marks the day as complete and displays:
  > ✅ Everything is completed for today — come back tomorrow for the next day!

- Progress automatically saves to MongoDB and persists across sessions.

---

### 🌙 Simulate Midnight (For Grading Purposes Only)
In production, the app waits for midnight (EST) to automatically **increment the day count** and reset the checklist for the next challenge day.  

However, for grading/testing convenience, a **Simulate Midnight** button is provided to:
- Fast-forward to “midnight” instantly
- Automatically increment the day if all goals were completed. Reset to Day 1 if all goals werent completed
- Reset all goals to unchecked

> ⚠️ This button is **for grading and demo use only**.  
> It would not be part of the production build.

---

### 💪 Daily Motivation (AI-Generated)
A **Daily Motivation** button on the home screen fetches a fresh motivational quote from the backend using OpenAI’s API.  
- Integrates with `openai-node` server-side
- Provides dynamic, inspirational quotes tailored for discipline and consistency
- Adds 10% extra credit for AI integration under the project rules

---

### 🗺️ Challenge Map (Live Progress Overview)
The **Challenge Map** visually displays every player’s journey across days 1–30:
- Each player’s nickname appears **below their current day**
- Smoothly animated with **Framer Motion**

This lets you see who’s ahead and who’s catching up — creating a fun sense of community and competition.

---

### 👥 Friends Feature
- Players can **view friends’ progress** — including their current day and which goals they’ve checked off.
- The **Manage Friends** panel lets users:
  - Add or remove other players dynamically
  - See all available users from the database
  - Use live database sync through Express + MongoDB

---

## 🧠 Tech Stack

### Frontend
- **React.js**
- **Framer Motion** (for smooth animations)
- **Axios** (API calls)
- **React Icons**
- **CSS3**

### Backend
- **Node.js + Express**
- **MongoDB + Mongoose**
- **REST API** endpoints for users, progress, and motivation
- **OpenAI API** for motivational quote generation
- **CORS + dotenv** configuration

---

## ⚙️ How to Run Locally

### 1. Clone the Repository
git clone https://github.com/yourusername/thirty-hard.git

cd thirty-hard

2. Install Dependencies

Install backend packages:

cd server

npm install


Install frontend packages:

cd ../client

npm install

3. Setup Environment Variables

Create a .env file inside the /server directory:

MONGO_URI=your_mongodb_connection_string

OPENAI_API_KEY=your_openai_api_key

PORT=5000


Note for graders:

If you don’t have your own MongoDB or OpenAI keys, the app will still run.
You can simply start the server and use the built-in dummy data (next step).
The motivational quote feature will show a fallback message if no API key is provided.

Seed the demo users and progress data:
Run this command in your backend directory after starting the server:

npm run seed


or, if no seed script is defined:

curl -X POST http://localhost:5000/api/progress/seed-dummies


This will generate five pre-configured demo players (Victor, Connor, Mia, Leo, and Aria) with different progress states for testing and grading.

4. Run the Backend

cd server

npm start


This runs the Express API on http://localhost:5000


5. Run the Frontend

cd ../client

npm run dev


This starts the React app on http://localhost:5173

6. Access the App

Go to:
👉 http://localhost:5173

You should see the Thirty Hard Home Screen with:

New Player / Returning Player buttons

Daily Motivation generator

Challenge Map (below the home section)
