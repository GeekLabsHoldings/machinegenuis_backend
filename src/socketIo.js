import { Server } from "socket.io";
import { isAuthenticated } from "./middleware/socket.auth.js";
import {
  handleMessage,
  msgHandler,
} from "./Controller/chat/chat.controller.js";
import eventEmitter from "./Utils/CronJobs/TweetsQueue/eventEmitter.js";
import { DepartmentEnum } from "./Utils/DepartmentAndRoles/index";
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

  eventEmitter.on("TwitterNewTweets", (data) => {
    console.log("Event Received: Post Added to Approval Queue:", data);
    if (user.department.includes(DepartmentEnum.SocialMedia)) {
      const socialMediaRoom = `department_${DepartmentEnum.SocialMedia}`;
      io.to(socialMediaRoom).emit("NewTweets", data);
      console.log(`Message sent to ${socialMediaRoom}:`, data);
    }
  });
};
export { io };
