import { Schema , model } from "mongoose";
import IBroadCastMessage from "../IBroadCastMessage.model";
import { BroadCastMessageArr } from "../../../Utils/BroadCastMessageType";
import { EnumStringRequired, RequiredString, RefType } from "../../../Utils/Schemas";
import { SchemaTypesReference } from "../../../Utils/Schemas/SchemaTypesReference";


const BroadCastMessageSchema = new Schema<IBroadCastMessage>({
  messageType:EnumStringRequired(BroadCastMessageArr) ,
  message: RequiredString,
  employee: RefType(SchemaTypesReference.Employee, true),
});
const BroadCastMessageModel = model(SchemaTypesReference.BroadCastMessage, BroadCastMessageSchema);  
export default BroadCastMessageModel;