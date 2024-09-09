import IRoomModel from "../../../Model/Administrative/RoomModel/IRoomModel";
import RoomModel from "../../../Model/Administrative/RoomModel/RoomModel";
import IRoomService from "./IRoomService";

class RoomService implements IRoomService {
    async createRoom(RoomData: IRoomModel): Promise<IRoomModel> {
        const room = new RoomModel(RoomData);
        const result = await room.save();
        return result;
    }

    async updateRoom(_id: string, RoomData: IRoomModel): Promise<IRoomModel | null> {
        const result = await RoomModel.findByIdAndUpdate(_id, RoomData, { new: true });
        return result;
    }

    async getRooms(): Promise<IRoomModel[]> {
        const result = await RoomModel.find();
        return result;
    }

}

const roomService = new RoomService();
export default roomService;