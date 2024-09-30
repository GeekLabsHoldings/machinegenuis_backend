import BroadCastMessageModel from "../../../Model/Operations/BroadCastMessage.model";
import IBroadCastMessage from "../../../Model/Operations/IBroadCastMessage.model";

async function createBroadCastMessage(data: IBroadCastMessage) {
  const broadCastMessage = await BroadCastMessageModel.create(data);
  return broadCastMessage;
}
