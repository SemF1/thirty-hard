import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Home from "./components/Home";
import CharacterSelect from "./components/CharacterSelect";
import ProgressBoard from "./components/ProgressBoard";
import ProgressMap from "./components/ProgressMap";
import { fetchUsers } from "./api";
import "./App.css";

function App() {
  const [screen, setScreen] = useState("home");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = async () => {
    const res = await fetchUsers();
    setUsers(res.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadUsers();
    };
    fetchData();
  }, []);

  const screenVariants = {
    initial: { opacity: 0, x: 80 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -80 },
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {screen === "home" && (
          <motion.div
            key="home"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.45, ease: "easeInOut" }}
          >
            <Home
              onNew={() => setScreen("create")}
              onReturning={() => setScreen("select")}
              onMap={() => setScreen("map")}
            />
          </motion.div>
        )}

        {screen === "map" && (
          <motion.div
            key="map"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.45, ease: "easeInOut" }}
          >
            <ProgressMap onBack={() => setScreen("home")} />
          </motion.div>
        )}

        {screen === "select" && (
          <motion.div
            key="select"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.45, ease: "easeInOut" }}
          >
            <CharacterSelect
              users={users}
              onSelect={(user) => {
                setSelectedUser(user);
                setScreen("progress");
              }}
              onBack={() => setScreen("home")}
            />
          </motion.div>
        )}

        {screen === "create" && (
          <motion.div
            key="create"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.45, ease: "easeInOut" }}
          >
            <CharacterSelect
              createMode
              onCreated={(user) => {
                setSelectedUser(user);
                setScreen("progress");
              }}
              onBack={() => setScreen("home")}
            />
          </motion.div>
        )}

        {screen === "progress" && selectedUser && (
          <motion.div
            key="progress"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.45, ease: "easeInOut" }}
          >
            <ProgressBoard
              user={selectedUser}
              onBack={() => {
                setSelectedUser(null);
                setScreen("select");
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
