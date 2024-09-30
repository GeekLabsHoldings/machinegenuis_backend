import { Schema , model } from "mongoose";
import IBroadCastMessage from "../IBroadCastMessage.model";
import { SchemaTypesReference } from "../../Utils/Schemas/SchemaTypesReference";
import {EnumStringRequired, RefType, RequiredString} from "../../Utils/Schemas";
import { BroadCastMessageArr } from "../../Utils/BroadCastMessageType";

const BroadCastMessageSchema = new Schema<IBroadCastMessage>({
  messageType:EnumStringRequired(BroadCastMessageArr) ,
  message: RequiredString,
  employee: RefType(SchemaTypesReference.Employee, true),
});
const BroadCastMessageModel = model(SchemaTypesReference.BroadCastMessage, BroadCastMessageSchema);  
export default BroadCastMessageModel;