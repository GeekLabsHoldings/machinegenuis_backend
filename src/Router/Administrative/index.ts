import { Router } from "express";
import TicketsRouter from "./TicketsRouter";
import RoomRouter from "./RoomRouter";

const AdministrativeRouter = Router();

AdministrativeRouter.use('/tickets', TicketsRouter);
AdministrativeRouter.use('/rooms', RoomRouter);

export default AdministrativeRouter;