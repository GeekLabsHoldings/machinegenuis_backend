import BroadCastMessageModel from "../../../Model/Operations/BroadCast/BroadCastMessage.model";
import IBroadCastMessage from "../../../Model/Operations/BroadCast/IBroadCastMessage.model";

async function createBroadCastMessage(data: IBroadCastMessage) {
  const broadCastMessage = await BroadCastMessageModel.create(data);
  return broadCastMessage;
}
