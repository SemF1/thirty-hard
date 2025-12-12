import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchUsers } from "../api";

export default function ProgressMap({ onBack }) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetchUsers();
      setPlayers(res.data);
    };
    load();
  }, []);

  return (
    <div className="map-screen">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <h2>🏁 Challenge Map</h2>
      <div className="timeline">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="day-marker" style={{
            position: "absolute",
            left: `${(i / 29) * 100}%`,
            top: 0,
            transform: "translateX(-50%)",
            color: "#94a3b8",
            fontSize: "0.7rem",
          }}>
            {i + 1}
          </div>
        ))}

        {players.map((p, i) => (
          <motion.div
            key={p._id}
            className="player-marker"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              x: `${((p.day - 1) / 29) * 100}%`,
              y: Math.sin(i) * 25,
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{
              position: "absolute",
              bottom: "40px",
              left: 0,
              transform: "translateX(-50%)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                background: "#3b82f6",
                color: "white",
                padding: "6px 10px",
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "0.85rem",
                whiteSpace: "nowrap",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}
            >
              {p.character || p.username}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
