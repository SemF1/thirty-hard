import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { fetchUsers } from "../api";

export default function ProgressBoard({ user, onBack }) {
  const defaultGoals = [
    { id: 1, text: "Workout", done: false },
    { id: 2, text: "Read 10 pages", done: false },
    { id: 3, text: "No junk food", done: false },
    { id: 4, text: "Cold shower", done: false },
  ];

  const [goals, setGoals] = useState(defaultGoals);
  const [day, setDay] = useState(1);
  const [locked, setLocked] = useState(false);
  const [friends, setFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [view, setView] = useState("self"); 
  const [hasLoaded, setHasLoaded] = useState(false);

  const getESTDate = () => {
    const now = new Date();
    const estOffset = now.getTimezoneOffset() + 300;
    const est = new Date(now.getTime() - estOffset * 60000);
    return est.toISOString().split("T")[0];
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/progress/${user._id}`);
        if (res.data?.goals?.length) {
          setGoals(res.data.goals);
          setDay(res.data.day || 1);
          setLocked(res.data.locked || false);
        }
      } catch {
        const saved = localStorage.getItem(`thirtyhard_${user._id}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          setGoals(parsed.goals || defaultGoals);
          setDay(parsed.day || 1);
          setLocked(parsed.locked || false);
        }
      } finally {
        setHasLoaded(true);
      }
    };
    load();
  }, [user]);


  useEffect(() => {
    if (!hasLoaded) return;
    axios
      .post(`http://localhost:5000/api/progress/${user._id}`, {
        goals,
        day,
        locked,
        lastCompletedDate: getESTDate(),
      })
      .catch(() => {});
  }, [goals, day, locked, hasLoaded]);


const loadFriends = async () => {
  console.log(" Loading friends for:", user._id);
  try {
    const res = await axios.get(`http://localhost:5000/api/progress/${user._id}/friends`);
    console.log(" Loaded friends:", res.data);
    setFriends(res.data);
    setView("friends");
  } catch (err) {
    console.error("Error loading friends:", err.message);
  }
};


const loadAllUsers = async () => {
  console.log("📥 Loading all users...");
  const res = await fetchUsers();
  console.log(" All users:", res.data);
  setAllUsers(res.data.filter((u) => u._id !== user._id));
  setView("manage");
};

const toggleFriend = async (friendId) => {
  console.log(" Toggling friend:", friendId);
  try {
    const res = await axios.post(`http://localhost:5000/api/progress/${user._id}/friend/${friendId}`);
    console.log(" Backend response:", res.data);

    await Promise.all([loadAllUsers(), loadFriends()]);
    console.log(" Reloaded both users & friends");
  } catch (err) {
    console.error(" toggleFriend error:", err.message);
  }
};


  const toggleGoal = (id) => {
    if (locked) return;
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g)));
  };

  const slideVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

function CountdownEST({ onNextDay }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const nowUTC = new Date();
      const estNow = new Date(nowUTC.toLocaleString("en-US", { timeZone: "America/New_York" }));

      const midnightEST = new Date(estNow);
      midnightEST.setHours(24, 0, 0, 0);

      const diff = midnightEST - estNow;

      if (diff <= 1000) {
        onNextDay?.();
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [onNextDay]);

  return (
    <div style={{ marginTop: "0.4rem", fontSize: "0.95rem", color: "#065f46" }}>
      ⏰ Next day unlocks in {timeLeft}
    </div>
  );
}




  return (
    <AnimatePresence mode="wait">
      {view === "friends" && (
        <motion.div
          key="friends"
          className="progress-board"
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4 }}
        >
          <button className="back-btn" onClick={() => setView("self")}>
            ← Back to Me
          </button>
          <h2>👥 Friends’ Progress</h2>
          {friends.length === 0 ? (
            <p>No friends added yet.</p>
          ) : (
            <div className="friends-scroll">
              {friends.map((f) => (
                <motion.div
                  key={f._id}
                  className="friend-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <h3>
                    {f.username} — Day {f.day}
                  </h3>
                  <p>{f.character}</p>
                  <div className="friend-goals">
                    {f.goals.map((g) => (
                      <motion.div
                        key={g.id}
                        className={`goal ${g.done ? "done" : ""}`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {g.text}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {view === "manage" && (
        <motion.div
          key="manage"
          className="progress-board"
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4 }}
        >
          <button className="back-btn" onClick={() => setView("self")}>
            ← Back
          </button>
          <h2>Manage Friends</h2>
          {allUsers.length === 0 ? (
            <p>Loading users...</p>
          ) : (
            allUsers.map((u) => {
              const isFriend = friends.some((f) => f._id === u._id);
              return (
                <motion.div
                  key={u._id}
                  className="friend-card manage-card"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div>
                    <strong>{u.username}</strong> — {u.character}
                  </div>
                  <button
                    className={`friend-toggle ${isFriend ? "remove" : "add"}`}
                    onClick={() => toggleFriend(u._id)}
                  >
                    {isFriend ? "Remove" : "Add"}
                  </button>
                </motion.div>
              );
            })
          )}
        </motion.div>
      )}

{view === "self" && (
  <motion.div
    key="self"
    className="progress-board"
    variants={slideVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.4 }}
  >
    <button className="back-btn" onClick={() => onBack?.() || window.history.back()}>
      ← Back
    </button>

    <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      {user.username} — Day {day}
    </motion.h2>
    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {user.character}
    </motion.p>

    <div className="goals-list">
      {goals.map((g) => (
        <motion.div
          key={g.id}
          className={`goal ${g.done ? "done" : ""}`}
          onClick={() => toggleGoal(g.id)}
          whileTap={{ scale: 0.9 }}
          animate={
            g.done
              ? { scale: [1, 1.1, 1], rotate: [0, -2, 2, 0] }
              : { scale: 1, rotate: 0 }
          }
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {g.text}
        </motion.div>
      ))}
    </div>

    {/* ✅ NEW: Show this only when everything is checked */}
{goals.every((g) => g.done) && (
  <motion.div
    className="complete-message"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    style={{
      margin: "1.5rem auto",
      fontWeight: "600",
      color: "#166534",
      background: "#dcfce7",
      padding: "1rem 1.4rem",
      borderRadius: "10px",
      display: "block",
      textAlign: "center",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    }}
  >
    ✅ Everything is completed for today! Great Job!!
    <CountdownEST
      onNextDay={() => {
        const allDone = goals.every((g) => g.done);
        if (allDone) {
          setDay((d) => d + 1);
        } else {
          setDay(1);
        }
        setGoals((prev) => prev.map((g) => ({ ...g, done: false })));
        setLocked(false);
      }}
    />
  </motion.div>
)}
{process.env.NODE_ENV === "development" && (
  <button
    onClick={() => {
      const allDone = goals.every((g) => g.done);
      if (allDone) setDay((d) => d + 1);
      else setDay(1);
      setGoals((prev) => prev.map((g) => ({ ...g, done: false })));
    }}
  >
    🔁 Simulate Midnight
  </button>
)}





    <motion.button
      className="friends-btn"
      onClick={loadFriends}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ marginTop: "1.5rem" }}
    >
      View Friends 👥
    </motion.button>
    <motion.button
      className="friends-btn"
      onClick={loadAllUsers}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ marginTop: "0.5rem" }}
    >
      Manage Friends ⚙️
    </motion.button>
  </motion.div>
)}

    </AnimatePresence>
  );
}
