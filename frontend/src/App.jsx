import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import "./App.css";

const socket = io("/");

function App() {
  const [currentNumber, setCurrentNumber] = useState("--");
  const [numbers, setNumbers] = useState([]);
  const [players, setPlayers] = useState(0);

  useEffect(() => {
    socket.on("game-state", (state) => {
      setNumbers(state.numbersDrawn);
      setCurrentNumber(state.currentNumber ?? "--");
      setPlayers(state.players);
    });

    socket.on("number-drawn", (num) => {
      setCurrentNumber(num);
      setNumbers((prev) => [...prev, num]);
    });

    return () => {
      socket.off("game-state");
      socket.off("number-drawn");
    };
  }, []);

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="title">BINGO LIVE</h1>
      <p className="subtitle">Players Connected: {players}</p>

      <motion.div
        key={currentNumber}
        className="current-number"
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
      >
        {currentNumber}
      </motion.div>

      <button className="draw-btn" onClick={() => socket.emit("draw-number")}>
        DRAW NUMBER
      </button>

      <div className="numbers-grid">
        {numbers.map((num) => (
          <div key={num} className="number-ball">
            {num}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default App;
