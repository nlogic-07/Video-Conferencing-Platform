import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

export const connectToServer = (server) => {
  const io = new Server(server);

  return io;
};
