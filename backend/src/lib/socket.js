import { Server } from "socket.io";
import http from "http";
import express from "express";

// create express app
const app = express();
// create server using app
const server = http.createServer(app);

// initilise web socket server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// retrive recievers socket id
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

// handle new socket connection
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // store connected user socket id
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };