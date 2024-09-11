import IRoomModel from "../../../Model/Administrative/RoomModel/IRoomModel";
import roomService from "../../../Service/Administrative/Rooms/RoomService";
import { OfficeCleaningEnum } from "../../../Utils/Administrative";
import { ErrorMessages } from "../../../Utils/Error/ErrorsEnum";
import systemError from "../../../Utils/Error/SystemError";
import IRoomController from "./IRoomController";
export default class RoomController implements IRoomController {
    async createRoom(roomData: IRoomModel): Promise<IRoomModel> {
        const result = await roomService.createRoom(roomData);
        return result;
    }

    async updateRoom(_id: string, typeStatus: string): Promise<IRoomModel> {
        const warning = typeStatus === OfficeCleaningEnum.Done ? false : true;
        const result = await roomService.updateRoom(_id, typeStatus, warning);
        if (!result)
            return systemError.setStatus(404).setMessage(ErrorMessages.ROOM_NOT_FOUND).throw();
        return result;
    }

    async getRooms(): Promise<Record<string, IRoomModel[]>> {
        const rooms = await roomService.getRooms();
        const result: Record<string, IRoomModel[]> = {};
        rooms.forEach((room: IRoomModel) => {
            if (!result[room.typeStatus]) {
                result[room.typeStatus] = [];
            }
            result[room.typeStatus].push(room);
        });
        return result;
    }
}