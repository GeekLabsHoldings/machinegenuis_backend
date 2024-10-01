import { DepartmentEnum } from "../DepartmentAndRoles";
import eventEmitter from "./eventEmitter";

export const BroadCastMessageEvent = (io)=>{
    eventEmitter.on("BroadCastNotification", (data) => {
        Object.values(DepartmentEnum).forEach((department) => {
          const roomName = `department_${department}`;
          io.to(roomName).emit("BroadCastMessage", data);
          console.log(`Message sent to ${roomName}:`, data);
        });
      });
}
