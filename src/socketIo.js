import { Server } from "socket.io";
import { isAuthenticated } from "./middleware/socket.auth.js";
import {
  handleMessage,
  msgHandler,
} from "./Controller/chat/chat.controller.js";

let io;

export default function createIo(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  console.log("socket.io server created");
  // authentication middleware
  io.use(isAuthenticated);

  // Set up the connection event handler here
  io.on("connection", onConnection);
}

// Define the onConnection function
const onConnection = (socket) => {
  console.log(`New client connected: ${socket.id}`);
  msgHandler(io, socket);
  
};
