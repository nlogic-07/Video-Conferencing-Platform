import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

export const connectToServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["*"],
    },
  });
  io.on("connection", (socket) => {
    socket.on("join-call", (path) => {
      //creating room if not exist
      if (connections[path] == undefined) {
        connections[path] = [];
      }
      //added user
      connections[path].push(socket.id);

      timeOnline[socket.id] = new Date();

      //notified all other users
      for (let i = 0; i < connections[path].length; i++) {
        io.to(connections[path][i]).emit(
          "user-joined",
          socket.id,
          connections[path],
        );
      }

      //sending old messages to new user
      if (messages[path] != undefined) {
        for (let i = 0; i < messages[path].length; i++) {
          io.to(socket.id).emit(
            "chat-message",
            messages[path][i]["data"],
            messages[path][i]["sender"],
            messages[path][i]["socket-id-sender"],
          );
        }
      }
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("chat-message", (data, sender) => {
      let matchingRoom = "";

      for (let room in connections) {
        if (connections[room].includes(socket.id)) {
          matchingRoom = room;
          break;
        }
      }

      if (matchingRoom) {
        if (!messages[matchingRoom]) {
          messages[matchingRoom] = [];
        }

        messages[matchingRoom].push({
          sender,
          data,
          "socket-id-sender": socket.id,
        });

        connections[matchingRoom].forEach((id) => {
          io.to(id).emit("chat-message", data, sender, socket.id);
        });
      }
    });

    socket.on("disconnect", () => {
      const joinedTime = timeOnline[socket.id];
      const diffTime = joinedTime ? new Date() - joinedTime : 0;

      let matchedRoom = "";
      for (let room in connections) {
        if (connections[room].includes(socket.id)) {
          matchedRoom = room;
          break;
        }
      }
      if (matchedRoom) {
        connections[matchedRoom].forEach((id) => {
          io.to(id).emit("user-left", socket.id);
        });

        connections[matchedRoom] = connections[matchedRoom].filter(
          (id) => id !== socket.id,
        );

        if (connections[matchedRoom].length == 0) {
          delete connections[matchedRoom];
        }
      }

      delete timeOnline[socket.id];
    });
  });

  return io;
};
