import { Router } from "express";
import * as BroadCastController from "../../../Controller/Operations/BroadCastNotification/BroadCastMessage";
const BroadCastMessageRouter = Router();
BroadCastMessageRouter.post(
  "/create-broad-cast-message",
  BroadCastController.sendMessageNotification
);
BroadCastMessageRouter.get(
  "/get-broad-cast-message",
  BroadCastController.getBroadCastMessages
);
export default BroadCastMessageRouter;
