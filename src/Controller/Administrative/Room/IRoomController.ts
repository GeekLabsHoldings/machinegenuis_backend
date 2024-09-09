import IRoomModel from "../../../Model/Administrative/RoomModel/IRoomModel";

export default interface IRoomController {
    createRoom(roomData: IRoomModel): Promise<IRoomModel>;
    updateRoom(_id: string, roomData: IRoomModel): Promise<IRoomModel>;
    getRooms(): Promise<IRoomModel[]>;
}