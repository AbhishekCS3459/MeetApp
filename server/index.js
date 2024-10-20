const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
require("dotenv").config();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
  },
});

const rooms = {};
const users = {};

io.on("connection", (socket) => {
  console.log("a user connected " + socket.id);

  socket.on("disconnect", (params) => {
    Object.keys(rooms).map((roomId) => {
      rooms[roomId].users = rooms[roomId].users.filter((x) => x !== socket.id);
    });
    delete users[socket.id];
  });

  socket.on("join", (params) => {
    const roomId = params.roomId;
    users[socket.id] = {
      roomId: roomId,
    };
    if (!rooms[roomId]) {
      rooms[roomId] = {
        roomId,
        users: [],
      };
    }
    rooms[roomId].users.push(socket.id);
    console.log("user added to room " + roomId);
  });

  socket.on("localDescription", (params) => {
    let roomId = users[socket.id].roomId;

    let otherUsers = rooms[roomId].users;
    otherUsers.forEach((otherUser) => {
      if (otherUser !== socket.id) {
        io.to(otherUser).emit("localDescription", {
          description: params.description,
        });
      }
    });
  });

  socket.on("remoteDescription", (params) => {
    let roomId = users[socket.id].roomId;
    let otherUsers = rooms[roomId].users;

    otherUsers.forEach((otherUser) => {
      if (otherUser !== socket.id) {
        io.to(otherUser).emit("remoteDescription", {
          description: params.description,
        });
      }
    });
  });

  socket.on("iceCandidate", (params) => {
    let roomId = users[socket.id].roomId;
    let otherUsers = rooms[roomId].users;

    otherUsers.forEach((otherUser) => {
      if (otherUser !== socket.id) {
        io.to(otherUser).emit("iceCandidate", {
          candidate: params.candidate,
        });
      }
    });
  });

  socket.on("iceCandidateReply", (params) => {
    let roomId = users[socket.id].roomId;
    let otherUsers = rooms[roomId].users;

    otherUsers.forEach((otherUser) => {
      if (otherUser !== socket.id) {
        io.to(otherUser).emit("iceCandidateReply", {
          candidate: params.candidate,
        });
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
