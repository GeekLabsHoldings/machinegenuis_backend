import { DepartmentEnum } from "../DepartmentAndRoles";
import eventEmitter from "./eventEmitter";

export const NewTweetsEvent = (io) => {    
  eventEmitter.on("TwitterNewTweets", (data) => {
    console.log("Event Received: Post Added to Approval Queue:", data);
    
    // Iterate through all connected sockets
    io.sockets.sockets.forEach((socket) => {
      const user = socket.handshake.user;
      console.log("socket.user",user);
      
      if (user && user.department.includes(DepartmentEnum.SocialMedia)) {
        const socialMediaRoom = `department_${DepartmentEnum.SocialMedia}`;
        io.to(socialMediaRoom).emit("NewTweets", data);
        console.log(`Message sent to ${socialMediaRoom}:`, data);
      }
    });
  });
};
