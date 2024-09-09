import { Router } from "express";
import TicketsRouter from "./TicketsRouter";
import RoomRouter from "./RoomRouter";
import SuppliesRouter from "./SuppliesRouter";
import ReceiptRouter from "./ReceiptRouter";

const AdministrativeRouter = Router();

AdministrativeRouter.use('/tickets', TicketsRouter);
AdministrativeRouter.use('/rooms', RoomRouter);
AdministrativeRouter.use('/supplies', SuppliesRouter);
AdministrativeRouter.use('/receipts', ReceiptRouter);


export default AdministrativeRouter;