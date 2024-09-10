import IRoomModel from "../../../Model/Administrative/RoomModel/IRoomModel";
import roomService from "../../../Service/Administrative/Rooms/RoomService";
import { ErrorMessages } from "../../../Utils/Error/ErrorsEnum";
import systemError from "../../../Utils/Error/SystemError";
import IRoomController from "./IRoomController";

export default class RoomController implements IRoomController {
    async createRoom(roomData: IRoomModel): Promise<IRoomModel> {
        const result = await roomService.createRoom(roomData);
        return result;
    }

    async updateRoom(_id: string, roomData: IRoomModel): Promise<IRoomModel> {
        const result = await roomService.updateRoom(_id, roomData);
        if (!result)
            return systemError.setStatus(404).setMessage(ErrorMessages.ROOM_NOT_FOUND).throw();
        return result;
    }

    async getRooms(): Promise<IRoomModel[]> {
        const result = await roomService.getRooms();
        return result;
    }
}