import { DepartmentEnum } from "../DepartmentAndRoles";
import eventEmitter from "./eventEmitter";

export const NewTweetsEvent = (user,io) => {    
  eventEmitter.on("TwitterNewTweets", (data) => {
    console.log("Event Received: Post Added to Approval Queue:", data);
    if (user.department.includes(DepartmentEnum.SocialMedia)) {
      const socialMediaRoom = `department_${DepartmentEnum.SocialMedia}`;
      io.to(socialMediaRoom).emit("NewTweets", data);
      console.log(`Message sent to ${socialMediaRoom}:`, data);
    }
  });
};
