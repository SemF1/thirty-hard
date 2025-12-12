import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchUsers } from "../api";

export default function Home({ onNew, onReturning }) {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState([]);

  const fetchMotivation = async () => {
    setLoading(true);
    setQuote("");
    try {
      const res = await fetch("http://localhost:5000/api/motivation");
      const data = await res.json();
      setQuote(data.message);
    } catch {
      setQuote("Couldn't load motivation. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadPlayers = async () => {
      const res = await fetchUsers();
      const users = res.data || [];

      const withProgress = await Promise.all(
        users.map(async (u) => {
          try {
            const progRes = await fetch(
              `http://localhost:5000/api/progress/${u._id}`
            );
            const progData = await progRes.json();
            return {
              ...u,
              day: progData.day || 1,
            };
          } catch {
            return { ...u, day: 1 };
          }
        })
      );

      setPlayers(withProgress);
    };

    loadPlayers();
  }, []);

  const groupedByDay = players.reduce((acc, p) => {
    const day = p.day || 1;
    if (!acc[day]) acc[day] = [];
    acc[day].push(p);
    return acc;
  }, {});

  return (
    <div className="home-screen">
      <h1>Thirty Hard 🥇</h1>
      <p>Grind 30 days straight. Track your progress with friends.</p>

      <div className="home-buttons">
        <button onClick={onNew}>New Player</button>
        <button onClick={onReturning}>Returning Player</button>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <button onClick={fetchMotivation} disabled={loading}>
          {loading ? "Loading..." : "Daily Motivation 💪"}
        </button>

        {quote && (
          <p
            style={{
              marginTop: "1rem",
              background: "#dcfce7",
              color: "#166534",
              padding: "0.8rem 1.2rem",
              borderRadius: "10px",
              fontWeight: "600",
              maxWidth: "400px",
              marginInline: "auto",
            }}
          >
            {quote}
          </p>
        )}
      </div>

      <div className="map-section">
        <h2>🏁 Challenge Map</h2>

        <div className="timeline-container">
          <div className="timeline-line" />

          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="day-label"
              style={{ left: `${(i / 29) * 100}%` }}
            >
              {i + 1}
            </div>
          ))}

          {Object.entries(groupedByDay).map(([dayStr, users]) => {
            const day = Number(dayStr) || 1;
            const xPercent = ((day - 1) / 29) * 100;

            return users.map((p, idx) => (
              <motion.div
                key={p._id}
                className="player-dot"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: idx % 2 === 0 ? idx * -40 : idx * -40 - 20,
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ left: `${xPercent}%` }}
              >
                <div className="player-connector" />
                <span className="player-label">{p.character || p.username}</span>
              </motion.div>
            ));
          })}

        </div>
      </div>
    </div>
  );
}
