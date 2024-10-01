import BroadCastMessageModel from "../../../Model/Operations/BroadCast/BroadCastMessage.model";
import IBroadCastMessage from "../../../Model/Operations/BroadCast/IBroadCastMessage.model";

export async function createBroadCastMessage(data: IBroadCastMessage) {
  const broadCastMessage = await BroadCastMessageModel.create(data);
  return broadCastMessage;
}
export async function getAllBroadCastMessages() {
  const broadCastMessage = await BroadCastMessageModel.find({})
    .populate("employee", "firstName lastName")
    .sort({ createdAt: -1 });
  return broadCastMessage;
}
