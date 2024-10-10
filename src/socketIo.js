import { Server } from "socket.io";
import { isAuthenticated } from "./middleware/socket.auth.js";
import {
  handleMessage,
  msgHandler,
} from "./Controller/chat/chat.controller.js";
import { DepartmentEnum } from "./Utils/DepartmentAndRoles/index";
import { BroadCastMessageEvent } from "./Utils/EventEmitter/BroadCastMessageEvent.js";
import { NewTweetsEvent } from "./Utils/EventEmitter/NewTweetsEvent.js";
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
  msgHandler(io, socket);
  const user = socket.handshake.user;
  console.log(`New client connected: ${socket.id}`);
  if (user.department && Array.isArray(user.department)) {
    user.department.forEach((dept) => {
      const roomName = `department_${dept}`;
      socket.join(roomName);
      console.log(`User ${user.firstName} joined room: ${roomName}`);
    });
  }
  NewTweetsEvent(user, io);
  BroadCastMessageEvent(io);
};
export { io };
