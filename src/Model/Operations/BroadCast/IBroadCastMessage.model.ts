import { Types } from "mongoose";
import IEmployeeModel from "../../Employee/IEmployeeModel";
export default interface IBroadCastMessage {
  messageType: string;
  message: string;
  employee: Types.ObjectId | string | IEmployeeModel;
}
