import { Types } from "mongoose";
import IEmployeeModel from "../../Employee/IEmployeeModel";

export default interface IReceiptModel {
    employee: Types.ObjectId | string | IEmployeeModel;
    receiptUrl: string;
    totalPrice: number;
    createdAt: number
}