import IRoomModel from "../../../Model/Administrative/RoomModel/IRoomModel";

export default interface IRoomService {
    createRoom(RoomData: IRoomModel): Promise<IRoomModel>;
    updateRoom(_id: string, RoomData: IRoomModel): Promise<IRoomModel | null>;
    getRooms(): Promise<IRoomModel[]>;
}