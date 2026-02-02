const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Bingo state (in-memory for now)
let gameState = {
  numbersDrawn: [],
  currentNumber: null,
  players: 0
};

// Generate Bingo number (1–75)
function drawNumber() {
  if (gameState.numbersDrawn.length === 75) return null;

  let num;
  do {
    num = Math.floor(Math.random() * 75) + 1;
  } while (gameState.numbersDrawn.includes(num));

  gameState.numbersDrawn.push(num);
  gameState.currentNumber = num;
  return num;
}

// Socket.IO events
io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);
  gameState.players++;

  socket.emit("game-state", gameState);

  socket.on("draw-number", () => {
    const number = drawNumber();
    if (number) {
      io.emit("number-drawn", number);
    }
  });

  socket.on("disconnect", () => {
    gameState.players--;
    console.log("Player disconnected:", socket.id);
  });
});

// Health check
app.get("/", (req, res) => {
  res.send("Bingo backend is running");
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Bingo backend running on port ${PORT}`);
});
