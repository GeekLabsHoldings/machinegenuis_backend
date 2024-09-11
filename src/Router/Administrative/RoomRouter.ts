import { Request, Response, Router } from "express";
import IRoomModel from "../../Model/Administrative/RoomModel/IRoomModel";
import RoomController from "../../Controller/Administrative/Room/RoomController";
import systemError from "../../Utils/Error/SystemError";
import { OfficeCleaningEnum } from "../../Utils/Administrative";
import moment from '../../Utils/DateAndTime';
const RoomRouter = Router();

RoomRouter.post('/create-room', async (req: Request, res: Response) => {
    try {
        const roomData: IRoomModel = {
            roomName: req.body.roomName,
            typeStatus: OfficeCleaningEnum.CheckList,
            warning: false
        }
        const roomController = new RoomController();
        const result = await roomController.createRoom(roomData);
        return res.status(201).json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});


RoomRouter.put('/update-room/:id', async (req: Request, res: Response) => {
    try {
        const typeStatus = req.body.typeStatus
        const roomController = new RoomController();
        const result = await roomController.updateRoom(req.params.id, typeStatus);
        return res.status(200).json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});


RoomRouter.get('/get-rooms', async (_, res: Response) => {
    try {
        const roomController = new RoomController();
        const result = await roomController.getRooms();
        return res.status(200).json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});



export default RoomRouter;