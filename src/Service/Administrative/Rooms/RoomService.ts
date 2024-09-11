import IRoomModel from "../../../Model/Administrative/RoomModel/IRoomModel";
import RoomModel from "../../../Model/Administrative/RoomModel/RoomModel";
import { OfficeCleaningEnum } from "../../../Utils/Administrative";
import IRoomService from "./IRoomService";

class RoomService implements IRoomService {
    async createRoom(RoomData: IRoomModel): Promise<IRoomModel> {
        const room = new RoomModel(RoomData);
        const result = await room.save();
        return result;
    }

    async updateRoom(_id: string, typeStatus: string, warning: boolean): Promise<IRoomModel | null> {
        const result = await RoomModel.findByIdAndUpdate(_id, { $set: { typeStatus, warning } }, { new: true });
        return result;
    }

    async getRooms(): Promise<IRoomModel[]> {
        const result = await RoomModel.find();
        return result;
    }

    async resetRoomsStatus(): Promise<void> {
        await RoomModel.updateMany({ typeStatus: OfficeCleaningEnum.Missed }, { $set: { warning: true } });
        await RoomModel.updateMany({}, { $set: { typeStatus: OfficeCleaningEnum.CheckList } });
    }
}

const roomService = new RoomService();
export default roomService;