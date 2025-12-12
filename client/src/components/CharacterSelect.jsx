import { useState } from "react";
import { createUser } from "../api";
import { motion } from "framer-motion";

export default function CharacterSelect({ users, onSelect, createMode, onCreated, onBack }) {
  const [form, setForm] = useState({ username: "", email: "", character: "" });

  const handleCreate = async () => {
    const res = await createUser(form);
    onCreated(res.data);
  };

  return (
    <div className="character-select">
      <h2>{createMode ? "Create Your Character" : "Select Your Character"}</h2>

      {createMode ? (
        <div className="form">
          <input
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            placeholder="Nickname"
            value={form.character}
            onChange={(e) => setForm({ ...form, character: e.target.value })}
          />
          <motion.button
            onClick={handleCreate}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Start Challenge
          </motion.button>
        </div>
      ) : (
        <div className="user-list">
          {users.map((u, i) => (
            <motion.div
              key={u._id}
              className="user-card"
              onClick={() => onSelect(u)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <h3>{u.username}</h3>
              <p>{u.character}</p>
            </motion.div>
          ))}
        </div>
      )}
      <motion.button
        onClick={onBack}
        className="back-btn"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back
      </motion.button>
    </div>
  );
}
