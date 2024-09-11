import IRoomModel from "../../../Model/Administrative/RoomModel/IRoomModel";

export default interface IRoomService {
    createRoom(RoomData: IRoomModel): Promise<IRoomModel>;
    updateRoom(_id: string, typeStatus: string, warning: boolean): Promise<IRoomModel | null>;
    resetRoomsStatus(): Promise<void>;
    getRooms(): Promise<IRoomModel[]>;
}