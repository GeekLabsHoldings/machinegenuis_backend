import IRoomModel from "../../../Model/Administrative/RoomModel/IRoomModel";

export default interface IRoomController {
    createRoom(roomData: IRoomModel): Promise<IRoomModel>;
    updateRoom(_id: string, roomStatus: string): Promise<IRoomModel>;
    getRooms(): Promise<Record<string, IRoomModel[]>>;
}