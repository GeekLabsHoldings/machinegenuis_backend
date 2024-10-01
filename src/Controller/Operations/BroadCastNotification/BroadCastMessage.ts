import IBroadCastMessage from "../../../Model/Operations/IBroadCastMessage.model";
import eventEmitter from "../../../Utils/EventEmitter/eventEmitter";
import systemError from "../../../Utils/Error/SystemError";
import { Request, Response } from "express";
import { createBroadCastMessage, getAllBroadCastMessages } from "../../../Service/Operations/BroadCastMessage/BroadCastMessage.service";
export const sendMessageNotification = async (req: Request, res: Response) => {
  try {
    const user = req.body.currentUser._id;
    const data: IBroadCastMessage = {
      messageType: req.body.messageType,
      message: req.body.message,
      employee: user,
    };
    const createMessage = await createBroadCastMessage(data);
    const notificationData = {
      messageType: req.body.messageType,
      message: req.body.message,
      firstName: req.body.currentUser.firstName,
      lastName: req.body.currentUser.lastName,
    };
    eventEmitter.emit("BroadCastNotification", notificationData);
    return res.status(200).json({
      message: "Message Sent Successfully",
      data: createMessage,
      firstName: req.body.currentUser.firstName,
      lastName: req.body.currentUser.lastName,
    });
  } catch (error) {
    return systemError.sendError(res, error);
  }
};
export const getBroadCastMessages = async (req: Request, res: Response) => {
  try {
    const broadCastMessage = await getAllBroadCastMessages();
    return res.status(200).json({
      data: broadCastMessage,
    });
  } catch (error) {
    return systemError.sendError(res, error);
  }
};